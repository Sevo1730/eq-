'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { EQResult, CATEGORY_COLORS, EQCategory } from '@/types';
import {
  getInterpretation,
  getStrengthsAndWeaknesses,
  getTipsForCategory,
} from '@/lib/interpretations';
import { getScoreLabel, getScoreDescription } from '@/lib/scoring';
import EQRadarChart from '@/components/RadarChart';
import CategoryBar from '@/components/CategoryBar';

function CircularScore({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 leading-none">{score}</span>
        <span className="text-[11px] text-slate-400 mt-1">out of 100</span>
      </div>
    </div>
  );
}

function ShareButton({ result }: { result: EQResult }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    const lines = [
      'My EQ Assessment Results',
      `Overall: ${result.overallScore}/100 — ${getScoreLabel(result.overallScore)}`,
      '',
      ...result.categoryScores.map((cs) => `${cs.label}: ${cs.score}%`),
      '',
      'Take the test: ' + window.location.origin,
    ];
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={copy}
      className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all"
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share Results
        </>
      )}
    </button>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<EQResult | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('eq-result');
    if (!stored) {
      router.replace('/');
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const { strengths, weaknesses } = getStrengthsAndWeaknesses(result.categoryScores);
  const label = getScoreLabel(result.overallScore);
  const desc = getScoreDescription(result.overallScore);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-slate-700">
            EQ Assessment
          </Link>
          <span className="text-xs text-slate-400">
            {new Date(result.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-8 space-y-5 pb-20">

        {/* Overall score card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            Your EQ Score
          </p>
          <div className="flex items-center gap-6">
            <CircularScore score={result.overallScore} />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-900">{label}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Overview
          </p>
          <EQRadarChart data={result.categoryScores} />
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Dimension Breakdown
          </p>
          {result.categoryScores.map((cs, i) => (
            <div key={cs.category} className="space-y-3">
              <CategoryBar
                label={cs.label}
                score={cs.score}
                hex={CATEGORY_COLORS[cs.category as EQCategory].hex}
                delay={i * 80}
              />
              <p className="text-xs text-slate-500 leading-relaxed">
                {getInterpretation(cs.category as EQCategory, cs.score)}
              </p>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Strengths
          </p>
          <div className="space-y-3">
            {strengths.map((cs) => {
              const colors = CATEGORY_COLORS[cs.category as EQCategory];
              return (
                <div key={cs.category} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${colors.bg} ${colors.text}`}
                  >
                    {cs.score}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{cs.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {getInterpretation(cs.category as EQCategory, cs.score)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weaknesses / Areas to develop */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Areas to Develop
          </p>
          <div className="space-y-3">
            {weaknesses.map((cs) => {
              const colors = CATEGORY_COLORS[cs.category as EQCategory];
              return (
                <div key={cs.category} className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${colors.bg} ${colors.text}`}
                  >
                    {cs.score}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{cs.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {getInterpretation(cs.category as EQCategory, cs.score)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Improvement tips */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Improvement Tips
          </p>
          {weaknesses.map((cs) => {
            const colors = CATEGORY_COLORS[cs.category as EQCategory];
            const tips = getTipsForCategory(cs.category as EQCategory);
            return (
              <div key={cs.category}>
                <span
                  className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${colors.bg} ${colors.text}`}
                >
                  {cs.label}
                </span>
                <ul className="space-y-2">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/test"
            onClick={() => localStorage.removeItem('eq-result')}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-violet-200 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake Test
          </Link>
          <ShareButton result={result} />
        </div>

      </main>
    </div>
  );
}
