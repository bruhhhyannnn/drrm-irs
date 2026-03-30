import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Buildings & Zones"
      table="buildings"
      module="Buildings"
      nameKey="buildingName"
      basePath="/settings/buildings"
    />
  );
}
