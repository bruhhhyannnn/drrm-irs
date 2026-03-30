import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Observee Areas"
      table="observee_areas"
      module="Observee Areas"
      nameKey="area_name"
      basePath="/settings/observee-areas"
      editId={params.id}
    />
  );
}
