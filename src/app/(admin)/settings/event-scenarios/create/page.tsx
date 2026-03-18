import { SettingsForm } from '@/components/settings/settings-form';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Event Scenarios"
      table="event-scenarios"
      module="Event Scenarios"
      nameKey="scenarioName"
      basePath="/settings/event-scenarios"
    />
  );
}
