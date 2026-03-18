import { UserForm } from '@/components/users/user-form';
export default function EditUserPage({ params }: { params: { id: string } }) {
  return <UserForm editId={params.id} />;
}
