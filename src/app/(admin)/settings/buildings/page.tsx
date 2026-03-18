import { SettingsTablePage } from '@/components/settings/settings-table-page';
export default function Page() {
  return (
    <SettingsTablePage
      title="Buildings & Zones"
      table="buildings-zones"
      module="Buildings"
      nameKey="buildingName"
      basePath="/settings/buildings"
    />
  );
}
