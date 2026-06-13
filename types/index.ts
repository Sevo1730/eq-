export type EQCategory =
  | 'self-awareness'
  | 'self-regulation'
  | 'motivation'
  | 'empathy'
  | 'social-skills';

export const CATEGORY_LABELS: Record<EQCategory, string> = {
  'self-awareness': 'Self-Awareness',
  'self-regulation': 'Self-Regulation',
  'motivation': 'Motivation',
  'empathy': 'Empathy',
  'social-skills': 'Social Skills',
};

export const CATEGORY_COLORS: Record<
  EQCategory,
  { bar: string; bg: string; text: string; hex: string }
> = {
  'self-awareness': { bar: 'bg-violet-500', bg: 'bg-violet-50', text: 'text-violet-700', hex: '#7c3aed' },
  'self-regulation': { bar: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700', hex: '#4338ca' },
  'motivation': { bar: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', hex: '#059669' },
  'empathy': { bar: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', hex: '#e11d48' },
  'social-skills': { bar: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', hex: '#d97706' },
};

export interface Question {
  id: number;
  text: string;
  category?: EQCategory;
  reversed?: boolean;
  type?: 'likert' | 'open';
}

export interface Answer {
  questionId: number;
  score?: number;
  text?: string;
}

export interface CategoryScore {
  category: EQCategory;
  label: string;
  score: number;
  rawScore: number;
  maxScore: number;
}

export interface EQResult {
  answers: Answer[];
  categoryScores: CategoryScore[];
  overallScore: number;
  completedAt: string;
  id: string;
}
