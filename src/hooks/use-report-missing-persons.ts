import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReportMissingPersons,
  createReportMissingPerson,
  updateReportMissingPerson,
  deleteReportMissingPerson,
} from '@/actions/report-missing-persons';

export function useReportMissingPersons(reportId?: string) {
  return useQuery({
    queryKey: ['report-missing-persons', reportId],
    queryFn: () => getReportMissingPersons(reportId!),
    enabled: !!reportId,
  });
}

export function useCreateReportMissingPerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { report_id: string; name: string }) => createReportMissingPerson(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['report-missing-persons', variables.report_id],
      });
    },
  });
}

export function useUpdateReportMissingPerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      updateReportMissingPerson(id, data),
    onSuccess: (_data, _variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['report-missing-persons'] });
    },
  });
}

export function useDeleteReportMissingPerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reportId }: { id: string; reportId: string }) =>
      deleteReportMissingPerson(id),
    onSuccess: (_data, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ['report-missing-persons', reportId] });
    },
  });
}
