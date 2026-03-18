import { SettingsForm } from '@/components/settings/settings-form';
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
