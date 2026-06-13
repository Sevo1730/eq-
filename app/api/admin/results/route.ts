import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!token && verifyAdminToken(token);
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = await prisma.result.findMany({
    orderBy: { completedAt: 'desc' },
    select: {
      id: true,
      overallScore: true,
      categoryScores: true,
      completedAt: true,
    },
  });

  const parsed = results.map((r) => ({
    ...r,
    categoryScores: JSON.parse(r.categoryScores),
  }));

  return NextResponse.json(parsed);
}
