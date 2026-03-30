import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="User Types"
      table="user_types"
      module="User Types"
      nameKey="type_name"
      basePath="/settings/user-types"
      editId={params.id}
    />
  );
}
