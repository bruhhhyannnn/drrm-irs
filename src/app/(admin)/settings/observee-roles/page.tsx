import { SettingsTablePage } from '@/components/settings/settings-table-page';
export default function Page() {
  return (
    <SettingsTablePage
      title="Observee Roles"
      table="observee-roles"
      module="Observee Roles"
      nameKey="roleName"
      basePath="/settings/observee-roles"
    />
  );
}
