import { SettingsTablePage } from '@/components/settings';
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
