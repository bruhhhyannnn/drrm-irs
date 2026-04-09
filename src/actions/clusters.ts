'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClusters() {
  return prisma.cluster.findMany({ orderBy: { name: 'asc' } });
}

export async function getCluster(id: string) {
  return prisma.cluster.findUnique({ where: { id } });
}

export async function createCluster(name: string) {
  const cluster = await prisma.cluster.create({ data: { name } });
  revalidatePath('/settings');
  return cluster;
}

export async function updateCluster(id: string, data: { name?: string; is_active?: boolean }) {
  const cluster = await prisma.cluster.update({ where: { id }, data });
  revalidatePath('/settings');
  return cluster;
}

export async function deleteCluster(id: string) {
  await prisma.cluster.delete({ where: { id } });
  revalidatePath('/settings');
}
