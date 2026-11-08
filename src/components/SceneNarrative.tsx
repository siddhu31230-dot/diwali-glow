import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GreetingData, SceneStep } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface SceneNarrativeProps {
  currentScene: SceneStep;
  greetingData: GreetingData;
  onOpenPersonalize?: () => void;
}

export const SceneNarrative: React.FC<SceneNarrativeProps> = ({
  currentScene,
  greetingData,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between px-6 pt-16 pb-32 sm:pb-36 z-20 text-center">
      <AnimatePresence mode="wait">
        {/* SCENE 1: The Beginning */}
        {currentScene === 1 && (
          <motion.div
            key="scene-1"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-lg mt-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm uppercase tracking-widest font-sans mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>A Sacred Flame</span>
            </motion.div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-amber-100 font-light tracking-wide leading-tight gold-text-glow">
              A little light, <br />
              <span className="italic font-normal gold-text-gradient">just for you...</span>
            </h1>
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

        {/* SCENE 4: Grand Diwali Reveal */}
        {currentScene === 4 && (
          <motion.div
            key="scene-4"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-3xl mt-4 sm:mt-6 px-4"
          >
            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 0.9, letterSpacing: '0.35em' }}
              transition={{ duration: 1.2 }}
              className="text-amber-300 text-xs sm:text-sm uppercase font-sans mb-2 font-medium"
            >
              शुभ दीपावली • FESTIVAL OF LIGHTS
            </motion.div>

            <motion.h1
              initial={{ scale: 0.8, filter: 'blur(10px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 1.2, ease: 'easeOut' }}
              className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none mb-3"
            >
              <span className="gold-text-gradient drop-shadow-[0_0_35px_rgba(245,158,11,0.65)]">
                Happy Diwali
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
              className="font-serif text-sm sm:text-lg md:text-xl text-amber-200/90 font-light max-w-xl italic mt-1"
            >
              May the divine glow of diyas illuminate your home with joy, abundance and eternal serenity.
            </motion.p>
          </motion.div>
        )}

        {/* SCENE 5: Final Message & Celebration Card */}
        {currentScene === 5 && (
          <motion.div
            key="scene-5"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="flex flex-col items-center max-w-xl mt-3 sm:mt-6 px-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="p-5 sm:p-7 rounded-2xl luxury-glass gold-foil-border shadow-2xl relative overflow-hidden text-center w-full"
            >
              {/* Subtle gold decorative corner flourishes */}
              <div className="absolute top-2 left-2 text-amber-400/40 text-xs font-serif">✧</div>
              <div className="absolute top-2 right-2 text-amber-400/40 text-xs font-serif">✧</div>
              <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs font-serif">✧</div>
              <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs font-serif">✧</div>

              <p className="font-serif text-base sm:text-xl md:text-2xl text-amber-100 font-light italic leading-relaxed mb-4">
                "May every diya bring a new reason to smile."
              </p>

              <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400/60 to-transparent my-3" />

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold gold-text-gradient mb-2 tracking-wide">
                Happy Diwali 🪔
              </h2>

              <div className="flex items-center justify-center gap-1.5 text-amber-200/90 text-sm sm:text-base font-sans mt-3">
                <span>With love,</span>
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
