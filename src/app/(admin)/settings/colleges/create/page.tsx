import { SettingsForm } from '@/components/settings/settings-form';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Colleges & Units"
      table="colleges-units"
      module="Colleges"
      nameKey="collegeName"
      basePath="/settings/colleges"
    />
  );
}
