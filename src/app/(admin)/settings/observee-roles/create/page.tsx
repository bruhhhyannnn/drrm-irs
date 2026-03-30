import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Observee Roles"
      table="observee_roles"
      module="Observee Roles"
      nameKey="role_name"
      basePath="/settings/observee-roles"
    />
  );
}
