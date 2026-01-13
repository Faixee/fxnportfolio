import React from 'react';
import { Github, Linkedin, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import Image from 'next/image';

const SidebarLeft = () => {
  return (
    <aside className="w-80 border-r border-white/5 p-8 flex flex-col gap-8 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="relative w-32 h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group">
          <Image 
            src="/profile.png" 
            alt="Faizan Murtuza" 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-emerald-500/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-500/40 z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-wider">Active</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl font-bold tracking-tight">Faizan Murtuza</h2>
          <p className="text-primary text-sm font-medium">AI/ML Engineer • Agentic AI • LLM Systems Developer</p>
          <p className="text-muted text-[10px] uppercase tracking-widest mt-1">Karachi, Pakistan</p>
        </div>
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

      <div className="flex flex-col gap-4 mt-auto">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted uppercase tracking-wider">Status</span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase">Available</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Open for high-impact AI/ML roles: agentic AI, RAG, and LLM systems.
          </p>
        </div>
        
        <a
          href="#contact"
          className="w-full py-4 rounded-xl border border-primary/50 text-primary text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-all flex items-center justify-center gap-2 group"
        >
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Contact / Connect
        </a>
      </div>
    </aside>
  );
};

export default SidebarLeft;
