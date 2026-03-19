// src/app/(admin)/settings/event-scenarios/page.tsx
import { SettingsTablePage } from '@/components/settings';
export default function EventScenariosPage() {
  return (
    <SettingsTablePage
      title="Event Scenarios"
      table="event-scenarios"
      module="Event Scenarios"
      nameKey="scenarioName"
      basePath="/settings/event-scenarios"
    />
  );
}
