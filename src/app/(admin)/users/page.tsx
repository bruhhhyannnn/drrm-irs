'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Pencil } from 'lucide-react';
import { useUsers } from '@/hooks';
import { supabase } from '@/lib';
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
  Spinner,
} from '@/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const USER_TYPE_LABELS: Record<number, string> = {
  1: 'Admin',
  2: 'Encoder',
  3: 'Viewer',
};

export default function UsersPage() {
  const [query, setQuery] = useState('');
  const { data: users, isLoading } = useUsers(query);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleToggleStatus = async (id: string, current: boolean) => {
    if (!confirm(`${current ? 'Deactivate' : 'Activate'} this user?`)) return;
    setTogglingId(id);
    const { error } = await supabase.from('users').update({ isActive: !current }).eq('id', id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`User ${current ? 'deactivated' : 'activated'}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
    setTogglingId(null);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Users" />

      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Link href="/users/create">
          <Button startIcon={<Plus size={16} />}>Add User</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="py-10 text-center" colSpan={8}>
                <Spinner center />
              </TableCell>
            </TableRow>
          ) : (
            users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {[user.firstname, user.middlename, user.lastname].filter(Boolean).join(' ')}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cluster}</TableCell>
                <TableCell>{user.encoder_position}</TableCell>
                <TableCell>
                  <Badge color="primary" size="sm">
                    {USER_TYPE_LABELS[user.usertype] ?? `Type ${user.usertype}`}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive ?? true)}
                    disabled={togglingId === user.id}
                    className="cursor-pointer"
                  >
                    <Badge color={user.isActive ? 'success' : 'error'} size="sm">
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/users/edit/${user.id}`}>
                      <button className="hover:text-brand-500 text-gray-400">
                        <Pencil size={15} />
                      </button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
          {!isLoading && !users?.length && (
            <TableRow>
              <TableCell className="py-10 text-center text-gray-400" colSpan={8}>
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
