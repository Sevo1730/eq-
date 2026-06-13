import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { usefulness, wouldUseAgain, confused, wouldRecommend } = await request.json();

    if (
      typeof usefulness !== 'number' ||
      usefulness < 1 || usefulness > 5 ||
      !['yes', 'no', 'maybe'].includes(wouldUseAgain) ||
      typeof wouldRecommend !== 'boolean'
    ) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        usefulness,
        wouldUseAgain,
        confused: confused?.trim() || null,
        wouldRecommend,
      },
    });

    return NextResponse.json({ id: feedback.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/feedback:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
