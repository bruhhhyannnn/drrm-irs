import { NewsForm } from '@/components/news/news-form';
export default function EditNewsPage({ params }: { params: { id: string } }) {
  return <NewsForm editId={params.id} />;
}
