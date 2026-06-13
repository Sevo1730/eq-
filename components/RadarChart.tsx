'use client';

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { CategoryScore } from '@/types';

interface EQRadarChartProps {
  data: CategoryScore[];
}

const SHORT_LABELS: Record<string, string> = {
  'Self-Awareness': 'Awareness',
  'Self-Regulation': 'Regulation',
  'Motivation': 'Motivation',
  'Empathy': 'Empathy',
  'Social Skills': 'Social',
};

export default function EQRadarChart({ data }: EQRadarChartProps) {
  const chartData = data.map((cs) => ({
    subject: SHORT_LABELS[cs.label] ?? cs.label,
    score: cs.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
        <PolarGrid stroke="#e2e8f0" strokeWidth={1} />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
          tickLine={false}
        />
        <PolarRadiusAxis
          domain={[0, 100]}
          tick={false}
          axisLine={false}
          tickCount={6}
        />
        <Radar
          name="EQ Score"
          dataKey="score"
          stroke="#7c3aed"
          fill="#7c3aed"
          fillOpacity={0.12}
          strokeWidth={2.5}
          dot={{ fill: '#7c3aed', r: 4, strokeWidth: 0 }}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
