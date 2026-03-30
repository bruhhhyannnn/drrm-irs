import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Observee Roles"
      table="observee_roles"
      module="Observee Roles"
      nameKey="role_name"
      basePath="/settings/observee-roles"
    />
  );
}
