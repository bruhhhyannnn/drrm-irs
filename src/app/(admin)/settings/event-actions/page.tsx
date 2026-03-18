import { SettingsTablePage } from '@/components/settings/settings-table-page';
export default function Page() {
  return (
    <SettingsTablePage
      title="Event Actions"
      table="event-actions"
      module="Event Actions"
      nameKey="actionName"
      basePath="/settings/event-actions"
    />
  );
}
