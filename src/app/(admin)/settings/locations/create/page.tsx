import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Locations"
      table="locations"
      module="Locations"
      nameKey="location_name"
      basePath="/settings/locations"
    />
  );
}
