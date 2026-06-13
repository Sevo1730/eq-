import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { overallScore, categoryScores, answers } = body;

    if (typeof overallScore !== 'number' || !Array.isArray(categoryScores) || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const result = await prisma.result.create({
      data: {
        overallScore,
        categoryScores: JSON.stringify(categoryScores),
        answers: JSON.stringify(answers),
      },
    });

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (err) {
    console.error('POST /api/results:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
