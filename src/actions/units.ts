'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUnits(clusterId?: string) {
  return prisma.unit.findMany({
    where: clusterId ? { cluster_id: clusterId } : undefined,
    include: { cluster: { select: { name: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function getUnit(id: string) {
  return prisma.unit.findUnique({
    where: { id },
    include: { cluster: { select: { name: true } } },
  });
}

export async function createUnit(data: { name: string; cluster_id: string }) {
  const unit = await prisma.unit.create({ data });
  revalidatePath('/settings');
  return unit;
}

export async function updateUnit(
  id: string,
  data: { name?: string; cluster_id?: string; is_active?: boolean }
) {
  const unit = await prisma.unit.update({ where: { id }, data });
  revalidatePath('/settings');
  return unit;
}

export async function deleteUnit(id: string) {
  await prisma.unit.delete({ where: { id } });
  revalidatePath('/settings');
}
