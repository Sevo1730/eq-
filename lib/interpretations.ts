import { CategoryScore, EQCategory } from '@/types';

type Level = 'low' | 'medium' | 'high';

function getLevel(score: number): Level {
  if (score < 40) return 'low';
  if (score < 70) return 'medium';
  return 'high';
}

const interpretations: Record<EQCategory, Record<Level, string>> = {
  'self-awareness': {
    low: 'Recognizing your emotions in real time may be challenging. Developing this skill forms the basis of all other EQ dimensions.',
    medium: 'You have a moderate awareness of your emotions and their influence, though deepening this self-knowledge will benefit you.',
    high: 'You have strong insight into your emotional states and how they shape your behavior — a solid foundation for all other EQ skills.',
  },
  'self-regulation': {
    low: 'Managing emotional reactions under pressure may feel difficult. Pause-and-reflect techniques can help you respond more intentionally.',
    medium: 'You handle most situations with reasonable composure, though high-stress moments may still catch you off guard.',
    high: 'You manage your impulses and emotions effectively, even in difficult situations. Others likely see you as steady and reliable.',
  },
  'motivation': {
    low: 'Sustaining internal drive can feel difficult. Clarifying what matters to you and setting small, achievable goals can rebuild momentum.',
    medium: 'You have a reasonable level of internal drive, though motivation can waver when obstacles arise.',
    high: 'You demonstrate strong inner drive and resilience. You pursue goals consistently and recover well from setbacks.',
  },
  'empathy': {
    low: 'Tuning into others\' emotional states may not come naturally. Practicing active listening and perspective-taking can meaningfully improve this.',
    medium: 'You show a moderate ability to understand others\' feelings, though you may sometimes miss subtle emotional cues.',
    high: 'You read people well and respond to their emotional needs thoughtfully. This makes you a trusted presence in relationships.',
  },
  'social-skills': {
    low: 'Navigating social situations or building connections may feel effortful. Focusing on communication clarity and conflict resolution is a good starting point.',
    medium: 'You communicate reasonably well and manage most social situations, though complex dynamics may still challenge you.',
    high: 'You build rapport easily, communicate clearly, and navigate social environments with confidence and skill.',
  },
};

export function getInterpretation(category: EQCategory, score: number): string {
  return interpretations[category][getLevel(score)];
}

const tips: Record<EQCategory, string[]> = {
  'self-awareness': [
    'Keep a brief daily journal — note one emotion you felt and what triggered it.',
    'After a strong reaction, ask: what was I actually feeling in that moment, and why?',
    'Ask a trusted person for honest feedback about how you come across.',
  ],
  'self-regulation': [
    'Practice the 10-second pause before responding in tense situations.',
    'Identify your personal stress triggers and plan how you\'ll respond to them in advance.',
    'Use a brief grounding technique — slow breathing, naming 5 things you see — when tension rises.',
  ],
  'motivation': [
    'Break large goals into smaller milestones and acknowledge each step forward.',
    'Reconnect with your core values and ask how your current work relates to them.',
    'Create a consistent routine that protects your energy and reduces decision fatigue.',
  ],
  'empathy': [
    'Practice listening to understand, not to respond — let the other person finish before you speak.',
    'When someone shares a problem, acknowledge their feelings before offering solutions.',
    'Try reading literary fiction — research shows it builds the ability to understand others\' inner lives.',
  ],
  'social-skills': [
    'Practice initiating one genuine conversation each day, even briefly.',
    'When conflict arises, focus on the issue — not the person — and state your needs clearly.',
    'Ask more questions. Curiosity builds connection faster than talking about yourself.',
  ],
};

export function getTipsForCategory(category: EQCategory): string[] {
  return tips[category];
}

export function getStrengthsAndWeaknesses(categoryScores: CategoryScore[]): {
  strengths: CategoryScore[];
  weaknesses: CategoryScore[];
} {
  const sorted = [...categoryScores].sort((a, b) => b.score - a.score);
  return {
    strengths: sorted.slice(0, 2),
    weaknesses: sorted.slice(-2).reverse(),
  };
}
