'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getReportDamages(reportId: string) {
  return prisma.reportDamage.findMany({
    where: { report_id: reportId },
    include: { damage_report: { select: { name: true } } },
    orderBy: { damage_report: { name: 'asc' } },
  });
}

export async function toggleReportDamage(data: { report_id: string; damage_condition_id: string }) {
  const existing = await prisma.reportDamage.findUnique({
    where: {
      report_id_damage_condition_id: {
        report_id: data.report_id,
        damage_condition_id: data.damage_condition_id,
      },
    },
  });

  if (existing) {
    await prisma.reportDamage.delete({ where: { id: existing.id } });
  } else {
    await prisma.reportDamage.create({ data });
  }

  revalidatePath('/reports');
}

export async function deleteReportDamage(id: string) {
  await prisma.reportDamage.delete({ where: { id } });
  revalidatePath('/reports');
}
