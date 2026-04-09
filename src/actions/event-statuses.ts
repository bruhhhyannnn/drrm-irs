'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getEventStatuses() {
  return prisma.eventStatus.findMany({ orderBy: { name: 'asc' } });
}

export async function createEventStatus(name: string) {
  const status = await prisma.eventStatus.create({ data: { name } });
  revalidatePath('/settings');
  return status;
}

export async function updateEventStatus(id: string, data: { name?: string; is_active?: boolean }) {
  const status = await prisma.eventStatus.update({ where: { id }, data });
  revalidatePath('/settings');
  return status;
}

export async function deleteEventStatus(id: string) {
  await prisma.eventStatus.delete({ where: { id } });
  revalidatePath('/settings');
}
