'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getPositions() {
  return prisma.position.findMany({ orderBy: { name: 'asc' } });
}

export async function getPosition(id: string) {
  return prisma.position.findUnique({ where: { id } });
}

export async function createPosition(name: string) {
  const position = await prisma.position.create({ data: { name } });
  revalidatePath('/settings');
  return position;
}

export async function updatePosition(id: string, data: { name?: string; is_active?: boolean }) {
  const position = await prisma.position.update({ where: { id }, data });
  revalidatePath('/settings');
  return position;
}

export async function deletePosition(id: string) {
  await prisma.position.delete({ where: { id } });
  revalidatePath('/settings');
}
