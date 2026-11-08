import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Maximize2 } from 'lucide-react';
import { GreetingData } from '../types';

const PUJA_IMAGE = '/images/lakshmi_ganesha_puja.jpg';

interface HeroSectionProps {
  greetingData: GreetingData;
  onStartExperience: () => void;
  onOpenPersonalize: () => void;
  onOpenDarshan: () => void;
  onQuickShare?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  greetingData,
  onStartExperience,
  onOpenPersonalize,
  onOpenDarshan,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(14px)', transition: { duration: 1.1 } }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center px-4 py-3 sm:py-6 overflow-y-auto pointer-events-none"
    >
      {/* Main Center Greeting Card */}
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="my-auto flex flex-col items-center text-center max-w-md w-full px-5 py-5 sm:px-8 sm:py-7 rounded-3xl luxury-glass gold-foil-border shadow-2xl z-10 pointer-events-auto relative backdrop-blur-xl border border-amber-400/40"
      >
        {/* Ambient subtle glow behind card */}
        <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-36 h-36 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />

        {/* Festive Badge */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[10px] sm:text-xs uppercase tracking-widest font-sans mb-2.5 shadow-glow-sm"
        >
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-very-slow" />
          <span>Cinematic Digital Gift</span>
        </motion.div>

        {/* Sacred Devotional Altar: Lord Ganesha & Goddess Lakshmi */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, duration: 1 }}
          onClick={onOpenDarshan}
          className="relative group rounded-xl sm:rounded-2xl overflow-hidden p-0.5 sm:p-1 bg-gradient-to-b from-amber-400/60 via-amber-600/40 to-amber-950/90 shadow-[0_0_25px_rgba(245,158,11,0.35)] cursor-pointer mb-2.5 w-full max-w-[270px] sm:max-w-[320px]"
          title="Click for full-screen Divine Darshan"
        >
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-amber-300/40 bg-stone-950/80">
            <img
              src={PUJA_IMAGE}
              alt="Lord Ganesha and Goddess Lakshmi Diwali Puja"
              className="w-full h-28 sm:h-36 object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-amber-400/15 pointer-events-none" />
            <div className="absolute bottom-1 inset-x-0 flex items-center justify-between px-2.5 text-[9px] sm:text-[11px] font-sans text-amber-200 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>श्री गणेश & माता लक्ष्मी</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300 group-hover:text-amber-100 transition-colors bg-amber-950/70 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                <Maximize2 className="w-2.5 h-2.5" /> पावन दर्शन
              </span>
            </div>
          </div>
        </motion.div>

        {/* Receiver Dedication if present */}
        {greetingData.receiverName && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-serif text-amber-300 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-1"
          >
            To Dearest {greetingData.receiverName}
          </motion.p>
        )}

        {/* SENDER NAME & HAS SENT YOU A DIWALI DIYA */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 1 }}
          className="mb-1.5"
        >
          <h1 className="font-serif text-xl sm:text-3xl text-amber-100 font-normal leading-tight tracking-wide">
            <button
              onClick={onOpenPersonalize}
              className="gold-text-gradient font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all text-center group cursor-pointer inline-block"
              title="Click to personalize name"
            >
              <span>{greetingData.senderName}</span>
            </button>
            <span className="block text-amber-100/95 font-serif font-light text-sm sm:text-lg uppercase tracking-widest mt-0.5">
              has sent you a Diwali Diya
            </span>
          </h1>
        </motion.div>

        {/* Poetic Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-amber-200/80 text-[11px] sm:text-xs font-sans mb-3.5 font-light max-w-xs leading-relaxed"
        >
          A sacred flame carrying wishes of peace, prosperity and radiant happiness.
        </motion.p>

        {/* Primary Pulsing Diya Light CTA */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartExperience}
          className="w-full px-6 py-3 sm:py-3.5 rounded-full gold-foil-button text-stone-950 font-serif font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-glow-md group"
        >
          <span className="text-lg group-hover:scale-110 transition-transform">🪔</span>
          <span>Tap to Light Your Diya</span>
          <Sparkles className="w-3.5 h-3.5 text-stone-950 animate-spin-very-slow" />
        </motion.button>

        {/* Personalize / Change Name Link at Bottom */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          onClick={onOpenPersonalize}
          className="mt-3 text-amber-300/90 hover:text-amber-100 text-[11px] sm:text-xs font-sans flex items-center justify-center gap-1.5 underline decoration-amber-400/50 hover:decoration-amber-300 underline-offset-4 transition-colors"
        >
          <span>✏️</span>
          <span>Send with your own name? Click to personalize ✍️</span>
        </motion.button>

        {/* Sound hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-amber-400/60 text-[10px] sm:text-xs font-sans mt-2 tracking-wide"
        >
          (Best experienced with sound enabled ♫)
        </motion.p>
      </motion.div>

      {/* Subtle Footer Attribution */}
      <div className="w-full text-center text-[10px] sm:text-xs text-amber-300/40 font-sans pb-[env(safe-area-inset-bottom)] z-10">
        May the sacred light illuminate every corner of your life.
      </div>
    </motion.div>
  );
};

export default HeroSection;
