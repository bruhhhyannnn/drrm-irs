import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Observee Areas"
      table="observee_areas"
      module="Observee Areas"
      nameKey="area_name"
      basePath="/settings/observee-areas"
    />
  );
}
