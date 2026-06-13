'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<Step, string> = {
  1: 'Usefulness',
  2: 'Would use again',
  3: 'Confusion',
  4: 'Recommendation',
};

export default function FeedbackPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  const [usefulness, setUsefulness] = useState<number | null>(null);
  const [wouldUseAgain, setWouldUseAgain] = useState<'yes' | 'no' | 'maybe' | null>(null);
  const [confused, setConfused] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  async function handleSubmit() {
    if (wouldRecommend === null || submitting) return;
    setSubmitting(true);
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usefulness: usefulness ?? 3,
        wouldUseAgain: wouldUseAgain ?? 'maybe',
        confused: confused || null,
        wouldRecommend,
      }),
    });
    router.push('/thank-you');
  }

  function next() {
    if (step < 4) setStep((s) => (s + 1) as Step);
  }

  const canAdvance =
    (step === 1 && usefulness !== null) ||
    (step === 2 && wouldUseAgain !== null) ||
    step === 3 ||
    (step === 4 && wouldRecommend !== null);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      {/* Header */}
      <header className="px-5 py-5 flex items-center justify-between max-w-xl mx-auto w-full">
        <span className="text-sm font-semibold text-slate-700">Quick Feedback</span>
        <span className="text-xs text-slate-400 tabular-nums">{step} / 4</span>
      </header>

      {/* Progress */}
      <div className="px-5 max-w-xl mx-auto w-full">
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="max-w-xl w-full space-y-8">

          {/* Step 1: Usefulness 1-5 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Question 1
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 leading-snug">
                  Was this assessment useful to you?
                </h2>
              </div>
              <div className="flex gap-3 justify-between">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setUsefulness(n)}
                    className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all text-sm font-semibold
                      ${usefulness === n
                        ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50'
                      }`}
                  >
                    <span className="text-lg">{n}</span>
                    <span className="text-[10px] font-medium opacity-70">
                      {n === 1 ? 'Not at all' : n === 3 ? 'Somewhat' : n === 5 ? 'Very much' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Would use again */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Question 2
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 leading-snug">
                  Would you use something like this again?
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {(['yes', 'no', 'maybe'] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWouldUseAgain(opt)}
                    className={`w-full px-5 py-3.5 rounded-xl text-left text-sm font-medium border transition-all
                      ${wouldUseAgain === opt
                        ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50'
                      }`}
                  >
                    {opt === 'yes' ? 'Yes' : opt === 'no' ? 'No' : 'Maybe'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confused (optional) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Question 3 · Optional
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 leading-snug">
                  What confused you most?
                </h2>
                <p className="text-sm text-slate-400 mt-1">Leave blank if nothing confused you.</p>
              </div>
              <textarea
                value={confused}
                onChange={(e) => setConfused(e.target.value)}
                placeholder="e.g. Some questions felt repetitive…"
                rows={4}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
          )}

          {/* Step 4: Would recommend */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Question 4
                </span>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-2 leading-snug">
                  Would you recommend this to a friend?
                </h2>
              </div>
              <div className="flex gap-3">
                {([true, false] as const).map((val) => (
                  <button
                    key={String(val)}
                    onClick={() => setWouldRecommend(val)}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-semibold border transition-all
                      ${wouldRecommend === val
                        ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50'
                      }`}
                  >
                    {val ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action button */}
          {step < 4 ? (
            <button
              onClick={next}
              disabled={!canAdvance}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-violet-200 transition-all"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance || submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md hover:shadow-violet-200 transition-all"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting…
                </span>
              ) : 'Submit Feedback'}
            </button>
          )}

          {/* Back */}
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
