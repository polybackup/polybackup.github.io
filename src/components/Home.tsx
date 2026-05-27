import { motion } from 'motion/react';
import { Compass, FormInput, Activity, ShieldCheck, Zap } from 'lucide-react';
import { ActiveScreen } from '../types';

interface HomeProps {
  setScreen: (screen: ActiveScreen) => void;
}

export default function Home({ setScreen }: HomeProps) {
  // Staggered Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 80, damping: 15 } },
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-6 bg-[#050505] overflow-hidden">
      {/* Sleek Theme Background Mesh Gradient */}
      <div className="bg-mesh" />
      <div className="absolute inset-0 bg-grid opacity-30 pointers-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-12 z-10"
      >
        {/* Hero Branding */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/30 border border-blue-900/35 text-brand-blue font-mono text-xs uppercase tracking-widest">
            <Zap className="w-3 h-3 animate-pulse text-blue-400" />
            UNBLOCKED ACCESS PORT
          </div>
          
          <h1 className="font-display font-black text-5xl sm:text-7xl tracking-tight text-white uppercase select-none">
            POLY<span className="text-brand-blue">BACKUP</span>
          </h1>
          
          <p className="max-w-md sm:max-w-lg mx-auto text-slate-400 font-sans text-sm sm:text-base tracking-wide leading-relaxed">
            The clean, essential repository for high-performance web gaming. Fast, minimal, and always available offline and online.
          </p>
        </motion.div>

        {/* Dynamic Portals / Large Clean Navigation Buttons */}
        <motion.div 
          variants={itemVariants} 
          className="grid gap-6 sm:grid-cols-2 w-full max-w-2xl mt-4"
        >
          {/* Card 1: Enter Games Portal */}
          <button
            onClick={() => setScreen('games')}
            className="group relative flex flex-col items-start text-left p-6 sm:p-8 col-span-1 rounded-2xl bg-[#111111] border border-slate-900 hover:border-blue-500/50 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-brand-blue group-hover:text-brand-accent group-hover:bg-blue-950/20 group-hover:border-blue-900/30 transition-all duration-300 mb-6">
              <Compass className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <h3 className="font-display font-bold text-lg text-zinc-100 tracking-wide uppercase mb-2 group-hover:text-brand-blue transition-colors">
              GAME LIBRARY
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
              Explore our pristine, curated collection of unblocked titles. Sandbox loaded and framed with responsive high frame-rate full screen capabilities.
            </p>
            
            <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-brand-blue group-hover:text-brand-accent font-semibold group-hover:translate-x-1 transition-transform">
              EXPLORE LIBRARY &rarr;
            </span>
          </button>

          {/* Card 2: Request Port */}
          <button
            onClick={() => setScreen('request')}
            className="group relative flex flex-col items-start text-left p-6 sm:p-8 col-span-1 rounded-2xl bg-[#111111] border border-slate-900 hover:border-blue-500/50 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)] cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-brand-blue group-hover:text-brand-accent group-hover:bg-blue-950/20 group-hover:border-blue-900/30 transition-all duration-300 mb-6">
              <FormInput className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </div>

            <h3 className="font-display font-bold text-lg text-zinc-100 tracking-wide uppercase mb-2 group-hover:text-brand-blue transition-colors">
              SUBMIT REQUESTS
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
              Missing your favorite high-fidelity platformers, driving tracks, or arcade physics titles? Direct submission available through Google Forms integrations.
            </p>

            <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-brand-blue group-hover:text-brand-accent font-semibold group-hover:translate-x-1 transition-transform">
              REQUEST A GAME &rarr;
            </span>
          </button>
        </motion.div>

        {/* System Status Indicators in Footer style */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 border-t border-slate-900 w-full max-w-xl font-mono text-[10px] text-zinc-500 uppercase tracking-widest"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-500/70" />
            <span>CORE NODE: <strong className="text-zinc-300 font-medium">S-TIER SPEED</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500/70" />
            <span>SECURE SANDBOX WORKSPACE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM STATUS: <span className="text-emerald-400 font-bold">ONLINE</span></span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
