'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getDamageConditions() {
  return prisma.damageCondition.findMany({ orderBy: { name: 'asc' } });
}

export async function createDamageCondition(name: string) {
  const item = await prisma.damageCondition.create({ data: { name } });
  revalidatePath('/settings');
  return item;
}

export async function updateDamageCondition(
  id: string,
  data: { name?: string; is_active?: boolean }
) {
  const item = await prisma.damageCondition.update({ where: { id }, data });
  revalidatePath('/settings');
  return item;
}

export async function deleteDamageCondition(id: string) {
  await prisma.damageCondition.delete({ where: { id } });
  revalidatePath('/settings');
}
