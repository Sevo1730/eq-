'use client';

import { useEffect, useState } from 'react';

interface CategoryBarProps {
  label: string;
  score: number;
  hex: string;
  delay?: number;
}

export default function CategoryBar({ label, score, hex, delay = 0 }: CategoryBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay + 100);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{score}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, backgroundColor: hex }}
        />
      </div>
    </div>
  );
}
