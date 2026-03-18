import { SettingsForm } from '@/components/settings/settings-form';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Observee Roles"
      table="observee-roles"
      module="Observee Roles"
      nameKey="roleName"
      basePath="/settings/observee-roles"
      editId={params.id}
    />
  );
}
