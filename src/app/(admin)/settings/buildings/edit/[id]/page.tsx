import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm
      title="Buildings & Zones"
      table="buildings"
      module="Buildings"
      nameKey="buildingName"
      basePath="/settings/buildings"
      editId={params.id}
    />
  );
}
