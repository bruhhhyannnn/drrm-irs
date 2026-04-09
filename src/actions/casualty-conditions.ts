'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCasualtyConditions() {
  return prisma.casualtyCondition.findMany({ orderBy: { name: 'asc' } });
}

export async function createCasualtyCondition(name: string) {
  const condition = await prisma.casualtyCondition.create({ data: { name } });
  revalidatePath('/settings');
  return condition;
}

export async function updateCasualtyCondition(
  id: string,
  data: { name?: string; is_active?: boolean }
) {
  const condition = await prisma.casualtyCondition.update({ where: { id }, data });
  revalidatePath('/settings');
  return condition;
}

export async function deleteCasualtyCondition(id: string) {
  await prisma.casualtyCondition.delete({ where: { id } });
  revalidatePath('/settings');
}
