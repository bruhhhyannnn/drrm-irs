import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Remarks"
      table="remarks"
      module="Remarks"
      nameKey="remarkName"
      basePath="/settings/remarks"
    />
  );
}
