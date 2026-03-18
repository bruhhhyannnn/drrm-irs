import { SettingsTablePage } from '@/components/settings/settings-table-page';
export default function Page() {
  return (
    <SettingsTablePage
      title="Observee Areas"
      table="observee-areas"
      module="Observee Areas"
      nameKey="areaName"
      basePath="/settings/observee-areas"
    />
  );
}
