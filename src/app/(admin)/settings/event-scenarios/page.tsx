// src/app/(admin)/settings/event-scenarios/page.tsx
import { SettingsTablePage } from '@/components/settings';
export default function EventScenariosPage() {
  return (
    <SettingsTablePage
      title="Event Scenarios"
      table="event_scenarios"
      module="Event Scenarios"
      nameKey="scenario_name"
      basePath="/settings/event-scenarios"
    />
  );
}
