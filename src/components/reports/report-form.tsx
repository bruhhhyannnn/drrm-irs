'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useReport,
  useCreateReport,
  useUpdateReport,
  useEvents,
  useClusters,
  useUnits,
  useLocations,
} from '@/hooks';
import { reportSchema, type ReportFormData } from '@/lib';
import { useAuthStore } from '@/store';
import { HEADCOUNT_FIELDS } from '@/types';
import { PageBreadcrumb } from '@/components/common';
import { Input, Label, Select, Button, Spinner } from '@/components/ui';
import toast from 'react-hot-toast';

interface ReportFormProps {
  editId?: string;
  eventId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReportForm({ editId, eventId, onSuccess, onCancel }: ReportFormProps) {
  const router = useRouter();
  const isEdit = !!editId;
  const userId = useAuthStore((s) => s.userProfile?.id);

  const { data: existingReport, isLoading: isReportLoading } = useReport(editId);
  const createReport = useCreateReport();
  const updateReport = useUpdateReport();

  const { data: events = [] } = useEvents();
  const { data: clusters = [] } = useClusters();

  const [selectedClusterId, setSelectedClusterId] = useState('');
  const { data: units = [] } = useUnits(selectedClusterId || undefined);
  const { data: locations = [] } = useLocations(selectedClusterId || undefined);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      event_id: eventId ?? '',
      faculty_members: 0,
      admin_members: 0,
      reps_members: 0,
      ra_members: 0,
      students: 0,
      philcare_staff: 0,
      security_personnel: 0,
      construction_workers: 0,
      tenants: 0,
      health_workers: 0,
      non_academic_staff: 0,
      guests: 0,
      missing_count: 0,
      casualties_count: 0,
    },
  });

  useEffect(() => {
    if (existingReport) {
      reset({
        event_id: existingReport.event_id,
        cluster_id: existingReport.cluster_id,
        unit_id: existingReport.unit_id ?? '',
        location_id: existingReport.location_id ?? '',
        faculty_members: existingReport.faculty_members,
        admin_members: existingReport.admin_members,
        reps_members: existingReport.reps_members,
        ra_members: existingReport.ra_members,
        students: existingReport.students,
        philcare_staff: existingReport.philcare_staff,
        security_personnel: existingReport.security_personnel,
        construction_workers: existingReport.construction_workers,
        tenants: existingReport.tenants,
        health_workers: existingReport.health_workers,
        non_academic_staff: existingReport.non_academic_staff,
        guests: existingReport.guests,
        missing_count: existingReport.missing_count,
        casualties_count: existingReport.casualties_count,
      });
      if (existingReport.cluster_id) setSelectedClusterId(existingReport.cluster_id);
    }
  }, [existingReport, reset]);

  const onSubmit = handleSubmit((data) => {
    const headcounts = {
      faculty_members: data.faculty_members,
      admin_members: data.admin_members,
      reps_members: data.reps_members,
      ra_members: data.ra_members,
      students: data.students,
      philcare_staff: data.philcare_staff,
      security_personnel: data.security_personnel,
      construction_workers: data.construction_workers,
      tenants: data.tenants,
      health_workers: data.health_workers,
      non_academic_staff: data.non_academic_staff,
      guests: data.guests,
      missing_count: data.missing_count,
      casualties_count: data.casualties_count,
    };

    if (isEdit) {
      updateReport.mutate(
        {
          id: editId!,
          data: {
            event: { connect: { id: data.event_id } },
            cluster: { connect: { id: data.cluster_id } },
            unit: data.unit_id ? { connect: { id: data.unit_id } } : { disconnect: true },
            location: data.location_id
              ? { connect: { id: data.location_id } }
              : { disconnect: true },
            ...headcounts,
          },
        },
        {
          onSuccess: () => {
            toast.success('Report updated');
            onSuccess ? onSuccess() : router.push('/reports');
          },
          onError: (err) => toast.error(err.message),
        }
      );
    } else {
      createReport.mutate(
        {
          event: { connect: { id: data.event_id } },
          cluster: { connect: { id: data.cluster_id } },
          ...(data.unit_id && { unit: { connect: { id: data.unit_id } } }),
          ...(data.location_id && { location: { connect: { id: data.location_id } } }),
          ...(userId && { user: { connect: { id: userId } } }),
          ...headcounts,
        },
        {
          onSuccess: () => {
            toast.success('Report submitted');
            onSuccess ? onSuccess() : router.push('/reports');
          },
          onError: (err) => toast.error(err.message),
        }
      );
    }
  });

  const eventOptions = events.map((e) => ({ value: e.id, label: e.name }));
  const clusterOptions = clusters.map((c) => ({ value: c.id, label: c.name }));
  const unitOptions = units.map((u) => ({ value: u.id, label: u.name }));
  const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }));

  const isPending = isSubmitting || createReport.isPending || updateReport.isPending;

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={isEdit ? 'Edit Report' : 'Submit Report'} />

      <div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        {isEdit && isReportLoading ? (
          <Spinner center />
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Context */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label required>Event</Label>
                <Select
                  options={eventOptions}
                  placeholder="Select event..."
                  error={!!errors.event_id}
                  hint={errors.event_id?.message}
                  disabled={!!eventId}
                  value={watch('event_id') ?? ''}
                  onChange={(e) => setValue('event_id', e.target.value)}
                />
              </div>
              <div>
                <Label required>Cluster</Label>
                <Select
                  options={clusterOptions}
                  placeholder="Select cluster..."
                  error={!!errors.cluster_id}
                  hint={errors.cluster_id?.message}
                  value={watch('cluster_id') ?? ''}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedClusterId(id);
                    setValue('cluster_id', id);
                    setValue('unit_id', '');
                    setValue('location_id', '');
                  }}
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  options={unitOptions}
                  placeholder="Select unit..."
                  value={watch('unit_id') ?? ''}
                  onChange={(e) => setValue('unit_id', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <Label>Location</Label>
                <Select
                  options={locationOptions}
                  placeholder="Select location..."
                  value={watch('location_id') ?? ''}
                  onChange={(e) => setValue('location_id', e.target.value)}
                />
              </div>
            </div>

            {/* Headcount */}
            <div>
              <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">Headcount</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {HEADCOUNT_FIELDS.map((field) => (
                  <div key={field.key}>
                    <Label>{field.label}</Label>
                    <Input type="number" min={0} {...register(field.key as keyof ReportFormData)} />
                  </div>
                ))}
              </div>
            </div>

            {/* Cached counts */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>Missing Persons</Label>
                <Input type="number" min={0} {...register('missing_count')} />
              </div>
              <div>
                <Label>Casualties</Label>
                <Input type="number" min={0} {...register('casualties_count')} />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" isLoading={isPending} loadingText="Saving...">
                {isEdit ? 'Update Report' : 'Submit Report'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => (onCancel ? onCancel() : router.push('/reports'))}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
