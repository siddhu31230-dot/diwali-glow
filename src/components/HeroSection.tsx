import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Maximize2, Share2, PenLine } from 'lucide-react';
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
  onQuickShare,
}) => {
  const isPersonalized =
    greetingData.senderName !== 'Krishna & Ishwar' || Boolean(greetingData.receiverName);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(14px)', transition: { duration: 1.1 } }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-between px-4 py-6 sm:py-8 overflow-y-auto pointer-events-none"
    >
      {/* Top Bar Quick Actions */}
      <div className="w-full max-w-4xl flex items-center justify-end text-xs font-sans text-amber-300/80 pt-[env(safe-area-inset-top)] z-10 pointer-events-auto">
        {onQuickShare && (
          <button
            onClick={onQuickShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-[11px] sm:text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Share Diwali Glow"
          >
            <Share2 className="w-3 h-3 text-amber-400" />
            <span>Share Glow</span>
          </button>
        )}
      </div>

      {/* Main Center Content Container */}
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="my-auto flex flex-col items-center text-center max-w-2xl w-full px-2 sm:px-4 z-10 pointer-events-auto"
      >
        {/* Personalized Dedicated Tag if sent with custom names */}
        {isPersonalized && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-sans shadow-glow-sm"
          >
            <span>✨ </span>
            {greetingData.receiverName && (
              <span className="font-serif italic font-medium">To Dearest {greetingData.receiverName} • </span>
            )}
            <span>Sent with love by </span>
            <span className="font-serif font-bold text-amber-100 gold-text-glow">
              {greetingData.senderName}
            </span>
            <span> ✨</span>
          </motion.div>
        )}

        {/* Vedic Invocation Pill */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.9 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] sm:text-xs uppercase tracking-widest font-sans mb-3 shadow-glow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-very-slow" />
          <span>॥ श्री गणेशाय नमः • ॐ महालक्ष्म्यै नमः ॥</span>
        </motion.div>

        {/* Sacred Devotional Altar: Lord Ganesha & Goddess Lakshmi */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.2 }}
          onClick={onOpenDarshan}
          className="relative group rounded-2xl sm:rounded-3xl p-1 sm:p-1.5 bg-gradient-to-b from-amber-400/60 via-amber-600/40 to-amber-950/90 shadow-[0_0_40px_rgba(245,158,11,0.35)] cursor-pointer mb-4 max-w-sm sm:max-w-md w-full"
          title="Click to view full-screen Divine Darshan"
        >
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-amber-300/40 bg-stone-950/80">
            <img
              src={PUJA_IMAGE}
              alt="Lord Ganesha and Goddess Lakshmi Diwali Puja Sanctum"
              className="w-full h-40 sm:h-52 object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {/* Ambient vignette and golden gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-amber-400/15 pointer-events-none" />

            {/* Bottom Darshan pill inside image */}
            <div className="absolute bottom-2 inset-x-0 flex items-center justify-between px-3.5 text-[11px] sm:text-xs font-sans text-amber-200 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>श्री गणेश & माता लक्ष्मी</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300 group-hover:text-amber-100 transition-colors bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/30">
                <Maximize2 className="w-3 h-3" /> पावन दर्शन
              </span>
            </div>
          </div>
        </motion.div>

        {/* Master Headline: ✨ शुभ दीपावली ✨ */}
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 1 }}
          className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide leading-tight mb-2"
        >
          <span className="gold-text-gradient drop-shadow-[0_0_35px_rgba(245,158,11,0.7)] animate-gold-shimmer">
            ✨ शुभ दीपावली ✨
          </span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="font-serif text-sm sm:text-base md:text-lg text-amber-100/90 font-light tracking-wide max-w-xl mx-auto mb-6 px-2"
        >
          A Festival of Light, Love, Happiness & New Beginnings
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md px-2"
        >
          {/* Primary CTA: Experience the Magic */}
          <button
            onClick={onStartExperience}
            className="w-full sm:w-auto flex-1 px-7 py-3.5 sm:py-4 rounded-full gold-foil-button text-stone-950 font-serif font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-2.5 shadow-glow-md group"
          >
            <span className="text-xl group-hover:scale-110 transition-transform">🪔</span>
            <span>Experience the Magic</span>
            <Sparkles className="w-4 h-4 text-stone-950 animate-spin-very-slow" />
          </button>

          {/* Secondary CTA: Create Your Diwali Wish */}
          <button
            onClick={onOpenPersonalize}
            className="w-full sm:w-auto px-6 py-3.5 sm:py-4 rounded-full luxury-glass border border-amber-400/50 hover:border-amber-300 text-amber-200 hover:text-amber-100 font-serif font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <PenLine className="w-4 h-4 text-amber-400" />
            <span>Create Your Diwali Wish</span>
          </button>
        </motion.div>

        {/* Sound Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-amber-400/60 text-xs font-sans mt-5 tracking-wide"
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
