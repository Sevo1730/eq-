import Link from 'next/link';

const DIMENSIONS = [
  {
    num: 1,
    name: 'Self-Awareness',
    desc: 'Recognizing your own emotions',
    color: 'text-violet-600 bg-violet-100',
  },
  {
    num: 2,
    name: 'Self-Regulation',
    desc: 'Managing emotional responses',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    num: 3,
    name: 'Motivation',
    desc: 'Internal drive and resilience',
    color: 'text-emerald-600 bg-emerald-100',
  },
  {
    num: 4,
    name: 'Empathy',
    desc: "Understanding others' emotions",
    color: 'text-rose-600 bg-rose-100',
  },
  {
    num: 5,
    name: 'Social Skills',
    desc: 'Navigating relationships',
    color: 'text-amber-600 bg-amber-100',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full space-y-8">

        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            25 questions · ~5 minutes
          </span>
        </div>

        {/* Headline */}
        <div className="text-center space-y-4">
          <h1 className="text-[2.6rem] font-bold leading-[1.15] tracking-tight text-slate-900">
            How emotionally{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
              intelligent
            </span>{' '}
            are you?
          </h1>
          <p className="text-base text-slate-500 leading-relaxed">
            Measure your EQ across five dimensions and get a personalized breakdown of your strengths and areas to develop.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href="/test"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl text-sm shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-200 hover:-translate-y-0.5"
          >
            Begin Assessment
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Questions', value: '25' },
            { label: 'Dimensions', value: '5' },
            { label: 'Minutes', value: '~5' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-3.5 border border-slate-100 shadow-sm text-center"
            >
              <div className="text-xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Dimensions list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            What we measure
          </p>
          {DIMENSIONS.map((d) => (
            <div key={d.name} className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${d.color}`}
              >
                {d.num}
              </span>
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">{d.name}</span>
                <span className="text-sm text-slate-400 truncate">— {d.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400">
          Your responses are private and stored only on your device.
        </p>
      </div>
    </main>
  );
}
