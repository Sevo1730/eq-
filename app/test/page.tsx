'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import { Answer, EQCategory } from '@/types';
import { calculateScores, calculateOverallScore } from '@/lib/scoring';
import ProgressBar from '@/components/ProgressBar';
import LikertScale from '@/components/LikertScale';

const CATEGORY_STYLE: Record<EQCategory, { bg: string; text: string; label: string }> = {
  'self-awareness': { bg: 'bg-violet-50', text: 'text-violet-700', label: 'Self-Awareness' },
  'self-regulation': { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Self-Regulation' },
  'motivation': { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Motivation' },
  'empathy': { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Empathy' },
  'social-skills': { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Social Skills' },
};

type AnimState = 'idle' | 'exit-forward' | 'exit-back' | 'enter-forward' | 'enter-back';

export default function TestPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [animState, setAnimState] = useState<AnimState>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [openText, setOpenText] = useState('');

  const currentQ = questions[index];
  const isOpenQuestion = currentQ.type === 'open';
  const currentAnswer = answers.find((a) => a.questionId === currentQ.id)?.score;
  const style = currentQ.category ? CATEGORY_STYLE[currentQ.category] : null;

  // Restore saved text when navigating back to an open question
  useEffect(() => {
    if (isOpenQuestion) {
      const saved = answers.find((a) => a.questionId === currentQ.id)?.text ?? '';
      setOpenText(saved);
    }
  }, [index]);

  const navigate = useCallback(
    (nextIndex: number, direction: 'forward' | 'back') => {
      setAnimState(direction === 'forward' ? 'exit-forward' : 'exit-back');
      setTimeout(() => {
        setIndex(nextIndex);
        setAnimState(direction === 'forward' ? 'enter-forward' : 'enter-back');
        setTimeout(() => setAnimState('idle'), 20);
      }, 180);
    },
    [],
  );

  function handleAnswer(score: number) {
    if (submitting) return;

    const updated = answers.filter((a) => a.questionId !== currentQ.id);
    updated.push({ questionId: currentQ.id, score });
    setAnswers(updated);

    setTimeout(() => {
      navigate(index + 1, 'forward');
    }, 350);
  }

  async function handleOpenSubmit() {
    if (submitting) return;
    setSubmitting(true);

    const updatedAnswers = answers.filter((a) => a.questionId !== currentQ.id);
    if (openText.trim()) {
      updatedAnswers.push({ questionId: currentQ.id, text: openText.trim() });
    }

    const categoryScores = calculateScores(updatedAnswers, questions);
    const overallScore = calculateOverallScore(categoryScores);

    await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallScore, categoryScores, answers: updatedAnswers }),
    });
    router.push('/thank-you');
  }

  function handleBack() {
    if (index > 0) navigate(index - 1, 'back');
  }

  const transitionClass = {
    idle: 'opacity-100 translate-x-0',
    'exit-forward': 'opacity-0 -translate-x-6',
    'exit-back': 'opacity-0 translate-x-6',
    'enter-forward': 'opacity-0 translate-x-6',
    'enter-back': 'opacity-0 -translate-x-6',
  }[animState];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Header */}
      <header className="px-5 py-5 flex items-center justify-between max-w-xl mx-auto w-full">
        <span className="text-sm font-semibold text-slate-700 tracking-tight">
          EQ Assessment
        </span>
        <span className="text-xs text-slate-400 tabular-nums">
          {index + 1} / {questions.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="px-5 max-w-xl mx-auto w-full">
        <ProgressBar current={index + 1} total={questions.length} />
      </div>

      {/* Question area */}
      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div
          className={`max-w-xl w-full transition-all duration-150 ease-in-out ${transitionClass}`}
        >
          {/* Category badge */}
          <div className="mb-5">
            {style ? (
              <span className={`inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full ${style.bg} ${style.text}`}>
                {style.label}
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-500">
                Reflection
              </span>
            )}
          </div>

          {/* Question text */}
          <h2 className="text-xl sm:text-[1.4rem] font-semibold text-slate-900 leading-snug mb-8 text-balance">
            {currentQ.text}
          </h2>

          {/* Answer UI */}
          {isOpenQuestion ? (
            <div className="space-y-4">
              <textarea
                value={openText}
                onChange={(e) => setOpenText(e.target.value)}
                placeholder="Write your answer here… (optional)"
                rows={4}
                disabled={submitting}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition disabled:opacity-50"
              />
              <button
                onClick={handleOpenSubmit}
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:shadow-md hover:shadow-violet-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Submitting…
                  </span>
                ) : (
                  'Submit Assessment'
                )}
              </button>
              <button
                onClick={handleOpenSubmit}
                disabled={submitting}
                className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
              >
                Skip and submit
              </button>
            </div>
          ) : (
            <LikertScale
              onSelect={handleAnswer}
              selected={currentAnswer}
              disabled={animState !== 'idle' || submitting}
            />
          )}

          {/* Back button */}
          {index > 0 && !submitting && (
            <button
              onClick={handleBack}
              className="mt-7 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
