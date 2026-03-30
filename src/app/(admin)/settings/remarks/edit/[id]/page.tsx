import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Remarks"
      table="remarks"
      module="Remarks"
      nameKey="remark_name"
      basePath="/settings/remarks"
      editId={params.id}
    />
  );
}
