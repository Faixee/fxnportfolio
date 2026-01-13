'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Shield, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

type AnalyticsEvent = {
  t: number;
  type: string;
  variant?: string;
  data?: Record<string, unknown>;
};

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const bumpBehaviour = (key: string) => {
    try {
      const raw = window.localStorage.getItem('fxn_behaviour');
      const next = raw ? JSON.parse(raw) : {};
      next[key] = (next[key] ?? 0) + 1;
      window.localStorage.setItem('fxn_behaviour', JSON.stringify(next));
    } catch {}
  };

  const track = (type: string, data?: Record<string, unknown>) => {
    try {
      const now = Date.now();
      const raw = window.localStorage.getItem('fxn_events');
      const parsed = raw ? JSON.parse(raw) : [];
      const events: AnalyticsEvent[] = Array.isArray(parsed) ? (parsed as AnalyticsEvent[]) : [];
      events.push({ t: now, type, variant: window.localStorage.getItem('fxn_ab_variant') ?? 'A', data });
      window.localStorage.setItem('fxn_events', JSON.stringify(events.slice(-250)));
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    track('contact_submit_attempt');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        bumpBehaviour('contactSubmits');
        track('contact_submit_success');
      } else {
        setStatus('error');
        bumpBehaviour('contactErrors');
        track('contact_submit_error', { status: response.status });
      }
    } catch {
      setStatus('error');
      bumpBehaviour('contactErrors');
      track('contact_submit_error', { status: 'network' });
    }
  };

  return (
    <div className="flex flex-col gap-16" id="contact">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">Neural Link</h2>
        <p className="text-muted font-mono text-xs uppercase tracking-[0.2em]">Initiate communication protocol</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-muted uppercase font-bold tracking-widest">Name</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onFocus={() => {
                bumpBehaviour('contactFormFocus');
                track('contact_focus', { field: 'name' });
              }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none transition-all"
              placeholder="Identification required"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-muted uppercase font-bold tracking-widest">Email</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onFocus={() => {
                bumpBehaviour('contactFormFocus');
                track('contact_focus', { field: 'email' });
              }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none transition-all"
              placeholder="return_address@host.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] text-muted uppercase font-bold tracking-widest">Message</label>
            <textarea 
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              onFocus={() => {
                bumpBehaviour('contactFormFocus');
                track('contact_focus', { field: 'message' });
              }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm focus:border-primary/50 outline-none transition-all resize-none"
              placeholder="Detailed communication payload..."
            />
          </div>

          <button 
            disabled={status === 'loading' || status === 'success'}
            className="group relative h-14 w-full rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-widest overflow-hidden transition-all disabled:opacity-50"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-transform group-hover:-translate-y-full">
              {status === 'idle' && (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Transmit
                </>
              )}
              {status === 'loading' && "Processing..."}
              {status === 'success' && (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Sent
                </>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform group-hover:translate-y-0 bg-white text-black">
              Confirm Transmission
            </div>
          </button>

          <div aria-live="polite" className="min-h-5 text-[10px] font-mono uppercase tracking-widest text-muted">
            {status === 'error' && 'Transmission failed. Retry or use email.'}
            {status === 'success' && 'Transmission accepted.'}
          </div>
        </form>

        <div className="flex flex-col gap-8 justify-center p-12 rounded-2xl bg-white/5 border border-white/10 border-dashed">
          <div className="flex flex-col gap-2">
            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Secure Channel</span>
            <p className="text-muted text-sm leading-relaxed">
              All communications are encrypted and logged for professional evaluation. Expect a response within 24-48 hours.
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs">
              <Mail className="w-4 h-4 text-primary" />
              <a className="text-muted hover:text-foreground transition-colors" href="mailto:faixee10@gmail.com">
                faixee10@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Phone className="w-4 h-4 text-primary" />
              <a className="text-muted hover:text-foreground transition-colors" href="tel:+923122438813">
                +92 312 2438813
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted">Karachi, Pakistan</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              className="h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted"
              href="https://linkedin.com/in/faizan-murtuza-515713190"
              target="_blank"
              rel="noreferrer"
              aria-label="Open LinkedIn profile"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              className="h-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted"
              href="https://github.com/Faixee"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub profile"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                 <Shield className="w-4 h-4 text-primary" />
               </div>
               <span className="text-xs font-mono text-muted">AES-256 Protocol Simulation</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                 <AlertCircle className="w-4 h-4 text-primary" />
               </div>
               <span className="text-xs font-mono text-muted">Status: Operational</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
