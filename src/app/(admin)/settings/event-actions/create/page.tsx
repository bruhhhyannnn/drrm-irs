import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Event Actions"
      table="event_actions"
      module="Event Actions"
      nameKey="action_name"
      basePath="/settings/event-actions"
    />
  );
}
