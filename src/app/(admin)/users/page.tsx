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
            <TableHead>First Name</TableHead>
            <TableHead>Middle Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Suffix</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Auth ID</TableHead>
            <TableHead>Cluster</TableHead>
            <TableHead>Office</TableHead>
            <TableHead>Building Name</TableHead>
            <TableHead>Encoder Position</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Encoder ID</TableHead>
            <TableHead>Zone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell className="py-10 text-center" colSpan={16}>
                <Spinner center />
              </TableCell>
            </TableRow>
          ) : (
            users?.map((user) => (
              <TableRow key={user.encoder_id}>
                <TableCell className="font-medium text-gray-900 dark:text-white">
                  {user.firstname}
                </TableCell>
                <TableCell>{user.middlename || '-'}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.suffix || '-'}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-mono text-sm">{user.authid}</TableCell>
                <TableCell>{user.cluster || '-'}</TableCell>
                <TableCell>{user.office || '-'}</TableCell>
                <TableCell>{user.bldgname || '-'}</TableCell>
                <TableCell>{user.encoder_position || '-'}</TableCell>
                <TableCell>
                  <Badge color="primary" size="sm">
                    {USER_TYPE_LABELS[user.usertype] ?? `Type ${user.usertype}`}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-mono text-sm">{user.encoder_id}</TableCell>
                <TableCell>{user.zone || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link href={`/users/edit/${user.encoder_id}`}>
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
              <TableCell className="py-10 text-center text-gray-400" colSpan={16}>
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
