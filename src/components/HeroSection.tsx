'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';

type AnalyticsEvent = {
  t: number;
  type: string;
  variant?: string;
  data?: Record<string, unknown>;
};

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<'A' | 'B'>('A');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [persona, setPersona] = useState<'Recruiter' | 'Engineer' | 'Founder'>('Engineer');

  useEffect(() => {
    const existing = window.localStorage.getItem('fxn_ab_variant');
    if (existing === 'A' || existing === 'B') {
      setVariant(existing);
      window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: existing }));
      return;
    }
    const url = new URL(window.location.href);
    const override = url.searchParams.get('variant');
    if (override === 'A' || override === 'B') {
      window.localStorage.setItem('fxn_ab_variant', override);
      setVariant(override);
      window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: override }));
      return;
    }
    const assigned: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    window.localStorage.setItem('fxn_ab_variant', assigned);
    setVariant(assigned);
    window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: assigned }));
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
    const storedPersona = window.localStorage.getItem('fxn_persona');
    if (storedPersona === 'Recruiter' || storedPersona === 'Engineer' || storedPersona === 'Founder') {
      setPersona(storedPersona);
      return;
    }
    try {
      const raw = window.localStorage.getItem('fxn_behaviour');
      if (!raw) return;
      const data = JSON.parse(raw) as { heroFocus?: number; projectOpens?: number; contactStarts?: number; contactSubmits?: number };
      const heroFocus = data.heroFocus ?? 0;
      const projectOpens = data.projectOpens ?? 0;
      const contactStarts = data.contactStarts ?? 0;
      const contactSubmits = data.contactSubmits ?? 0;
      if (contactSubmits > 0 || contactStarts > 0 || heroFocus > 1) setPersona('Recruiter');
      else if (projectOpens > 1) setPersona('Engineer');
      else setPersona('Founder');
    } catch {}
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setPrefersReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const headline = useMemo(() => {
    if (variant === 'B') return 'Faizan Murtuza';
    return 'AI / Machine Learning Engineer';
  }, [variant]);

  const subline = useMemo(() => {
    if (variant === 'B') return 'AI/ML Engineer • Agentic AI • LLM Systems Developer';
    return 'Agentic AI systems • RAG pipelines • Multilingual assistants';
  }, [variant]);

  const track = (type: string, data?: Record<string, unknown>) => {
    try {
      const now = Date.now();
      const raw = window.localStorage.getItem('fxn_events');
      const parsed = raw ? JSON.parse(raw) : [];
      const events: AnalyticsEvent[] = Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
      events.push({ t: now, type, variant: window.localStorage.getItem('fxn_ab_variant') ?? variant, data });
      window.localStorage.setItem('fxn_events', JSON.stringify(events.slice(-250)));
    } catch {}
  };

  const primaryCta = () => {
    const main = document.querySelector('main');
    const target = document.getElementById(persona === 'Recruiter' ? 'experience' : 'projects');
    if (main instanceof HTMLElement && target) {
      main.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      const raw = window.localStorage.getItem('fxn_behaviour');
      const next = raw ? JSON.parse(raw) : {};
      next.heroFocus = (next.heroFocus ?? 0) + 1;
      window.localStorage.setItem('fxn_behaviour', JSON.stringify(next));
      track('hero_primary_cta', { persona, target: target.id });
    }
  };

  const secondaryCta = () => {
    const main = document.querySelector('main');
    const target = document.getElementById('contact');
    if (main instanceof HTMLElement && target) {
      main.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      const raw = window.localStorage.getItem('fxn_behaviour');
      const next = raw ? JSON.parse(raw) : {};
      next.contactStarts = (next.contactStarts ?? 0) + 1;
      window.localStorage.setItem('fxn_behaviour', JSON.stringify(next));
      track('hero_secondary_cta', { persona });
    }
  };

  const primaryCtaLabel = useMemo(() => {
    if (persona === 'Recruiter') return 'Experience';
    if (persona === 'Founder') return 'Outcomes';
    return 'Explore Systems';
  }, [persona]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  return (
    <main ref={containerRef} className="flex-1 relative flex flex-col items-center justify-center px-12 overflow-hidden min-h-screen">
      <motion.div 
        style={{ y, opacity, scale }}
        className="w-full max-w-4xl flex flex-col items-center gap-12 text-center"
      >
        
        {/* AI Visualization - 3D Perspective Feel */}
        <div className="relative w-80 h-80 flex items-center justify-center perspective-1000">
          {/* Neural Ring Background */}
          <motion.div 
            className="absolute inset-0 border border-primary/20 rounded-full"
            animate={prefersReducedMotion ? undefined : { rotate: 360, scale: [1, 1.05, 1] }}
            transition={prefersReducedMotion ? undefined : { rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          />
          <motion.div 
            className="absolute inset-4 border border-dashed border-primary/10 rounded-full"
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={prefersReducedMotion ? undefined : { duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Geometric AI Core */}
          <motion.div 
            whileHover={{ scale: 1.1, rotateY: 20, rotateX: -10 }}
            className="relative z-10 w-40 h-40 flex items-center justify-center cursor-pointer group"
          >
            {/* Pulsing Core Glow */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors duration-500 animate-pulse" />
            
            {/* Structured Geometric Core */}
            <div className="relative w-24 h-24 border-2 border-primary/40 rounded-lg rotate-45 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="w-12 h-12 border border-primary/60 rounded-sm rotate-45 animate-spin-slow" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
            </div>

            {/* Orbiting Elements */}
            <div className="absolute inset-0 border border-primary/20 rounded-full animate-spin-slow" style={{ animationDuration: '8s' }} />
          </motion.div>

          {/* Floating Data Nodes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(0,210,255,1)]"
              initial={{ rotate: i * 45 }}
              style={{ originX: '150px', transformOrigin: 'center' }}
              animate={prefersReducedMotion ? undefined : { rotate: i * 45 + 360 }}
              transition={prefersReducedMotion ? undefined : { duration: 15 + i, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-muted"
          >
            {subline}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
          >
            {headline}
          </motion.h1>

          <AnimatePresence mode="wait">
            <motion.p
              key={variant}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-muted leading-relaxed max-w-3xl mx-auto"
            >
              AI/ML Engineer with 3+ years building agentic AI systems, LLM-powered applications, and scalable machine learning pipelines. Specialized in RAG, LangChain/LangGraph workflows, multilingual assistants, and production optimization.
            </motion.p>
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-6 mt-4"
          >
            <button 
              aria-label="View my work projects"
              className="px-8 py-4 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all transform hover:scale-105 active:scale-95"
              onClick={primaryCta}
            >
              {primaryCtaLabel}
            </button>
            <button 
              aria-label="Contact me"
              className="px-8 py-4 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all transform hover:scale-105 active:scale-95"
              onClick={secondaryCta}
            >
              Contact
            </button>
          </motion.div>

          <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted">
            <span className="px-3 py-2 rounded-full border border-white/10 bg-white/5">A/B: {variant}</span>
            <span className="px-3 py-2 rounded-full border border-white/10 bg-white/5">Persona: {persona}</span>
            <span className="px-3 py-2 rounded-full border border-white/10 bg-white/5">Try voice: “projects”, “contact”</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default HeroSection;
