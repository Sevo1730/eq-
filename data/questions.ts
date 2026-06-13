import { Question } from '@/types';

export const questions: Question[] = [
  // Self-Awareness (Q1–Q5)
  {
    id: 1,
    text: "I can identify what emotion I'm feeling as it happens.",
    category: 'self-awareness',
  },
  {
    id: 2,
    text: "I understand how my moods affect my decisions and behavior.",
    category: 'self-awareness',
  },
  {
    id: 3,
    text: "I have a clear sense of my personal strengths and limitations.",
    category: 'self-awareness',
  },
  {
    id: 4,
    text: "I take time to reflect on why I react the way I do.",
    category: 'self-awareness',
  },
  {
    id: 5,
    text: "I am aware of how my words and actions land on other people.",
    category: 'self-awareness',
  },

  // Self-Regulation (Q6–Q10)
  {
    id: 6,
    text: "I stay composed when things don't go as planned.",
    category: 'self-regulation',
  },
  {
    id: 7,
    text: "I pause and think before reacting in frustrating situations.",
    category: 'self-regulation',
  },
  {
    id: 8,
    text: "I can resist acting on impulse when it would be counterproductive.",
    category: 'self-regulation',
  },
  {
    id: 9,
    text: "I adapt my approach smoothly when circumstances change unexpectedly.",
    category: 'self-regulation',
  },
  {
    id: 10,
    text: "I manage stress without letting it significantly interfere with my work.",
    category: 'self-regulation',
  },

  // Motivation (Q11–Q15)
  {
    id: 11,
    text: "I pursue meaningful goals consistently, even when progress feels slow.",
    category: 'motivation',
  },
  {
    id: 12,
    text: "I hold myself to a high standard without needing external pressure.",
    category: 'motivation',
  },
  {
    id: 13,
    text: "After a setback, I recover and keep moving forward.",
    category: 'motivation',
  },
  {
    id: 14,
    text: "I find genuine purpose in what I do each day.",
    category: 'motivation',
  },
  {
    id: 15,
    text: "I stay optimistic about long-term outcomes despite short-term difficulties.",
    category: 'motivation',
  },

  // Empathy (Q16–Q20)
  {
    id: 16,
    text: "I can sense how someone is feeling even when they haven't said it directly.",
    category: 'empathy',
  },
  {
    id: 17,
    text: "I make a genuine effort to understand perspectives different from my own.",
    category: 'empathy',
  },
  {
    id: 18,
    text: "When someone shares a problem, I focus on listening rather than preparing my response.",
    category: 'empathy',
  },
  {
    id: 19,
    text: "I adjust how I communicate based on another person's emotional state.",
    category: 'empathy',
  },
  {
    id: 20,
    text: "I feel affected when people around me are struggling.",
    category: 'empathy',
  },

  // Social Skills (Q21–Q25)
  {
    id: 21,
    text: "I communicate my ideas clearly and effectively across different situations.",
    category: 'social-skills',
  },
  {
    id: 22,
    text: "I can address disagreements directly without damaging the relationship.",
    category: 'social-skills',
  },
  {
    id: 23,
    text: "I find it natural to build rapport with people I've just met.",
    category: 'social-skills',
  },
  {
    id: 24,
    text: "I can guide a group toward a shared goal without forcing my views.",
    category: 'social-skills',
  },
  {
    id: 25,
    text: "I navigate complex social dynamics with awareness and tact.",
    category: 'social-skills',
  },

  // Open-ended reflection
  {
    id: 26,
    text: "What has been your biggest academic achievement in your life?",
    type: 'open',
  },
];
