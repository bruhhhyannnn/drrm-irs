import { SettingsTablePage } from '@/components/settings';
export default function Page() {
  return (
    <SettingsTablePage
      title="Colleges & Units"
      table="colleges-units"
      module="Colleges"
      nameKey="collegeName"
      basePath="/settings/colleges"
    />
  );
}
