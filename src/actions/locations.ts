'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getLocations(clusterId?: string) {
  return prisma.location.findMany({
    where: clusterId ? { cluster_id: clusterId } : undefined,
    include: { cluster: { select: { name: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function getLocation(id: string) {
  return prisma.location.findUnique({
    where: { id },
    include: { cluster: { select: { name: true } } },
  });
}

export async function createLocation(data: { name: string; cluster_id: string }) {
  const location = await prisma.location.create({ data });
  revalidatePath('/settings');
  return location;
}

export async function updateLocation(
  id: string,
  data: { name?: string; cluster_id?: string; is_active?: boolean }
) {
  const location = await prisma.location.update({ where: { id }, data });
  revalidatePath('/settings');
  return location;
}

export async function deleteLocation(id: string) {
  await prisma.location.delete({ where: { id } });
  revalidatePath('/settings');
}
