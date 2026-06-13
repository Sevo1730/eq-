import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EQ Assessment — Discover Your Emotional Intelligence',
  description:
    'Take a 25-question science-backed assessment to discover your emotional intelligence across five key dimensions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans min-h-screen bg-[#f8f9ff]">{children}</body>
    </html>
  );
}
