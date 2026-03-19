import { UserForm } from '@/components/users';
export default function EditUserPage({ params }: { params: { id: string } }) {
  return <UserForm editId={params.id} />;
}
