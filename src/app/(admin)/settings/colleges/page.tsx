import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Colleges & Units"
      table="college_units"
      module="Colleges"
      nameKey="name"
      basePath="/settings/colleges"
    />
  );
}
