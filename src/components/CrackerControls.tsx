import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronUp, ChevronDown } from 'lucide-react';
import { SceneStep } from '../types';

interface CrackerControlsProps {
  currentScene: SceneStep;
  onTriggerAnar: () => void;
  onTriggerChakri: () => void;
  onTriggerLadi: () => void;
  onTriggerRocket: () => void;
  onToggleSparkler: () => void;
}

export const CrackerControls: React.FC<CrackerControlsProps> = ({
  currentScene,
  onTriggerAnar,
  onTriggerChakri,
  onTriggerLadi,
  onTriggerRocket,
  onToggleSparkler,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSparkler, setActiveSparkler] = useState(false);

  // Show only once scene is active
  if (currentScene < 2) return null;

  const handleSparkler = () => {
    setActiveSparkler((prev) => !prev);
    onToggleSparkler();
  };

  return (
    <div className="fixed bottom-20 sm:bottom-24 inset-x-0 mx-auto max-w-fit z-30 pointer-events-auto flex flex-col items-center">
      {/* Expanded Quick Cracker Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="mb-2 p-2 rounded-2xl luxury-glass gold-foil-border shadow-2xl flex items-center gap-1.5 sm:gap-2 backdrop-blur-xl"
          >
            {/* Anar */}
            <button
              onClick={onTriggerAnar}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Light Anar (Flowerpot Fountain)"
            >
              <span className="text-base">🎇</span>
              <span className="font-medium">Anar</span>
            </button>

            {/* Chakri */}
            <button
              onClick={onTriggerChakri}
              className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Spin Chakri (Ground Spinner)"
            >
              <span className="text-base">💫</span>
              <span className="font-medium">Chakri</span>
            </button>

            {/* Sparkler / Phooljhadi */}
            <button
              onClick={handleSparkler}
              className={`px-3 py-2 rounded-xl border text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                activeSparkler
                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold shadow-glow-sm'
                  : 'bg-amber-500/15 hover:bg-amber-500/30 border-amber-400/30 text-amber-200 font-medium'
              }`}
              title="Wave Phooljhadi (Touch/Move cursor on screen)"
            >
              <span className="text-base">✨</span>
              <span>{activeSparkler ? 'Sparkler ON' : 'Phooljhadi'}</span>
            </button>

            {/* Ladi */}
            <button
              onClick={onTriggerLadi}
              className="px-3 py-2 rounded-xl bg-red-600/25 hover:bg-red-600/40 border border-red-500/40 text-red-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Burst Festive Ladi (String of Crackers)"
            >
              <span className="text-base">🧨</span>
              <span className="font-medium">Ladi</span>
            </button>

            {/* Rocket */}
            <button
              onClick={onTriggerRocket}
              className="px-3 py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              title="Launch Aerial Sky Rocket"
            >
              <span className="text-base">🚀</span>
              <span className="font-medium">Rocket</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pill Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-1.5 rounded-full luxury-glass border border-amber-400/40 text-amber-200 text-xs font-sans font-medium flex items-center gap-2 shadow-glow-sm transition-all bg-purple-950/60"
      >
        <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="tracking-wide">Burst Crackers 🎆</span>
        {isOpen ? <ChevronDown className="w-3 h-3 text-amber-300" /> : <ChevronUp className="w-3 h-3 text-amber-300" />}
      </motion.button>
    </div>
  );
};
