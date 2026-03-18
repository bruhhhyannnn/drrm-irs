import { SettingsForm } from '@/components/settings/settings-form';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Observee Roles"
      table="observee-roles"
      module="Observee Roles"
      nameKey="roleName"
      basePath="/settings/observee-roles"
    />
  );
}
