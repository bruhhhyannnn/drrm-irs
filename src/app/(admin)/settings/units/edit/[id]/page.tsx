import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return <SettingsForm title="Units" table="units" editId={params.id} />;
}
