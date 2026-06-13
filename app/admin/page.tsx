import { prisma } from '@/lib/prisma';
import { CategoryScore, EQCategory, CATEGORY_COLORS, Answer } from '@/types';
import Link from 'next/link';

function getScoreLabel(score: number) {
  if (score >= 90) return 'Exceptional';
  if (score >= 76) return 'Strong';
  if (score >= 61) return 'Capable';
  if (score >= 41) return 'Developing';
  return 'Early Stage';
}

function getScoreColor(score: number) {
  if (score >= 76) return 'text-emerald-600 bg-emerald-50';
  if (score >= 61) return 'text-amber-600 bg-amber-50';
  return 'text-red-500 bg-red-50';
}

function MiniBar({ score, hex }: { score: number; hex: string }) {
  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${score}%`, backgroundColor: hex }}
      />
    </div>
  );
}

export default async function AdminPage() {
  const raw = await prisma.result.findMany({
    orderBy: { completedAt: 'desc' },
  });

  const results = raw.map((r) => {
    const answers = JSON.parse(r.answers) as Answer[];
    const achievement = answers.find((a) => a.questionId === 26)?.text ?? null;
    return {
      ...r,
      categoryScores: JSON.parse(r.categoryScores) as CategoryScore[],
      achievement,
    };
  });

  const totalCount = results.length;
  const avgScore =
    totalCount > 0
      ? Math.round(results.reduce((s, r) => s + r.overallScore, 0) / totalCount)
      : 0;

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 text-sm">EQ Results</span>
          </div>
          <span className="text-xs text-slate-400 tabular-nums">{totalCount} submission{totalCount !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 space-y-5">

        {/* Stats */}
        {totalCount > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Total</p>
              <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
              <p className="text-xs text-slate-400 mt-0.5">submissions</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Average</p>
              <p className="text-3xl font-bold text-slate-900">{avgScore}</p>
              <p className="text-xs text-slate-400 mt-0.5">overall score</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-16 text-center">
            <p className="text-sm text-slate-400">No submissions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, i) => (
              <div
                key={result.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-semibold text-slate-400 tabular-nums">
                        #{totalCount - i}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getScoreColor(result.overallScore)}`}
                      >
                        {result.overallScore} — {getScoreLabel(result.overallScore)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {new Date(result.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      ·{' '}
                      {new Date(result.completedAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/admin/result/${result.id}`}
                    className="flex-shrink-0 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    Details →
                  </Link>
                </div>

                {/* 5 category bars */}
                <div className="space-y-2.5">
                  {result.categoryScores.map((cs) => {
                    const colors = CATEGORY_COLORS[cs.category as EQCategory];
                    return (
                      <div key={cs.category} className="grid grid-cols-[100px_1fr_32px] sm:grid-cols-[140px_1fr_36px] items-center gap-2 sm:gap-3">
                        <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full text-center truncate ${colors.bg} ${colors.text}`}>
                          {cs.label}
                        </span>
                        <MiniBar score={cs.score} hex={colors.hex} />
                        <span className="text-xs font-semibold text-slate-700 text-right tabular-nums">
                          {cs.score}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Open-ended answer */}
                {result.achievement && (
                  <div className="pt-1 border-t border-slate-50">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                      Biggest Academic Achievement
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-3.5 py-2.5">
                      {result.achievement}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
