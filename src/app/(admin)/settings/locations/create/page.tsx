import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Locations"
      table="locations"
      module="Locations"
      nameKey="locationName"
      basePath="/settings/locations"
    />
  );
}
