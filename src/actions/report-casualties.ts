'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getReportCasualties(reportId: string) {
  return prisma.reportCasualty.findMany({
    where: { report_id: reportId },
    include: { condition: { select: { name: true } } },
    orderBy: { condition: { name: 'asc' } },
  });
}

export async function upsertReportCasualty(data: {
  report_id: string;
  condition_id: string;
  count: number;
  names?: string | null;
}) {
  const result = await prisma.reportCasualty.upsert({
    where: {
      report_id_condition_id: {
        report_id: data.report_id,
        condition_id: data.condition_id,
      },
    },
    create: data,
    update: { count: data.count, names: data.names },
  });
  revalidatePath('/reports');
  return result;
}

export async function deleteReportCasualty(id: string) {
  await prisma.reportCasualty.delete({ where: { id } });
  revalidatePath('/reports');
}
