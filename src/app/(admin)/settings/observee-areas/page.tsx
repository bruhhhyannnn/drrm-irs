import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Observee Areas"
      table="observee_areas"
      module="Observee Areas"
      nameKey="area_name"
      basePath="/settings/observee-areas"
    />
  );
}
