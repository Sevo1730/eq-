import { Question, Answer, CategoryScore, EQCategory, CATEGORY_LABELS } from '@/types';

export function calculateScores(answers: Answer[], questions: Question[]): CategoryScore[] {
  const map: Record<EQCategory, { raw: number; count: number }> = {
    'self-awareness': { raw: 0, count: 0 },
    'self-regulation': { raw: 0, count: 0 },
    'motivation': { raw: 0, count: 0 },
    'empathy': { raw: 0, count: 0 },
    'social-skills': { raw: 0, count: 0 },
  };

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.type === 'open' || !question.category || answer.score === undefined) return;
    const score = question.reversed ? 6 - answer.score : answer.score;
    map[question.category].raw += score;
    map[question.category].count += 1;
  });

  return (Object.keys(map) as EQCategory[]).map((category) => {
    const { raw, count } = map[category];
    const maxScore = count * 5;
    const score = count > 0 ? Math.round((raw / maxScore) * 100) : 0;
    return {
      category,
      label: CATEGORY_LABELS[category],
      score,
      rawScore: raw,
      maxScore,
    };
  });
}

export function calculateOverallScore(categoryScores: CategoryScore[]): number {
  if (categoryScores.length === 0) return 0;
  const total = categoryScores.reduce((sum, cs) => sum + cs.score, 0);
  return Math.round(total / categoryScores.length);
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 76) return 'Strong';
  if (score >= 61) return 'Capable';
  if (score >= 41) return 'Developing';
  return 'Early Stage';
}

export function getScoreDescription(score: number): string {
  if (score >= 90) return 'You demonstrate very high emotional intelligence across most dimensions.';
  if (score >= 76) return 'You have solid emotional intelligence with well-developed skills in several areas.';
  if (score >= 61) return 'You show a reasonable level of emotional intelligence with clear room to grow.';
  if (score >= 41) return 'You are building foundational EQ skills. Focused effort in key areas will help.';
  return 'This is an early stage of EQ development. Awareness is the first step toward growth.';
}
