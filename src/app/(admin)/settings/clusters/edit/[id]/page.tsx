import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return <SettingsForm title="Clusters" table="clusters" editId={params.id} />;
}
