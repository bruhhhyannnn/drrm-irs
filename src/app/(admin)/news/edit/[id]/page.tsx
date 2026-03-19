import { NewsForm } from '@/components/news';
export default function EditNewsPage({ params }: { params: { id: string } }) {
  return <NewsForm editId={params.id} />;
}
