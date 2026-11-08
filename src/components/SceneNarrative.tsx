import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GreetingData, SceneStep } from '../types';
import { Sparkles, Heart, Sun, Maximize2 } from 'lucide-react';

const PUJA_IMAGE = '/images/lakshmi_ganesha_puja.jpg';

interface SceneNarrativeProps {
  currentScene: SceneStep;
  greetingData: GreetingData;
  onOpenPersonalize?: () => void;
  onOpenDarshan?: () => void;
}

export const SceneNarrative: React.FC<SceneNarrativeProps> = ({
  currentScene,
  greetingData,
  onOpenDarshan,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between px-6 pt-16 pb-32 sm:pb-36 z-20 text-center">
      <AnimatePresence mode="wait">
        {/* SCENE 1: The Beginning & Devotional Opening */}
        {currentScene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-md mt-2 sm:mt-4 pointer-events-auto"
          >
            {/* Devotional Vedic Chants Header */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs uppercase tracking-widest font-sans mb-1.5 shadow-glow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-very-slow" />
              <span>॥ श्री गणेशाय नमः • ॐ महालक्ष्म्यै नमः ॥</span>
            </motion.div>

            <h1 className="font-serif text-lg sm:text-2xl text-amber-100 font-light tracking-wide leading-tight gold-text-glow mb-2.5">
              A little light, <span className="italic font-normal gold-text-gradient">just for you...</span>
            </h1>

            {/* Sacred Devotional Altar: Lord Ganesha & Goddess Lakshmi */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1.2 }}
              onClick={onOpenDarshan}
              className="relative group rounded-2xl overflow-hidden p-1 bg-gradient-to-b from-amber-400/50 via-amber-600/30 to-amber-950/80 shadow-[0_0_35px_rgba(245,158,11,0.35)] cursor-pointer"
              title="Click for full-screen Divine Darshan"
            >
              <div className="relative rounded-xl overflow-hidden border border-amber-300/40 bg-stone-950/70">
                <img
                  src={PUJA_IMAGE}
                  alt="Lord Ganesha and Goddess Lakshmi Diwali Puja"
                  className="w-64 sm:w-80 h-36 sm:h-44 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-amber-400/10 pointer-events-none" />
                <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-between px-3 text-[11px] font-sans text-amber-200/90 font-medium tracking-wide">
                  <span>श्री गणेश & माता लक्ष्मी</span>
                  <span className="flex items-center gap-1 text-amber-300 group-hover:text-amber-100 transition-colors">
                    <Maximize2 className="w-3 h-3" /> दर्शन
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-amber-200/80 text-[11px] sm:text-xs font-serif italic mt-2 tracking-wide text-center"
            >
              "May their divine grace bless your path with wisdom and endless light"
            </motion.p>
          </motion.div>
        )}

        {/* SCENE 2: Lighting the Diya */}
        {currentScene === 2 && (
          <motion.div
            key="scene-2"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-xl mt-6 sm:mt-10"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="text-amber-200/80 text-xs sm:text-sm uppercase tracking-[0.25em] font-sans mb-3"
            >
              Dispelling the darkness
            </motion.p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-amber-100 font-normal leading-snug">
              Lighting up every corner with warmth, <br />
              <span className="gold-text-gradient font-medium italic">hope, and gentle grace.</span>
            </h2>
          </motion.div>
        )}

        {/* SCENE 3: Personal Greeting */}
        {currentScene === 3 && (
          <motion.div
            key="scene-3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25, filter: 'blur(8px)' }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-2xl mt-4 sm:mt-8 px-2"
          >
            {greetingData.receiverName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-amber-300 font-serif text-lg sm:text-xl tracking-wider mb-2 italic"
              >
                For Dearest {greetingData.receiverName}
              </motion.div>
            )}

            {/* SENDER NAME LIT A DIYA FOR YOU */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mb-4"
            >
              <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide leading-tight">
                <span className="gold-text-gradient drop-shadow-md">
                  {greetingData.senderName}
                </span>{' '}
                <span className="text-amber-100 font-light block sm:inline mt-1 sm:mt-0">
                  lit a diya for you ✨
                </span>
              </h2>
            </motion.div>

            {/* Blessing Message */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.2 }}
              className="max-w-lg mt-2"
            >
              <p className="font-serif text-base sm:text-lg md:text-xl text-amber-100/90 leading-relaxed font-light italic">
                "{greetingData.customMessage || 'May your life shine with happiness, prosperity, peace and endless possibilities.'}"
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 4: Grand Diwali Reveal & Devotional Altar */}
        {currentScene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-3xl mt-1 sm:mt-2 px-4 pointer-events-auto"
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 0.9, letterSpacing: '0.35em' }}
              transition={{ duration: 1.2 }}
              className="text-amber-300 text-xs sm:text-sm uppercase font-sans mb-1 font-medium"
            >
              शुभ दीपावली • FESTIVAL OF LIGHTS
            </motion.div>

            <motion.h1
              initial={{ scale: 0.8, filter: 'blur(10px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-2"
            >
              <span className="gold-text-gradient drop-shadow-[0_0_35px_rgba(245,158,11,0.65)]">
                Happy Diwali
              </span>
            </motion.h1>

            {/* Sacred Altar of Lord Ganesha & Goddess Lakshmi */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              onClick={onOpenDarshan}
              className="relative group rounded-2xl overflow-hidden p-1 bg-gradient-to-b from-amber-400/60 via-amber-600/40 to-amber-950/80 shadow-[0_0_45px_rgba(245,158,11,0.45)] cursor-pointer"
              title="Click for full-screen Divine Darshan"
            >
              <div className="relative rounded-xl overflow-hidden border border-amber-300/50 bg-stone-950/80">
                <img
                  src={PUJA_IMAGE}
                  alt="Lord Ganesha and Goddess Lakshmi Festive Sanctum"
                  className="w-56 sm:w-72 h-36 sm:h-44 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-amber-400/10 pointer-events-none" />
                <div className="absolute bottom-1.5 inset-x-0 flex items-center justify-center gap-1.5 text-xs text-amber-200 font-serif">
                  <Sun className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>पावन लक्ष्मी-गणेश पूजन</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 5: Final Devotional Blessing & Celebration Card */}
        {currentScene === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-xl mt-2 sm:mt-4 px-3 sm:px-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="p-5 sm:p-6 rounded-2xl luxury-glass gold-foil-border shadow-2xl relative overflow-hidden text-center w-full"
            >
              {/* Subtle gold decorative corner flourishes */}
              <div className="absolute top-2 left-2 text-amber-400/40 text-xs font-serif">✧</div>
              <div className="absolute top-2 right-2 text-amber-400/40 text-xs font-serif">✧</div>
              <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs font-serif">✧</div>
              <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs font-serif">✧</div>

              {/* Devotional Invocation */}
              <div className="space-y-1 mb-2">
                <p className="font-serif text-lg sm:text-xl font-bold gold-text-gradient tracking-widest">
                  श्री गणेशाय नमः
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide">
                  शुभ दीपावली 🪔
                </h2>
              </div>

              <div className="h-px w-28 mx-auto bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-2" />

              {/* Required Blessing Message */}
              <p className="font-serif text-sm sm:text-base md:text-lg text-amber-100/95 font-light italic leading-relaxed mb-4 px-2">
                "May Lord Ganesha remove every obstacle and Goddess Lakshmi bless your home with happiness, peace and prosperity."
              </p>

              {/* Divine Darshan Button */}
              {onOpenDarshan && (
                <button
                  onClick={onOpenDarshan}
                  className="mb-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-200 hover:text-amber-100 text-xs font-sans transition-all active:scale-95 shadow-sm"
                  title="View Lord Ganesha and Goddess Lakshmi Altar"
                >
                  <span>🪔</span>
                  <span>पावन लक्ष्मी-गणेश दर्शन • Divine Darshan</span>
                </button>
              )}

              {/* Sender Attribution */}
              <div className="flex items-center justify-center gap-1.5 text-amber-200/90 text-sm sm:text-base font-sans pt-1 border-t border-amber-500/20">
                <span>With love & blessings,</span>
                <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
                <span className="font-semibold text-amber-300 font-serif text-base sm:text-lg">
                  {greetingData.senderName}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty bottom spacer to balance layout with diya below */}
      <div className="h-6" />
    </div>
  );
};
