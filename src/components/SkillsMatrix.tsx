'use client';

import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'Agentic AI Systems', category: 'Core', level: 94, tech: 'LangChain, LangGraph, Tool-Calling' },
  { name: 'RAG Architectures', category: 'Core', level: 92, tech: 'LlamaIndex, Pinecone/FAISS, Evaluation' },
  { name: 'LLM Engineering', category: 'Core', level: 90, tech: 'Prompting, Fine-tuning, Latency/Cost' },
  { name: 'Machine Learning', category: 'ML', level: 88, tech: 'XGBoost, Transformers, Scikit-learn' },
  { name: 'Computer Vision', category: 'ML', level: 84, tech: 'OCR, OpenCV, Document AI' },
  { name: 'Cloud & MLOps', category: 'DevOps', level: 86, tech: 'AWS/Azure, Docker, CI/CD, MLflow' },
  { name: 'Backend Engineering', category: 'Systems', level: 85, tech: 'Python, FastAPI, SQL, Node.js' },
];

const SkillsMatrix = () => {
  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-4xl font-black tracking-tighter uppercase">Intelligence Matrix</h2>
        <p className="text-muted font-mono text-xs uppercase tracking-[0.2em]">Visual proficiency across technical domains</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        {skills.map((skill, i) => (
          <div key={skill.name} className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{skill.category}</span>
                <h3 className="text-lg font-bold tracking-tight">{skill.name}</h3>
              </div>
              <span className="text-xs font-mono text-muted">{skill.level}%</span>
            </div>
            
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary to-primary/40 shadow-[0_0_10px_rgba(0,210,255,0.4)]"
              />
            </div>
            
            <span className="text-[10px] text-muted font-mono uppercase tracking-wider opacity-60">
              Tech: {skill.tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsMatrix;
