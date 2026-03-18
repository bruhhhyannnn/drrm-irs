import { SettingsTablePage } from '@/components/settings/settings-table-page';
export default function Page() {
  return (
    <SettingsTablePage
      title="User Types"
      table="user-types"
      module="User Types"
      nameKey="typeName"
      basePath="/settings/user-types"
    />
  );
}
