import { SettingsForm } from '@/components/settings/settings-form';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Event Actions"
      table="event-actions"
      module="Event Actions"
      nameKey="actionName"
      basePath="/settings/event-actions"
    />
  );
}
