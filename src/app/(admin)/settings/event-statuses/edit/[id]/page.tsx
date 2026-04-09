import { SettingsForm } from '@/components/settings';
export default function EditPage({ params }: { params: { id: string } }) {
  return <SettingsForm title="Event Statuses" table="event_statuses" editId={params.id} />;
}
