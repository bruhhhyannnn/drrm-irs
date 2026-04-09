import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return <SettingsForm title="Locations" table="locations" editId={params.id} />;
}
