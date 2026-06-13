import { prisma } from '@/lib/prisma';

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-4 h-4 ${n <= value ? 'text-amber-400' : 'text-slate-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ value, type }: { value: string | boolean; type: 'useAgain' | 'recommend' }) {
  if (type === 'recommend') {
    return (
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        value === true
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-600'
      }`}>
        {value ? 'Yes' : 'No'}
      </span>
    );
  }
  const map: Record<string, string> = {
    yes: 'bg-emerald-50 text-emerald-700',
    maybe: 'bg-amber-50 text-amber-700',
    no: 'bg-red-50 text-red-600',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[value as string] ?? ''}`}>
      {(value as string).charAt(0).toUpperCase() + (value as string).slice(1)}
    </span>
  );
}

export default async function ResultPage() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { submittedAt: 'desc' },
  });

  const count = feedbacks.length;
  const avgUsefulness = count > 0
    ? (feedbacks.reduce((s, f) => s + f.usefulness, 0) / count).toFixed(1)
    : '—';
  const pctRecommend = count > 0
    ? Math.round((feedbacks.filter((f) => f.wouldRecommend).length / count) * 100)
    : 0;
  const useAgainCounts = { yes: 0, no: 0, maybe: 0 };
  feedbacks.forEach((f) => { useAgainCounts[f.wouldUseAgain as keyof typeof useAgainCounts]++; });

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 text-sm">Feedback Results</span>
          </div>
          <span className="text-xs text-slate-400 tabular-nums">{count} response{count !== 1 ? 's' : ''}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-8 space-y-5">

        {/* Stats */}
        {count > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Avg Usefulness</p>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold text-slate-900">{avgUsefulness}</p>
                <p className="text-sm text-slate-400 mb-0.5">/ 5</p>
              </div>
              <div className="mt-2">
                <StarRating value={Math.round(Number(avgUsefulness))} />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Would Recommend</p>
              <p className="text-3xl font-bold text-slate-900">{pctRecommend}%</p>
              <p className="text-xs text-slate-400 mt-1">of respondents</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Use Again</p>
              <div className="space-y-1 mt-1">
                {(['yes', 'maybe', 'no'] as const).map((k) => (
                  <div key={k} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 capitalize">{k}</span>
                    <span className="font-semibold text-slate-800 tabular-nums">{useAgainCounts[k]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Responses */}
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-16 text-center">
            <p className="text-sm text-slate-400">No feedback submitted yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((fb, i) => (
              <div key={fb.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 tabular-nums">
                    #{count - i}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(fb.submittedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })} · {new Date(fb.submittedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* 4 answers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Usefulness</p>
                    <StarRating value={fb.usefulness} />
                    <p className="text-xs text-slate-500">{fb.usefulness} / 5</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Would Use Again</p>
                    <Badge value={fb.wouldUseAgain} type="useAgain" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Would Recommend</p>
                    <Badge value={fb.wouldRecommend} type="recommend" />
                  </div>
                  {fb.confused && (
                    <div className="sm:col-span-2 space-y-1">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What confused them</p>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg px-3 py-2">
                        {fb.confused}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
