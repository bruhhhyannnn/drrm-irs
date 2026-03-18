import { SettingsForm } from '@/components/settings/settings-form';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Buildings & Zones"
      table="buildings-zones"
      module="Buildings"
      nameKey="buildingName"
      basePath="/settings/buildings"
      editId={params.id}
    />
  );
}
