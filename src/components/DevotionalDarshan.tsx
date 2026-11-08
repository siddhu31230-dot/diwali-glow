import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { SceneStep } from '../types';
import { audioService } from '../utils/audio';

// Devotional artwork assets
const PUJA_IMAGE = '/images/lakshmi_ganesha_puja.jpg';
const GANESHA_IMAGE = '/images/lord_ganesha.jpg';
const LAKSHMI_IMAGE = '/images/goddess_lakshmi.jpg';

interface DevotionalDarshanProps {
  currentScene?: SceneStep;
  isLit?: boolean;
  isModalOpen?: boolean;
  onOpenModal?: (tab?: 'both' | 'ganesha' | 'lakshmi') => void;
  onCloseModal?: () => void;
}

export const DevotionalDarshan: React.FC<DevotionalDarshanProps> = ({
  isModalOpen = false,
  onCloseModal,
}) => {
  const [internalModalOpen, setInternalModalOpen] = useState<boolean>(false);
  const [activeDarshanTab, setActiveDarshanTab] = useState<'both' | 'ganesha' | 'lakshmi'>('both');

  const showModal = isModalOpen || internalModalOpen;

  const handleCloseAltar = () => {
    setInternalModalOpen(false);
    if (onCloseModal) {
      onCloseModal();
    }
  };

  const handleTabChange = (tab: 'both' | 'ganesha' | 'lakshmi') => {
    setActiveDarshanTab(tab);
    audioService.playTempleBell(880, 0);
  };

  return (
    <>
      {/* =========================================================================
          FULL-SCREEN INTERACTIVE DEVOTIONAL ALTAR MODAL
         ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04010a]/92 backdrop-blur-xl"
            onClick={handleCloseAltar}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl luxury-glass gold-foil-border p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseAltar}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 hover:text-amber-100 border border-amber-500/30 transition-all z-20"
                title="Close Darshan"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Sanctum Header */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-sans uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>॥ शुभ दीपावली पावन दर्शन ॥</span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2 p-1 rounded-full bg-stone-900/70 border border-amber-500/30 mb-4 text-xs font-sans">
                <button
                  onClick={() => handleTabChange('both')}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeDarshanTab === 'both'
                      ? 'gold-foil-button text-stone-950 font-bold shadow-glow-sm'
                      : 'text-amber-200 hover:text-amber-100'
                  }`}
                >
                  लक्ष्मी-गणेश पूजन
                </button>
                <button
                  onClick={() => handleTabChange('ganesha')}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeDarshanTab === 'ganesha'
                      ? 'gold-foil-button text-stone-950 font-bold shadow-glow-sm'
                      : 'text-amber-200 hover:text-amber-100'
                  }`}
                >
                  श्री गणेश
                </button>
                <button
                  onClick={() => handleTabChange('lakshmi')}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    activeDarshanTab === 'lakshmi'
                      ? 'gold-foil-button text-stone-950 font-bold shadow-glow-sm'
                      : 'text-amber-200 hover:text-amber-100'
                  }`}
                >
                  माता लक्ष्मी
                </button>
              </div>

              {/* Active Devotional Artwork Display */}
              <div className="relative w-full rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-[0_0_50px_rgba(245,158,11,0.4)] bg-stone-950/90 mb-4">
                {activeDarshanTab === 'both' && (
                  <motion.div
                    key="tab-both"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <img
                      src={PUJA_IMAGE}
                      alt="Lord Ganesha and Goddess Lakshmi Diwali Puja"
                      className="w-full max-h-[52vh] object-contain mx-auto"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-3 text-center">
                      <p className="text-amber-200 font-serif text-sm sm:text-base font-medium">
                        श्री लक्ष्मी-गणेश महापूजा • Diwali Sanctum
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeDarshanTab === 'ganesha' && (
                  <motion.div
                    key="tab-ganesha"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <img
                      src={GANESHA_IMAGE}
                      alt="Lord Ganesha Devotional Portrait"
                      className="w-full max-h-[52vh] object-contain mx-auto"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-3 text-center">
                      <p className="text-amber-200 font-serif text-sm sm:text-base font-medium">
                        ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeDarshanTab === 'lakshmi' && (
                  <motion.div
                    key="tab-lakshmi"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                  >
                    <img
                      src={LAKSHMI_IMAGE}
                      alt="Goddess Lakshmi Devotional Portrait"
                      className="w-full max-h-[52vh] object-contain mx-auto"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-3 text-center">
                      <p className="text-amber-200 font-serif text-sm sm:text-base font-medium">
                        ॥ ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि देहि क्लीं ह्रीं श्रीं ॐ ॥
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Devotional Blessing Inscription */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-lg w-full">
                <h4 className="font-serif text-lg text-amber-200 font-semibold mb-1">
                  श्री गणेशाय नमः • शुभ दीपावली
                </h4>
                <p className="font-serif text-xs sm:text-sm text-amber-100/90 leading-relaxed italic">
                  "May Lord Ganesha remove every obstacle and Goddess Lakshmi bless your home with happiness, peace and prosperity."
                </p>
              </div>

              {/* Bell Chime Audio Action */}
              <button
                onClick={() => audioService.playTempleBell(587.33, 0)}
                className="mt-3 px-4 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/40 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              >
                <span>🔔</span>
                <span>Ring Temple Bell / मंदिर घंटी</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
