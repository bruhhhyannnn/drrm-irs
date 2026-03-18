import { SettingsForm } from '@/components/settings/settings-form';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Colleges & Units"
      table="colleges-units"
      module="Colleges"
      nameKey="collegeName"
      basePath="/settings/colleges"
      editId={params.id}
    />
  );
}
