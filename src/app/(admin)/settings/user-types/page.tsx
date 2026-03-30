import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="User Types"
      table="user_types"
      module="User Types"
      nameKey="type_name"
      basePath="/settings/user-types"
    />
  );
}
