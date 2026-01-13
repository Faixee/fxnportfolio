import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani } from "next/font/google";
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import { Analytics } from '@/components/Analytics';
import { Suspense } from 'react';
import AIWhaleSystem from '@/components/AIWhaleSystem';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const rajdhani = Rajdhani({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-rajdhani' });

export const metadata: Metadata = {
  title: 'Faizan Murtuza | AI / ML Engineer',
  description: 'Designing intelligent systems powered by data and machine learning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} dark`}>
      <body className="bg-background text-foreground antialiased selection:bg-primary selection:text-black">
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <AIWhaleSystem />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
