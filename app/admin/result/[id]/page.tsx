import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { CategoryScore, EQCategory, CATEGORY_COLORS, Answer } from '@/types';
import { getInterpretation, getStrengthsAndWeaknesses, getTipsForCategory } from '@/lib/interpretations';
import { getScoreLabel, getScoreDescription } from '@/lib/scoring';
import EQRadarChart from '@/components/RadarChart';
import CategoryBar from '@/components/CategoryBar';

function CircularScore({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;

  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke="url(#sg)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
        />
        <defs>
          <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 leading-none">{score}</span>
        <span className="text-[11px] text-slate-400 mt-1">/ 100</span>
      </div>
    </div>
  );
}

export default async function AdminResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await prisma.result.findUnique({ where: { id } });
  if (!raw) notFound();

  const categoryScores = JSON.parse(raw.categoryScores) as CategoryScore[];
  const answers = JSON.parse(raw.answers) as Answer[];
  const achievement = answers.find((a) => a.questionId === 26)?.text ?? null;
  const { strengths, weaknesses } = getStrengthsAndWeaknesses(categoryScores);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Results
          </Link>
          <span className="text-xs text-slate-400">
            {new Date(raw.completedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-8 space-y-5 pb-16">
        {/* Overall score */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
            EQ Score
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            <CircularScore score={raw.overallScore} />
            <div className="space-y-1.5">
              <p className="text-2xl font-bold text-slate-900">{getScoreLabel(raw.overallScore)}</p>
              <p className="text-sm text-slate-500 leading-relaxed">
                {getScoreDescription(raw.overallScore)}
              </p>
            </div>
          </div>
        </div>

        {/* Academic achievement */}
        {achievement && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Biggest Academic Achievement
            </p>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 rounded-xl px-4 py-3">
              {achievement}
            </p>
          </div>
        )}

        {/* Radar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Overview
          </p>
          <EQRadarChart data={categoryScores} />
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Dimension Breakdown
          </p>
          {categoryScores.map((cs, i) => (
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Strengths</p>
          {strengths.map((cs) => {
            const c = CATEGORY_COLORS[cs.category as EQCategory];
            return (
              <div key={cs.category} className="flex items-start gap-3">
                <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.bg} ${c.text}`}>
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

        {/* Areas to develop */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Areas to Develop
          </p>
          {weaknesses.map((cs) => {
            const c = CATEGORY_COLORS[cs.category as EQCategory];
            return (
              <div key={cs.category} className="flex items-start gap-3">
                <span className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.bg} ${c.text}`}>
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

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Improvement Tips
          </p>
          {weaknesses.map((cs) => {
            const c = CATEGORY_COLORS[cs.category as EQCategory];
            return (
              <div key={cs.category}>
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${c.bg} ${c.text}`}>
                  {cs.label}
                </span>
                <ul className="space-y-2">
                  {getTipsForCategory(cs.category as EQCategory).map((tip, i) => (
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
      </main>
    </div>
  );
}
