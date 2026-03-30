import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Colleges & Units"
      table="college_units"
      module="Colleges"
      nameKey="name"
      basePath="/settings/colleges"
      editId={params.id}
    />
  );
}
