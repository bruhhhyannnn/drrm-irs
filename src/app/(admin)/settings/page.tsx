import Link from 'next/link';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import { ChevronRight } from 'lucide-react';

const settings = [
  {
    label: 'Event Scenarios',
    path: '/settings/event-scenarios',
    desc: 'Manage drill and incident scenario types',
  },
  {
    label: 'Event Actions',
    path: '/settings/event-actions',
    desc: 'Define response actions per scenario',
  },
  { label: 'Locations', path: '/settings/locations', desc: 'Campus locations and areas' },
  { label: 'User Types', path: '/settings/user-types', desc: 'Role and access level definitions' },
  {
    label: 'Colleges & Units',
    path: '/settings/colleges',
    desc: 'Academic and administrative units',
  },
  {
    label: 'Buildings & Zones',
    path: '/settings/buildings',
    desc: 'Campus buildings and zone mapping',
  },
  {
    label: 'Observee Areas',
    path: '/settings/observee-areas',
    desc: 'Areas assigned to observees',
  },
  {
    label: 'Observee Roles',
    path: '/settings/observee-roles',
    desc: 'Roles for incident response teams',
  },
  { label: 'Remarks', path: '/settings/remarks', desc: 'Standard remark templates' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Settings" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {settings.map((s) => (
          <Link
            key={s.path}
            href={s.path}
            className="hover:border-brand-300 hover:shadow-theme-sm dark:hover:border-brand-700 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition dark:border-white/5 dark:bg-white/3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.label}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
            <ChevronRight size={18} className="shrink-0 text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
