import TopBar from '@/components/TopBar';
import SidebarLeft from '@/components/SidebarLeft';
import SidebarRight from '@/components/SidebarRight';
import HeroSection from '@/components/HeroSection';
import Background from '@/components/Background';
import ProjectShowcase from '@/components/ProjectShowcase';
import Timeline from '@/components/Timeline';
import SkillsMatrix from '@/components/SkillsMatrix';
import ContactForm from '@/components/ContactForm';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-background text-foreground">
      <Background />
      <TopBar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Fixed on desktop */}
        <div className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] z-20">
          <SidebarLeft />
        </div>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto scroll-smooth no-scrollbar">
          <section id="hero" className="h-[calc(100vh-64px)] flex items-center justify-center">
            <HeroSection />
          </section>
          
          <div className="max-w-6xl mx-auto px-12 py-24 flex flex-col gap-48">
            <section id="projects">
              <ProjectShowcase />
            </section>

            <section id="experience">
              <Timeline />
            </section>

            <section id="skills">
              <SkillsMatrix />
            </section>

            <section id="testimonials">
              <Testimonials />
            </section>

            <section id="contact">
              <ContactForm />
            </section>
          </div>
          
          <footer className="py-12 border-t border-white/5 text-center text-[10px] text-muted uppercase tracking-widest">
            © 2026 Faizan Murtuza • AI / ML Engineering Excellence
          </footer>
        </main>

        {/* Right Sidebar - Fixed on desktop */}
        <div className="hidden xl:block sticky top-16 h-[calc(100vh-64px)] z-20">
          <SidebarRight />
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="fixed top-0 left-0 w-32 h-32 border-t border-l border-white/5 pointer-events-none z-50" />
      <div className="fixed top-0 right-0 w-32 h-32 border-t border-r border-white/5 pointer-events-none z-50" />
      <div className="fixed bottom-0 left-0 w-32 h-32 border-b border-l border-white/5 pointer-events-none z-50" />
      <div className="fixed bottom-0 right-0 w-32 h-32 border-b border-r border-white/5 pointer-events-none z-50" />
    </div>
  );
}
