import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, X } from 'lucide-react';

export interface ToastData {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'share';
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-5 inset-x-4 sm:inset-x-0 mx-auto max-w-sm z-50 pointer-events-auto"
        >
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl luxury-glass border border-amber-400/50 shadow-[0_10px_35px_rgba(245,158,11,0.35)] backdrop-blur-2xl text-amber-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shrink-0 text-stone-950 shadow-glow-sm">
              {toast.type === 'share' ? (
                <Sparkles className="w-4 h-4 fill-stone-950" />
              ) : (
                <Check className="w-4 h-4 stroke-[3]" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-left">
              <h4 className="text-xs sm:text-sm font-semibold font-serif text-amber-200">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-[11px] sm:text-xs text-amber-100/75 font-sans mt-0.5 truncate">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={onDismiss}
              className="p-1 rounded-full text-amber-300/60 hover:text-amber-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
