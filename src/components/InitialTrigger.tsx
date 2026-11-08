import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GreetingData } from '../types';

interface InitialTriggerProps {
  greetingData: GreetingData;
  onStart: () => void;
}

export const InitialTrigger: React.FC<InitialTriggerProps> = ({
  greetingData,
  onStart,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(12px)', transition: { duration: 1 } }}
      onClick={onStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 cursor-pointer bg-[#05010a]/90 backdrop-blur-md"
    >
      {/* Background ambient pulse */}
      <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 filter blur-3xl animate-pulse pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center max-w-md p-8 rounded-3xl luxury-glass gold-foil-border shadow-2xl"
      >
        {/* Festive Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs uppercase tracking-widest font-sans mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Cinematic Digital Gift</span>
        </div>

        {/* Sender Attribution */}
        {greetingData.receiverName && (
          <p className="font-serif text-amber-200/90 text-sm tracking-widest uppercase mb-1">
            To Dearest {greetingData.receiverName}
          </p>
        )}

        <h1 className="font-serif text-2xl sm:text-3xl text-amber-100 font-normal leading-snug mb-3">
          <span className="gold-text-gradient font-bold">{greetingData.senderName}</span>
          <br />
          <span>has sent you a Diwali Diya</span>
        </h1>

        <p className="text-amber-200/70 text-sm font-sans mb-8 font-light">
          A sacred flame carrying wishes of peace, prosperity and radiant happiness.
        </p>

        {/* Pulsing Light Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-8 py-4 rounded-full gold-foil-button text-stone-950 font-serif font-bold text-base sm:text-lg tracking-wide flex items-center gap-3 shadow-glow-md"
        >
          <span className="text-xl">🪔</span>
          <span>Tap to Light Your Diya</span>
          <Sparkles className="w-4 h-4 text-stone-950 animate-spin-very-slow" />
        </motion.button>

        <p className="text-amber-400/50 text-xs font-sans mt-5 tracking-wide">
          (Best experienced with sound enabled ♫)
        </p>
      </motion.div>
    </motion.div>
  );
};
