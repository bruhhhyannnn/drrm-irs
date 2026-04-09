'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// TODO: change this one
export type CreateUserInput = {
  auth_id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  suffix?: string | null;
  username: string;
  email: string;
  unit_id?: string | null;
  position_id?: string | null;
  user_type_id: string;
  is_active?: boolean;
};

export type UpdateUserInput = Omit<Partial<CreateUserInput>, 'auth_id'>;

export async function getUsers(query?: string) {
  return prisma.user.findMany({
    where: query
      ? {
          OR: [
            { first_name: { contains: query, mode: 'insensitive' } },
            { last_name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: { unit: { include: { cluster: true } }, position: true, user_type: true },
    orderBy: { created_at: 'desc' },
  });
}

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { unit: { include: { cluster: true } }, position: true, user_type: true },
  });
}

export async function getUserByAuthId(authId: string) {
  return prisma.user.findUnique({
    where: { auth_id: authId },
    include: { unit: { include: { cluster: true } }, position: true, user_type: true },
  });
}

export async function createUser(data: CreateUserInput) {
  const user = await prisma.user.create({ data });
  revalidatePath('/users');
  return user;
}

export async function updateUser(id: string, data: UpdateUserInput) {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  revalidatePath('/users');
  return user;
}

export async function toggleUserStatus(id: string, current: boolean) {
  const user = await prisma.user.update({
    where: { id },
    data: { is_active: !current },
  });
  revalidatePath('/users');
  return user;
}
