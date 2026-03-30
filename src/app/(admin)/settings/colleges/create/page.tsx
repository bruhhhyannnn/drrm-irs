import { SettingsForm } from '@/components/settings';
export default function CreatePage() {
  return (
    <SettingsForm
      title="Colleges & Units"
      table="college_units"
      module="Colleges"
      nameKey="name"
      basePath="/settings/colleges"
    />
  );
}
