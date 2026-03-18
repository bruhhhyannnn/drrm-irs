import { SettingsTablePage } from '@/components/settings/settings-table-page';
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
