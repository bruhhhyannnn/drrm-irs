import { SettingsTablePage } from '@/components/settings/settings-table-page';
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
