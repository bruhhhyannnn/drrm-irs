import { SettingsTablePage } from '@/components/settings/settings-table-page';
export default function Page() {
  return (
    <SettingsTablePage
      title="Remarks"
      table="remarks"
      module="Remarks"
      nameKey="remarkName"
      basePath="/settings/remarks"
    />
  );
}
