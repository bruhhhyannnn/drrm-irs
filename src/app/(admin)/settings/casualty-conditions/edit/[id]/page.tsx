import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <SettingsForm title="Casualty Conditions" table="casualty_conditions" editId={params.id} />
  );
}
