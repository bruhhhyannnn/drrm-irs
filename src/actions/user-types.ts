'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUserTypes() {
  return prisma.userType.findMany({ orderBy: { name: 'asc' } });
}

export async function createUserType(name: string) {
  const userType = await prisma.userType.create({ data: { name } });
  revalidatePath('/settings');
  return userType;
}

export async function updateUserType(id: string, data: { name?: string; is_active?: boolean }) {
  const userType = await prisma.userType.update({ where: { id }, data });
  revalidatePath('/settings');
  return userType;
}

export async function deleteUserType(id: string) {
  await prisma.userType.delete({ where: { id } });
  revalidatePath('/settings');
}
