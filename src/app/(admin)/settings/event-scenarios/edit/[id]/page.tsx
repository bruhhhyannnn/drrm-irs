import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Event Scenarios"
      table="event_scenarios"
      module="Event Scenarios"
      nameKey="scenario_name"
      basePath="/settings/event-scenarios"
      editId={params.id}
    />
  );
}
