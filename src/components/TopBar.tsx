'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';

type SpeechRecognitionConstructor = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results?: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type AnalyticsEvent = {
  t: number;
  type: string;
  variant?: string;
  data?: Record<string, unknown>;
};

const TopBar = () => {
  const recognitionRef = useRef<InstanceType<SpeechRecognitionConstructor> | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  const getSpeechRecognitionCtor = (): SpeechRecognitionConstructor | null => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
  };

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionCtor();
    setVoiceSupported(Boolean(SpeechRecognition));

    const url = new URL(window.location.href);
    const override = url.searchParams.get('variant');
    const stored = window.localStorage.getItem('fxn_ab_variant');
    if (override === 'A' || override === 'B') {
      window.localStorage.setItem('fxn_ab_variant', override);
      window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: override }));
      setVariant(override);
      return;
    }
    if (stored === 'A' || stored === 'B') {
      setVariant(stored);
      return;
    }
    const assigned: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    window.localStorage.setItem('fxn_ab_variant', assigned);
    window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: assigned }));
    setVariant(assigned);
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
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    const main = document.querySelector('main');
    const target = document.getElementById(id);
    if (main instanceof HTMLElement && target) {
      main.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  };

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

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 1;
    synth.speak(utter);
  };

  const setPersona = (persona: 'Recruiter' | 'Engineer' | 'Founder') => {
    window.localStorage.setItem('fxn_persona', persona);
    track('persona_set', { persona });
    speak(`${persona} mode.`);
  };

  const handleCommand = (raw: string) => {
    const text = raw.toLowerCase().trim();
    track('voice_command', { transcript: text });

    if (text.includes('project')) {
      scrollToSection('projects');
      track('nav_section', { id: 'projects', via: 'voice' });
      speak('Opening projects.');
      return;
    }
    if (text.includes('experience') || text.includes('timeline')) {
      scrollToSection('experience');
      track('nav_section', { id: 'experience', via: 'voice' });
      speak('Opening experience.');
      return;
    }
    if (text.includes('skill')) {
      scrollToSection('skills');
      track('nav_section', { id: 'skills', via: 'voice' });
      speak('Opening skills.');
      return;
    }
    if (text.includes('testimonial')) {
      scrollToSection('testimonials');
      track('nav_section', { id: 'testimonials', via: 'voice' });
      speak('Opening testimonials.');
      return;
    }
    if (text.includes('contact') || text.includes('email')) {
      scrollToSection('contact');
      track('nav_section', { id: 'contact', via: 'voice' });
      speak('Opening contact.');
      return;
    }
    if (text.includes('top') || text.includes('home') || text.includes('hero')) {
      scrollToSection('hero');
      track('nav_section', { id: 'hero', via: 'voice' });
      speak('Back to the top.');
      return;
    }
    if (text.includes('variant a')) {
      window.localStorage.setItem('fxn_ab_variant', 'A');
      window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: 'A' }));
      setVariant('A');
      track('variant_set', { variant: 'A' });
      speak('Variant A.');
      return;
    }
    if (text.includes('variant b')) {
      window.localStorage.setItem('fxn_ab_variant', 'B');
      window.dispatchEvent(new CustomEvent('fxn_variant_change', { detail: 'B' }));
      setVariant('B');
      track('variant_set', { variant: 'B' });
      speak('Variant B.');
      return;
    }
    if (text.includes('recruiter mode') || text.includes('i am a recruiter') || text.includes("i'm a recruiter")) {
      setPersona('Recruiter');
      return;
    }
    if (text.includes('engineer mode') || text.includes('i am an engineer') || text.includes("i'm an engineer")) {
      setPersona('Engineer');
      return;
    }
    if (text.includes('founder mode') || text.includes('i am a founder') || text.includes("i'm a founder")) {
      setPersona('Founder');
      return;
    }
    if (text.includes('stop listening') || text === 'stop') {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
        recognitionRef.current = null;
        setListening(false);
      }
      speak('Voice navigation off.');
      track('voice_stop');
      return;
    }
    if (text.includes('help') || text.includes('commands')) {
      speak('Try: projects, experience, skills, testimonials, contact, top. Or say: variant A, variant B. Or: recruiter mode, engineer mode, founder mode.');
      return;
    }

    speak('Command not recognized.');
  };

  const toggleVoice = () => {
    const SpeechRecognition = getSpeechRecognitionCtor();
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
      setListening(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (event) => {
      const last = event.results?.[event.results.length - 1];
      const transcript = last?.[0]?.transcript;
      if (transcript) handleCommand(transcript);
    };
    rec.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = rec;
    setListening(true);
    try {
      rec.start();
      track('voice_start');
      speak('Voice navigation on.');
    } catch {
      setListening(false);
      recognitionRef.current = null;
    }
  };

  const metrics = useMemo(() => {
    return [
      { label: 'Experience', value: '3+ Years' },
      { label: 'Systems Built', value: '5+ Deployments' },
      { label: 'Focus', value: 'Agentic AI & RAG' },
    ];
  }, []);

  return (
    <header className="h-16 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="font-display font-black text-xl tracking-tighter">
          FM<span className="text-primary">.AI</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-mono text-muted">
        {metrics.map((m, idx) => (
          <div key={m.label} className={idx === 0 ? "flex flex-col" : "flex flex-col border-l border-white/10 pl-8"}>
            <span className="opacity-50">{m.label}</span>
            <span className={`text-foreground font-semibold ${m.label === 'Focus' ? 'text-primary' : ''}`}>{m.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-muted">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{variant}</span>
        </div>
        <button
          type="button"
          onClick={toggleVoice}
          disabled={!voiceSupported}
          aria-label={voiceSupported ? (listening ? 'Stop voice navigation' : 'Start voice navigation') : 'Voice navigation not supported'}
          aria-pressed={listening}
          className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted"
        >
          {listening ? <MicOff className="w-4 h-4 text-primary" /> : <Mic className="w-4 h-4 text-primary" />}
          <span className="hidden sm:inline">{listening ? 'Listening' : 'Voice'}</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
