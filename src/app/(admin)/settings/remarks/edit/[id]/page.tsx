import { SettingsForm } from '@/components/settings/settings-form';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Remarks"
      table="remarks"
      module="Remarks"
      nameKey="remarkName"
      basePath="/settings/remarks"
      editId={params.id}
    />
  );
}
