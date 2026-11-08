import React from 'react';
import { motion } from 'framer-motion';
import { SceneStep } from '../types';
import { audioService } from '../utils/audio';

interface RealisticDiyaProps {
  currentScene: SceneStep;
  isLit: boolean;
  onDiyaClick?: () => void;
  scale?: number;
  className?: string;
  theme?: 'classic' | 'royal-brass' | 'terracotta';
}

export const RealisticDiya: React.FC<RealisticDiyaProps> = ({
  currentScene,
  isLit,
  onDiyaClick,
  scale = 1,
  className = '',
  theme = 'royal-brass',
}) => {
  const handleClick = () => {
    if (isLit) {
      audioService.playTempleBell(880, 0);
    }
    if (onDiyaClick) {
      onDiyaClick();
    }
  };

  // Scene-dependent size & scale
  const isScene1 = currentScene === 1;

  return (
    <motion.div
      onClick={handleClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{
        scale: isScene1 ? 0.85 * scale : 1 * scale,
        opacity: isLit ? 1 : 0.4,
      }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className={`relative select-none cursor-pointer flex flex-col items-center justify-center ${className}`}
    >
      {/* 1. Ambient Golden Halo & Radiance */}
      {isLit && (
        <>
          <div
            className="absolute -top-24 pointer-events-none rounded-full animate-halo"
            style={{
              width: isScene1 ? '180px' : '320px',
              height: isScene1 ? '180px' : '320px',
              background: 'radial-gradient(circle, rgba(254, 215, 170, 0.5) 0%, rgba(245, 158, 11, 0.3) 35%, rgba(217, 119, 6, 0.12) 65%, transparent 80%)',
              filter: 'blur(22px)',
            }}
          />
          {/* Intense core flame aura */}
          <div
            className="absolute -top-12 pointer-events-none rounded-full"
            style={{
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(253, 224, 71, 0.6) 40%, transparent 75%)',
              filter: 'blur(14px)',
            }}
          />
        </>
      )}

      {/* 2. Realistic Flame Structure */}
      {isLit && (
        <div className="relative -mb-3 z-20 flex flex-col items-center">
          {/* Flame Container with Organic Flicker */}
          <div className="relative w-12 h-20 animate-flame flex items-center justify-center">
            {/* Outer Warm Amber Teardrop */}
            <div
              className="absolute bottom-0 w-10 h-18 rounded-[50%_50%_40%_40%/70%_70%_30%_30%]"
              style={{
                background: 'linear-gradient(to top, rgba(234, 88, 12, 0.95), rgba(245, 158, 11, 0.95), rgba(253, 224, 71, 0.9))',
                boxShadow: '0 0 25px #fbbf24, 0 0 45px #f97316',
                filter: 'blur(0.5px)',
              }}
            />

            {/* Inner Golden-Yellow Core */}
            <div
              className="absolute bottom-1 w-6 h-12 rounded-[50%_50%_40%_40%/75%_75%_25%_25%]"
              style={{
                background: 'linear-gradient(to top, #f59e0b 0%, #fde047 50%, #ffffff 95%)',
                boxShadow: '0 0 15px #fef08a',
              }}
            />

            {/* White-Hot Luminous Center */}
            <div
              className="absolute bottom-2 w-3.5 h-7 rounded-full"
              style={{
                background: '#ffffff',
                boxShadow: '0 0 10px #ffffff, 0 0 18px #fef08a',
              }}
            />

            {/* Blue Indigo Flame Base */}
            <div
              className="absolute bottom-0 w-4 h-2.5 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.95) 0%, rgba(37, 99, 235, 0.7) 60%, transparent 100%)',
              }}
            />
          </div>

          {/* Baati (Cotton Wick) */}
          <div className="w-1.5 h-3 bg-gradient-to-t from-stone-900 to-amber-950 rounded-full -mt-1 shadow-sm" />
        </div>
      )}

      {/* 3. Intricately Crafted Diya Bowl (SVG) */}
      <div className="relative z-10 w-44 sm:w-52 h-24 filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]">
        <svg
          viewBox="0 0 220 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            {/* Clay / Terracotta Gradient */}
            <linearGradient id="clayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c2410c" />
              <stop offset="45%" stopColor="#9a3412" />
              <stop offset="85%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>

            {/* Royal Brass Gold Gradient */}
            <linearGradient id="brassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="20%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="80%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Oil / Ghee Surface Reflection */}
            <linearGradient id="oilGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="25%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>

            {/* Gold Rim Highlights */}
            <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="30%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Diya Shadow filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Diya Base Pedestal */}
          <path
            d="M85 86 C85 86, 95 95, 110 95 C125 95, 135 86, 135 86 L140 92 C140 92, 126 99, 110 99 C94 99, 80 92, 80 92 Z"
            fill={theme === 'terracotta' ? '#431407' : 'url(#brassGradient)'}
            opacity="0.9"
          />

          {/* Diya Main Body (Traditional Deep Indian Vessel) */}
          <path
            d="M20 38 C35 78, 75 92, 110 92 C145 92, 185 78, 200 38 C180 52, 140 58, 110 58 C80 58, 40 52, 20 38 Z"
            fill={theme === 'terracotta' ? 'url(#clayGradient)' : 'url(#brassGradient)'}
          />

          {/* Inner Lip / Oil Cavity */}
          <ellipse
            cx="110"
            cy="38"
            rx="90"
            ry="18"
            fill="url(#oilGradient)"
            stroke="url(#goldRim)"
            strokeWidth="2.5"
          />

          {/* Oil Surface Shimmer */}
          <ellipse
            cx="110"
            cy="40"
            rx="75"
            ry="12"
            fill="#78350f"
            opacity="0.8"
          />
          {isLit && (
            <ellipse
              cx="110"
              cy="39"
              rx="40"
              ry="7"
              fill="rgba(254, 240, 138, 0.45)"
              filter="url(#softGlow)"
            />
          )}

          {/* Traditional Engraved Rim Patterns & Beaded Brass Pearls */}
          <g stroke="url(#goldRim)" strokeWidth="1.4" opacity="0.85">
            <path d="M40 46 C50 54, 70 60, 110 60 C150 60, 170 54, 180 46" fill="none" />
            <path d="M50 56 C65 68, 85 74, 110 74 C135 74, 155 68, 170 56" fill="none" strokeWidth="1" />
          </g>

          {/* Decorative Floral Petal Motifs on Bowl */}
          <g fill={theme === 'terracotta' ? '#ea580c' : '#fef08a'} opacity="0.7">
            <circle cx="110" cy="70" r="3.5" />
            <circle cx="90" cy="67" r="3" />
            <circle cx="130" cy="67" r="3" />
            <circle cx="72" cy="62" r="2.5" />
            <circle cx="148" cy="62" r="2.5" />
            <circle cx="56" cy="54" r="2" />
            <circle cx="164" cy="54" r="2" />
          </g>

          {/* Spout / Baati Resting Nose Accent */}
          <path
            d="M106 36 C108 30, 112 30, 114 36 Z"
            fill="#1c1917"
          />
        </svg>
      </div>

      {/* 4. Floor Reflection / Warm Cast Shadow */}
      <div
        className="w-48 sm:w-60 h-6 -mt-3 rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: isLit
            ? 'radial-gradient(ellipse, rgba(245, 158, 11, 0.45) 0%, rgba(180, 83, 9, 0.2) 50%, transparent 80%)'
            : 'radial-gradient(ellipse, rgba(0, 0, 0, 0.8) 0%, transparent 70%)',
          filter: 'blur(5px)',
        }}
      />
    </motion.div>
  );
};
