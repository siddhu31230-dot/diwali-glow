import React from 'react';
import { motion } from 'framer-motion';
import { SceneStep } from '../types';
import { RealisticDiya } from './RealisticDiya';

interface FloatingDiyasProps {
  currentScene: SceneStep;
}

export const FloatingDiyas: React.FC<FloatingDiyasProps> = ({ currentScene }) => {
  if (currentScene < 2) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Left Diya */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.6 }}
        animate={{ opacity: 0.9, y: 0, scale: 0.72 }}
        transition={{ duration: 1.8, delay: 0.3, ease: 'easeOut' }}
        className="absolute bottom-10 -left-6 sm:left-6 md:left-16"
      >
        <RealisticDiya
          currentScene={currentScene}
          isLit={true}
          scale={0.75}
          theme="terracotta"
        />
      </motion.div>

      {/* Right Diya */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.6 }}
        animate={{ opacity: 0.9, y: 0, scale: 0.72 }}
        transition={{ duration: 1.8, delay: 0.6, ease: 'easeOut' }}
        className="absolute bottom-10 -right-6 sm:right-6 md:right-16"
      >
        <RealisticDiya
          currentScene={currentScene}
          isLit={true}
          scale={0.75}
          theme="classic"
        />
      </motion.div>

      {/* Scene 4 & 5 Extra Decorative Diyas */}
      {currentScene >= 4 && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.75, scale: 0.52 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="hidden sm:block absolute bottom-28 left-[20%] md:left-[24%]"
          >
            <RealisticDiya
              currentScene={currentScene}
              isLit={true}
              scale={0.55}
              theme="royal-brass"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.75, scale: 0.52 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="hidden sm:block absolute bottom-28 right-[20%] md:right-[24%]"
          >
            <RealisticDiya
              currentScene={currentScene}
              isLit={true}
              scale={0.55}
              theme="royal-brass"
            />
          </motion.div>
        </>
      )}
    </div>
  );
};
