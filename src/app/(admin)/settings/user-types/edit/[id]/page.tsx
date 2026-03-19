import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="User Types"
      table="user-types"
      module="User Types"
      nameKey="typeName"
      basePath="/settings/user-types"
      editId={params.id}
    />
  );
}
