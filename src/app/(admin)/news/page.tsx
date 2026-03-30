'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Search, Plus, Pencil } from 'lucide-react';
import { useNews } from '@/hooks';
import { PageBreadcrumb } from '@/components/common';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Input,
  Button,
  Pagination,
  Spinner,
} from '@/components/ui';

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
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Image URL</TableHead>
            <TableHead>Source URL</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="py-10 text-center" colSpan={12}>
                <Spinner center />
              </TableCell>
            </TableRow>
          ) : (
            data?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-sm">{item.id}</TableCell>
                <TableCell className="max-w-75 truncate font-medium text-gray-900 dark:text-white">
                  {item.title}
                </TableCell>
                <TableCell className="max-w-100 truncate">{item.content}</TableCell>
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
                  {item.created_at ? format(new Date(item.created_at), 'MMM d, yyyy') : '—'}
                </TableCell>
                <TableCell>
                  {item.updated_at ? format(new Date(item.updated_at), 'MMM d, yyyy') : '—'}
                </TableCell>
                <TableCell className="max-w-100 truncate">{item.image_url || '—'}</TableCell>
                <TableCell className="max-w-100 truncate">{item.source_url || '—'}</TableCell>
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
              <TableCell className="py-10 text-center text-gray-400" colSpan={12}>
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
