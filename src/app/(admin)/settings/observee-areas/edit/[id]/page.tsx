import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Observee Areas"
      table="observee-areas"
      module="Observee Areas"
      nameKey="areaName"
      basePath="/settings/observee-areas"
      editId={params.id}
    />
  );
}
