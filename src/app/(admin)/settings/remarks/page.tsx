import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Remarks"
      table="remarks"
      module="Remarks"
      nameKey="remark_name"
      basePath="/settings/remarks"
    />
  );
}
