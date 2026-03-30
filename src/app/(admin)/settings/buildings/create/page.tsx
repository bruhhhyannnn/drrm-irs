import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Buildings & Zones"
      table="buildings"
      module="Buildings"
      nameKey="buildingName"
      basePath="/settings/buildings"
    />
  );
}
