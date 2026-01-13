'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

type AnalyticsEvent = {
  t: number;
  type: string;
  variant?: string;
  data?: Record<string, unknown>;
};

export const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    try {
      const now = Date.now();
      const qs = searchParams.toString();
      const url = `${pathname}${qs ? '?' + qs : ''}`;
      const raw = window.localStorage.getItem('fxn_events');
      const parsed = raw ? JSON.parse(raw) : [];
      const events: AnalyticsEvent[] = Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
      events.push({ t: now, type: 'page_view', data: { url } });
      window.localStorage.setItem('fxn_events', JSON.stringify(events.slice(-250)));
    } catch {}
  }, [pathname, searchParams]);

  return null;
};
