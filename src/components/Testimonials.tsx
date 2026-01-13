'use client';

import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    text: "Faizan's expertise in AI orchestration transformed our resource management efficiency by 40%. A true professional.",
    author: "Sarah Chen",
    position: "CTO @ TechGlobal",
    logo: "TECHGLOBAL"
  },
  {
    text: "The IDP system developed by Faizan is world-class. Accuracy levels exceeded our benchmarks within weeks.",
    author: "Marcus Rodriguez",
    position: "Head of AI @ InnovateCorp",
    logo: "INNOVATE"
  },
  {
    text: "Brilliant technical mind. His ability to bridge complex ML models with production-ready software is rare.",
    author: "Dr. Elena Volkov",
    position: "Lead Research Scientist @ AI Labs",
    logo: "AILABS"
  }
];

const Testimonials = () => {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">Peer Reviews</h2>
        <p className="text-muted font-mono text-xs uppercase tracking-[0.2em]">Validated expertise from industry leaders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-6"
          >
            <div className="text-primary font-black tracking-widest text-[10px] opacity-50">{t.logo}</div>
            <p className="text-sm italic text-muted leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-auto">
              <p className="text-sm font-bold tracking-tight">{t.author}</p>
              <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{t.position}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-12 py-12 border-y border-white/5 opacity-30 grayscale hover:grayscale-0 transition-all">
        <span className="font-display font-black text-2xl tracking-tighter">TECHGLOBAL</span>
        <span className="font-display font-black text-2xl tracking-tighter">INNOVATECORP</span>
        <span className="font-display font-black text-2xl tracking-tighter">AILABS</span>
        <span className="font-display font-black text-2xl tracking-tighter">LEGACY.AI</span>
      </div>
    </div>
  );
};

export default Testimonials;
