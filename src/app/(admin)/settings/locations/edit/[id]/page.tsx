import { SettingsForm } from '@/components/settings/settings-form';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Locations"
      table="locations"
      module="Locations"
      nameKey="locationName"
      basePath="/settings/locations"
      editId={params.id}
    />
  );
}
