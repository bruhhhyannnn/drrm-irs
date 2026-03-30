import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Event Actions"
      table="event_actions"
      module="Event Actions"
      nameKey="action_name"
      basePath="/settings/event-actions"
    />
  );
}
