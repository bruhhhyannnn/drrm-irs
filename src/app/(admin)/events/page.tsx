'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  Search,
  Eye,
  CalendarDays,
  List,
  School,
  Dumbbell,
  CalendarCheck,
  MapPin,
  Clock,
  ChevronDown,
  X,
} from 'lucide-react';
import { useEvents } from '@/hooks/use-events';
import type { Event as DatabaseEvent } from '@/types/database';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';

// ─── Color helpers ───────────────────────────────────────────────────────────
type Category = 'actual' | 'drill' | string;

function getCategoryColor(category: Category) {
  switch (category?.toLowerCase()) {
    case 'actual':
      return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' };
    case 'drill':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' };
    default:
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
  }
}

function getCategoryIcon(category: Category) {
  switch (category?.toLowerCase()) {
    case 'actual':
      return <School size={16} />;
    case 'drill':
      return <Dumbbell size={16} />;
    default:
      return <CalendarCheck size={16} />;
  }
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'active':
      return { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' };
    case 'completed':
      return { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' };
    default:
      return { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' };
  }
}

// ─── Filter options ───────────────────────────────────────────────────────────
const FILTER_OPTIONS = [
  { value: 'all', label: 'All Events', icon: CalendarCheck, color: 'text-blue-600', iconBg: 'bg-blue-50' },
  { value: 'actual', label: 'Actual', icon: School, color: 'text-teal-600', iconBg: 'bg-teal-50' },
  { value: 'drill', label: 'Drill', icon: Dumbbell, color: 'text-amber-600', iconBg: 'bg-amber-50' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const s = getStatusColor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const c = getCategoryColor(category);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${c.bg} ${c.text} ${c.border}`}>
      {getCategoryIcon(category)}
      {category}
    </span>
  );
}

// ─── Event Card (list view) ───────────────────────────────────────────────────
function EventCard({ event }: { event: DatabaseEvent }) {
  const c = getCategoryColor(event.category ?? '');
  const start = event.timestampstart ? new Date(event.timestampstart) : null;
  const end = event.timestampend ? new Date(event.timestampend) : null;

  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-red-100 hover:shadow-md">
      <div className={`flex w-14 flex-shrink-0 flex-col items-center rounded-xl py-2.5 ${c.bg}`}>
        {start ? (
          <>
            <span className={`text-[11px] font-bold uppercase tracking-wide ${c.text}`}>
              {format(start, 'MMM')}
            </span>
            <span className={`text-2xl font-extrabold leading-none ${c.text}`}>
              {format(start, 'd')}
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-gray-900">{event.eventname}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
          {start && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {format(start, 'h:mm a')}
              {end && ` - ${format(end, 'h:mm a')}`}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={12} />
              <span className="max-w-[160px] truncate">{event.location}</span>
            </span>
          )}
          {event.eventdescription && (
            <span className="text-xs text-gray-500 max-w-[200px] truncate" title={event.eventdescription}>
              {event.eventdescription}
            </span>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {event.incidentcommander && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
              IC: {event.incidentcommander}
            </span>
          )}
          {event.liasonofficer && (
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
              LO: {event.liasonofficer}
            </span>
          )}
          {event.publicinformationofficer && (
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
              PIO: {event.publicinformationofficer}
            </span>
          )}
          {event.safetysecurityofficer && (
            <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
              SSO: {event.safetysecurityofficer}
            </span>
          )}
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
            event.eventstarted ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
          }`}>
            Started: {event.eventstarted ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col items-end gap-2">
        <CategoryBadge category={event.category ?? 'Unknown'} />
        <StatusBadge status={event.status ?? 'Unknown'} />
      </div>

      <Link
        href={`/events/details?id=${event.event_id}`}
        className="ml-1 flex-shrink-0 rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-100"
        title="View details"
      >
        <Eye size={16} />
      </Link>
    </div>
  );
}

// ─── Table view (wider screens) ───────────────────────────────────────────────
function EventTable({ events }: { events: DatabaseEvent[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {[
                'Start Date & Time',
                'End Date & Time',
                'Event Name',
                'Description',
                'Category',
                'Location',
                'Status',
                'Started',
                'Incident Commander',
                'Liaison Officer',
                'Public Info Officer',
                'Safety Officer',
                'Created At',
                ''
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.map((event) => {
              const start = event.timestampstart ? new Date(event.timestampstart) : null;
              const end = event.timestampend ? new Date(event.timestampend) : null;
              const created = event.created_at ? new Date(event.created_at) : null;
              return (
                <tr key={event.event_id} className="group transition-colors hover:bg-red-50/40">
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {start ? format(start, 'MMM d, yyyy h:mm a') : '—'}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {end ? format(end, 'MMM d, yyyy h:mm a') : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-gray-900">{event.eventname}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600 max-w-[200px] truncate" title={event.eventdescription || ''}>
                      {event.eventdescription || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <CategoryBadge category={event.category ?? 'Unknown'} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={13} className="text-gray-400" />
                      {event.location ?? '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={event.status ?? 'Unknown'} />
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      event.eventstarted
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        event.eventstarted ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      {event.eventstarted ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{event.incidentcommander || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{event.liasonofficer || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{event.publicinformationofficer || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">{event.safetysecurityofficer || '—'}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {created ? format(created, 'MMM d, yyyy h:mm a') : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/events/details?id=${event.event_id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                      <Eye size={13} />
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!events.length && (
              <tr>
                <td colSpan={14} className="py-16 text-center">
                  <EmptyState message="No events found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Empty / loading states ───────────────────────────────────────────────────
function EmptyState({ message, sub }: { message: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <CalendarCheck size={28} className="text-gray-400" />
      </div>
      <p className="text-base font-semibold text-gray-700">{message}</p>
      {sub && <p className="text-sm text-gray-400">{sub}</p>}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      <p className="text-sm text-gray-500">Loading events…</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
        <X size={28} className="text-red-500" />
      </div>
      <p className="text-base font-semibold text-gray-700">Unable to load events</p>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────
function FilterDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = FILTER_OPTIONS.find((o) => o.value === value) ?? FILTER_OPTIONS[0];
  const Icon = selected.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex min-w-[180px] items-center gap-3 rounded-2xl border-2 border-blue-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${selected.iconBg}`}>
          <Icon size={17} className={selected.color} />
        </span>
        <span className="flex-1 text-left text-sm font-medium text-gray-800">{selected.label}</span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
            {FILTER_OPTIONS.map((opt) => {
              const OptIcon = opt.icon;
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-gray-50 ${active ? 'bg-red-50' : ''}`}
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${opt.iconBg}`}>
                    <OptIcon size={16} className={opt.color} />
                  </span>
                  <span className={`font-medium ${active ? 'text-red-600' : 'text-gray-700'}`}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── View Toggle ──────────────────────────────────────────────────────────────
function ViewToggle({
  view,
  onChange,
}: {
  view: 'cards' | 'table';
  onChange: (v: 'cards' | 'table') => void;
}) {
  return (
    <div className="flex rounded-2xl bg-gray-100 p-1">
      {([
        { id: 'cards', label: 'Cards', Icon: List },
        { id: 'table', label: 'Table', Icon: CalendarDays },
      ] as const).map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 ${
            view === id ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [showSearch, setShowSearch] = useState(false);

  const { data: rawEvents, isLoading, error } = useEvents(query);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  const events = (rawEvents ?? []).filter((e: DatabaseEvent) => {
    if (filter !== 'all' && e.category?.toLowerCase() !== filter) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <PageBreadcrumb pageTitle="Events" />

      <div className="flex flex-wrap items-center gap-3">
        <FilterDropdown value={filter} onChange={setFilter} />

        <div className="flex-1" />

        <ViewToggle view={view} onChange={setView} />

        <div className="relative">
          <button
            onClick={() => setShowSearch((p) => !p)}
            className={`flex h-11 items-center gap-2 rounded-2xl border-2 px-4 text-sm font-semibold transition-all ${
              showSearch || query
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <Search size={15} />
            {query ? <span className="max-w-[120px] truncate">{query}</span> : 'Search'}
            {query && (
              <X
                size={13}
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery('');
                }}
                className="cursor-pointer text-red-400 hover:text-red-600"
              />
            )}
          </button>

          {showSearch && !query && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSearch(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                <p className="mb-3 text-sm font-bold text-gray-800">Search Events</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      autoFocus
                      placeholder="Event name…"
                      className="h-10 w-full rounded-xl border-2 border-gray-100 bg-gray-50 pl-8 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setQuery((e.target as HTMLInputElement).value.trim());
                          setShowSearch(false);
                        }
                      }}
                    />
                  </div>
                  <button
                    className="rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition-colors hover:bg-red-700"
                    onClick={(e) => {
                      const input = e.currentTarget.parentElement!.querySelector('input') as HTMLInputElement;
                      setQuery(input.value.trim());
                      setShowSearch(false);
                    }}
                  >
                    Go
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {filter !== 'all' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Filtered by:</span>
          <button
            onClick={() => setFilter('all')}
            className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            {FILTER_OPTIONS.find((o) => o.value === filter)?.label}
            <X size={11} />
          </button>
        </div>
      )}

      {events.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 shadow-sm">
          <EmptyState
            message={filter !== 'all' ? `No ${filter} events found` : 'No events found'}
            sub={filter !== 'all' ? 'Try selecting a different filter' : 'Events will appear here when scheduled'}
          />
        </div>
      ) : view === 'cards' ? (
        <div className="space-y-3">
          {events.map((event) => (
            <EventCard key={event.event_id} event={event} />
          ))}
        </div>
      ) : (
        <EventTable events={events} />
      )}
    </div>
  );
}
