'use client';

import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    year: 'Nov 2024 – Present',
    title: 'AI/ML Engineer',
    company: 'Logilink LLC',
    description: 'Built multilingual agentic systems with autonomous planning + tool use and optimized transformer pipelines to reduce latency. Delivered RAG workflows that improved retrieval quality and production reliability.'
  },
  {
    year: 'Jan 2022 – Jan 2025',
    title: 'AI/ML Engineer',
    company: 'Fameitech LLC',
    description: 'Designed LLM-powered assistants for global clients and shipped multilingual voice chatbots (Urdu/English/Arabic). Automated workflows with microservices to reduce manual work and improved deployment velocity.'
  },
  {
    year: 'Sep 2023 – Jan 2024',
    title: 'AI Visualizer',
    company: 'NFTStudio24',
    description: 'Automated AI visualization workflows to reduce content cycle time and improve iteration speed for creative pipelines.'
  },
  {
    year: '2023',
    title: 'Associate’s in Artificial Intelligence',
    company: 'Iqra University',
    description: 'Core foundations in machine learning, deep learning, and applied AI systems with a focus on production-minded implementation.'
  }
];

const Timeline = () => {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">Evolution</h2>
        <p className="text-muted font-mono text-xs uppercase tracking-[0.2em]">A technical journey through intelligence</p>
      </div>

      <div className="relative flex flex-col gap-12">
        <div className="absolute left-[3.5px] top-2 bottom-2 w-px bg-white/10" />
        
        {timelineData.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-10 group"
          >
            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-white/20 group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(0,210,255,1)] transition-all z-10" />
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-widest">{item.year}</span>
              <h3 className="text-lg font-bold tracking-tight">{item.title} <span className="text-muted font-normal opacity-50">@ {item.company}</span></h3>
              <p className="text-sm text-muted leading-relaxed mt-2 max-w-2xl">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
