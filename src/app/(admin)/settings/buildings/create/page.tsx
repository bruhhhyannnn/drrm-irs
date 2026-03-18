import { SettingsForm } from '@/components/settings/settings-form';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Buildings & Zones"
      table="buildings-zones"
      module="Buildings"
      nameKey="buildingName"
      basePath="/settings/buildings"
    />
  );
}
