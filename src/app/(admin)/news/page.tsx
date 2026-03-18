'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Plus, Pencil } from 'lucide-react';
import { useNews } from '@/hooks/use-queries';
import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';

const PER_PAGE = 10;

export default function NewsPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNews(page, query);

  const totalPages = Math.ceil((data?.total ?? 0) / PER_PAGE);

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="News" />

      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search news..."
            className="pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Link href="/news/create">
          <Button startIcon={<Plus size={16} />}>Add News</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="py-10 text-center" colSpan={6}>
                <div className="border-brand-500 mx-auto h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-75 truncate font-medium text-gray-900 dark:text-white">
                  {item.title}
                </TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Badge color={item.is_active ? 'success' : 'error'} size="sm">
                    {item.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {item.published_at ? format(new Date(item.published_at), 'MMM d, yyyy') : '—'}
                </TableCell>
                <TableCell>
                  <Link href={`/news/edit/${item.id}`}>
                    <button className="hover:text-brand-500 text-gray-400">
                      <Pencil size={15} />
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
          {!isLoading && !data?.data.length && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={6}>
                No news found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
