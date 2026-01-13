'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Activity } from 'lucide-react';

type AnalyticsEvent = {
  t: number;
  type: string;
  variant?: string;
  data?: Record<string, unknown>;
};

const SidebarRight = () => {
  const focusItems = useMemo(
    () => [
      "Agentic AI workflows (planning + tools)",
      "RAG systems (retrieval + evaluation)",
      "Multilingual assistants (Urdu/English/Arabic)",
      "LLM performance (latency + cost)",
      "Production ML systems (FastAPI + MLOps)",
    ],
    []
  );

  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [intent, setIntent] = useState<'Recruiter' | 'Engineer' | 'Founder'>('Engineer');
  const [eventsLastMinute, setEventsLastMinute] = useState(0);
  const [counts, setCounts] = useState({
    heroPrimary: 0,
    heroSecondary: 0,
    projectOpens: 0,
    contactSubmits: 0,
    voiceCommands: 0,
  });
  const [abCounts, setAbCounts] = useState({
    A: { cta: 0, contact: 0 },
    B: { cta: 0, contact: 0 },
  });

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('fxn_ab_variant') : null;
    if (stored === 'B') setVariant('B');
    if (stored === 'A') setVariant('A');
  }, []);

  useEffect(() => {
    const onVariant = (event: Event) => {
      const next = (event as CustomEvent).detail;
      if (next === 'A' || next === 'B') setVariant(next);
    };
    window.addEventListener('fxn_variant_change', onVariant as EventListener);
    return () => window.removeEventListener('fxn_variant_change', onVariant as EventListener);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const t = window.setInterval(() => {
      setSessionSeconds(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const getScrollMetrics = () => {
      const main = document.querySelector('main');
      if (!(main instanceof HTMLElement)) return;
      const maxScroll = Math.max(1, main.scrollHeight - main.clientHeight);
      setScrollPct(Math.round((main.scrollTop / maxScroll) * 100));
    };

    getScrollMetrics();
    const t = window.setInterval(getScrollMetrics, 250);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('fxn_behaviour') : null;
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as { heroFocus?: number; projectOpens?: number; contactStarts?: number };
      const heroFocus = data.heroFocus ?? 0;
      const projectOpens = data.projectOpens ?? 0;
      const contactStarts = data.contactStarts ?? 0;

      if (contactStarts > 0 || heroFocus > 1) setIntent('Recruiter');
      else if (projectOpens > 1) setIntent('Engineer');
      else setIntent('Founder');
    } catch {}
  }, [sessionSeconds]);

  useEffect(() => {
    const read = () => {
      try {
        const now = Date.now();
        const rawEvents = window.localStorage.getItem('fxn_events');
        const parsed = rawEvents ? JSON.parse(rawEvents) : [];
        const events: AnalyticsEvent[] = Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
        const lastMinute = events.filter((e) => typeof e.t === 'number' && now - e.t <= 60_000);
        setEventsLastMinute(lastMinute.length);

        const heroPrimary = events.filter((e) => e.type === 'hero_primary_cta').length;
        const heroSecondary = events.filter((e) => e.type === 'hero_secondary_cta').length;
        const projectOpens = events.filter((e) => e.type === 'project_open').length;
        const contactSubmits = events.filter((e) => e.type === 'contact_submit_success').length;
        const voiceCommands = events.filter((e) => e.type === 'voice_command').length;
        setCounts({ heroPrimary, heroSecondary, projectOpens, contactSubmits, voiceCommands });

        const byVariant = (v: 'A' | 'B') => {
          const cta = events.filter((e) => (e.type === 'hero_primary_cta' || e.type === 'hero_secondary_cta') && e.variant === v).length;
          const contact = events.filter((e) => e.type === 'contact_submit_success' && e.variant === v).length;
          return { cta, contact };
        };
        setAbCounts({ A: byVariant('A'), B: byVariant('B') });

        const storedPersona = window.localStorage.getItem('fxn_persona');
        if (storedPersona === 'Recruiter' || storedPersona === 'Engineer' || storedPersona === 'Founder') setIntent(storedPersona);
      } catch {}
    };

    read();
    const t = window.setInterval(read, 1000);
    return () => window.clearInterval(t);
  }, []);

  const conversions = useMemo(() => {
    const cta = counts.heroPrimary + counts.heroSecondary;
    const contact = counts.contactSubmits;
    const rate = cta > 0 ? Math.round((contact / cta) * 100) : 0;
    return { cta, contact, rate };
  }, [counts]);

  const abConversion = useMemo(() => {
    const rate = (cta: number, contact: number) => (cta > 0 ? Math.round((contact / cta) * 100) : 0);
    return {
      A: { ...abCounts.A, rate: rate(abCounts.A.cta, abCounts.A.contact) },
      B: { ...abCounts.B, rate: rate(abCounts.B.cta, abCounts.B.contact) },
    };
  }, [abCounts]);

  return (
    <aside className="w-80 border-l border-white/5 p-8 flex flex-col gap-8 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col gap-6">
        <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-muted">Current Focus</h3>
        <p className="text-sm text-muted leading-relaxed">
          {intent === 'Recruiter'
            ? 'Hiring signal: delivered multilingual agents, RAG systems, and production ML with measurable impact.'
            : intent === 'Founder'
              ? 'Outcome focus: shipping AI workflows that reduce cost, improve speed, and scale with reliability.'
              : 'Engineering focus: agentic AI systems, RAG pipelines, and multilingual assistants with production-grade reliability.'}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted opacity-50">Technical Domains</h3>
        <ul className="flex flex-col gap-3">
          {focusItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs group cursor-default">
              <ChevronRight className="w-3.5 h-3.5 text-primary mt-0.5 group-hover:translate-x-1 transition-transform" />
              <span className="group-hover:text-primary transition-colors">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Visitor Telemetry</span>
          </div>
          <span className="text-[10px] font-mono text-muted">{variant}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/20 border border-white/10 p-3">
            <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">Intent</div>
            <div className="text-xs font-bold mt-1">{intent}</div>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3">
            <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">Session</div>
            <div className="text-xs font-bold mt-1">{sessionSeconds}s</div>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3 col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">Scroll Depth</div>
              <div className="text-[10px] font-mono text-muted">{scrollPct}%</div>
            </div>
            <div className="mt-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-primary to-primary/40" style={{ width: `${scrollPct}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3">
            <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">Events</div>
            <div className="text-xs font-bold mt-1">{eventsLastMinute}/min</div>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3">
            <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">Voice</div>
            <div className="text-xs font-bold mt-1">{counts.voiceCommands}</div>
          </div>
          <div className="rounded-xl bg-black/20 border border-white/10 p-3 col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">CTA → Contact</div>
              <div className="text-[10px] font-mono text-muted">{conversions.rate}%</div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">CTAs</div>
                <div className="text-xs font-bold mt-1">{conversions.cta}</div>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">Submits</div>
                <div className="text-xs font-bold mt-1">{conversions.contact}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                <div className="flex items-center justify-between">
                  <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">A</div>
                  <div className="text-[10px] font-mono text-muted">{abConversion.A.rate}%</div>
                </div>
                <div className="mt-1 text-[10px] font-mono text-muted">{abConversion.A.contact}/{abConversion.A.cta}</div>
              </div>
              <div className="rounded-lg bg-white/5 border border-white/10 p-2">
                <div className="flex items-center justify-between">
                  <div className="text-[8px] uppercase tracking-widest text-muted opacity-70">B</div>
                  <div className="text-[10px] font-mono text-muted">{abConversion.B.rate}%</div>
                </div>
                <div className="mt-1 text-[10px] font-mono text-muted">{abConversion.B.contact}/{abConversion.B.cta}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="p-3 rounded-lg bg-white/5 text-[9px] text-muted uppercase tracking-widest text-center font-bold">
          Expertise: Technical & Professional
        </div>
      </div>
    </aside>
  );
};

export default SidebarRight;
