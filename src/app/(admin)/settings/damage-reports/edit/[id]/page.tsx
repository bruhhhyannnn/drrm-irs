import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return <SettingsForm title="Damage Conditions" table="damage_conditions" editId={params.id} />;
}
