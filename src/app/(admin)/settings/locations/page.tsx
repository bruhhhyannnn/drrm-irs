import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Locations"
      table="locations"
      module="Locations"
      nameKey="locationName"
      basePath="/settings/locations"
    />
  );
}
