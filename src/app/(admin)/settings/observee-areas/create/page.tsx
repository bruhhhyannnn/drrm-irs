import { SettingsForm } from '@/components/settings/settings-form';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Observee Areas"
      table="observee-areas"
      module="Observee Areas"
      nameKey="areaName"
      basePath="/settings/observee-areas"
    />
  );
}
