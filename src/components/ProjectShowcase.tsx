'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';
import { ExternalLink, Terminal, Shield, Zap } from 'lucide-react';

type AnalyticsEvent = {
  t: number;
  type: string;
  variant?: string;
  data?: Record<string, unknown>;
};

const ProjectShowcase = () => {
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

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">Selected Works</h2>
        <p className="text-muted font-mono text-xs uppercase tracking-[0.2em]">Enterprise-grade AI deployments & POCs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            onViewportEnter={() => {
              bumpBehaviour('projectViews');
              track('project_view', { id: project.id });
            }}
            onClick={() => {
              bumpBehaviour('projectOpens');
              track('project_open', { id: project.id });
            }}
            className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all overflow-hidden flex flex-col gap-6 cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all">
              <ExternalLink className="w-6 h-6" />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{project.category}</span>
              <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map(t => (
                <span key={t} className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-mono text-muted uppercase border border-white/5">
                  {t}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-6 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500 mb-1" />
                <span className="text-[8px] text-muted uppercase font-bold tracking-tighter">Perf</span>
                <span className="text-[10px] font-bold">{Object.values(project.stats)[0]}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Zap className="w-3.5 h-3.5 text-primary mb-1" />
                <span className="text-[8px] text-muted uppercase font-bold tracking-tighter">Metric</span>
                <span className="text-[10px] font-bold">{Object.values(project.stats)[1]}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Terminal className="w-3.5 h-3.5 text-purple-500 mb-1" />
                <span className="text-[8px] text-muted uppercase font-bold tracking-tighter">Status</span>
                <span className="text-[10px] font-bold">Deployed</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectShowcase;
