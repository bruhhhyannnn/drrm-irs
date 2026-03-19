import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="User Types"
      table="user-types"
      module="User Types"
      nameKey="typeName"
      basePath="/settings/user-types"
    />
  );
}
