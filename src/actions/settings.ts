'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type SettingsTable =
  | 'clusters'
  | 'units'
  | 'locations'
  | 'positions'
  | 'user_types'
  | 'event_statuses'
  | 'casualty_conditions'
  | 'damage_conditions';

const MODEL_MAP = {
  clusters: 'cluster',
  units: 'unit',
  locations: 'location',
  positions: 'position',
  user_types: 'userType',
  event_statuses: 'eventStatus',
  casualty_conditions: 'casualtyCondition',
  damage_conditions: 'damageCondition',
} as const;

export async function getSettingsItems(table: SettingsTable) {
  const model = MODEL_MAP[table];
  // @ts-expect-error dynamic model access
  return prisma[model].findMany({ orderBy: { name: 'asc' } });
}

export async function createSettingsItem(table: SettingsTable, data: Record<string, unknown>) {
  const model = MODEL_MAP[table];
  // @ts-expect-error dynamic model access
  const result = await prisma[model].create({ data });
  revalidatePath('/settings');
  return result;
}

export async function updateSettingsItem(
  table: SettingsTable,
  id: string,
  data: Record<string, unknown>
) {
  const model = MODEL_MAP[table];
  // @ts-expect-error dynamic model access
  const result = await prisma[model].update({ where: { id }, data });
  revalidatePath('/settings');
  return result;
}

export async function deleteSettingsItem(table: SettingsTable, id: string) {
  const model = MODEL_MAP[table];
  // @ts-expect-error dynamic model access
  await prisma[model].delete({ where: { id } });
  revalidatePath('/settings');
}
