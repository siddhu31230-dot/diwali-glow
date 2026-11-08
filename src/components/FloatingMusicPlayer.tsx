import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { audioService } from '../utils/audio';

interface FloatingMusicPlayerProps {
  onShowToast?: (title: string, message?: string, type?: 'success' | 'share') => void;
}

export const FloatingMusicPlayer: React.FC<FloatingMusicPlayerProps> = ({ onShowToast }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => audioService.getIsMusicPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(() => audioService.getIsMuted());

  useEffect(() => {
    const unsubscribe = audioService.subscribe((state) => {
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      audioService.pauseMusic();
      onShowToast?.('Music Paused ⏸️', 'Devotional instrumental paused', 'share');
    } else {
      const started = await audioService.playMusic();
      if (started) {
        onShowToast?.(
          'Devotional Flute & Sitar 🎶',
          'Soft bansuri, sitar, tabla & temple bells playing',
          'success'
        );
      }
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = audioService.toggleMute();
    onShowToast?.(
      nextMuted ? 'Audio Muted 🔇' : 'Audio Unmuted 🔊',
      nextMuted ? 'Sound effects and music muted' : 'Festive sound enabled',
      'share'
    );
  };

  const isAnimated = isPlaying && !isMuted;

  return (
    <motion.aside
      aria-label="Diwali Music Player"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="fixed top-3 sm:top-5 left-3 sm:left-6 z-50 flex items-center pointer-events-auto select-none pt-[env(safe-area-inset-top)]"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full luxury-glass gold-foil-border shadow-xl backdrop-blur-xl border border-amber-400/35 transition-all hover:border-amber-300">
        {/* Animated Equalizer Waveform / Music Icon */}
        <div
          className="flex items-end justify-center gap-0.5 h-4 w-4.5 cursor-pointer"
          onClick={handleTogglePlay}
          title={isPlaying ? 'Pause Devotional Music' : 'Play Devotional Music'}
        >
          <span
            className={`w-[2.5px] rounded-full bg-amber-400 transition-all ${
              isAnimated ? 'animate-eq-1' : 'h-1.5 opacity-60'
            }`}
          />
          <span
            className={`w-[2.5px] rounded-full bg-amber-300 transition-all ${
              isAnimated ? 'animate-eq-2' : 'h-2.5 opacity-60'
            }`}
          />
          <span
            className={`w-[2.5px] rounded-full bg-amber-400 transition-all ${
              isAnimated ? 'animate-eq-3' : 'h-1.5 opacity-60'
            }`}
          />
          <span
            className={`w-[2.5px] rounded-full bg-amber-200 transition-all ${
              isAnimated ? 'animate-eq-4' : 'h-2 opacity-60'
            }`}
          />
        </div>

        {/* Track Title & Details (Responsive) */}
        <div
          className="hidden md:flex flex-col text-left leading-tight cursor-pointer"
          onClick={handleTogglePlay}
          title="Diwali Devotional Instrumental (Bansuri, Sitar, Tabla & Temple Bells)"
        >
          <span className="text-[11px] font-serif font-semibold text-amber-200 tracking-wide flex items-center gap-1">
            <Music className="w-3 h-3 text-amber-400" />
            <span>Devotional BGM</span>
          </span>
          <span className="text-[9px] font-sans text-amber-300/60 tracking-wider">
            {isPlaying ? (isMuted ? 'Muted' : 'Playing') : 'Paused'}
          </span>
        </div>

        <div className="h-4 w-px bg-amber-400/30 mx-0.5" />

        {/* Play / Pause Toggle Button */}
        <button
          onClick={handleTogglePlay}
          className="p-1 sm:p-1.5 rounded-full hover:bg-amber-400/20 text-amber-200 hover:text-amber-100 transition-colors active:scale-90"
          title={isPlaying ? 'Pause Music' : 'Play Devotional Instrumental'}
          aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
          ) : (
            <Play className="w-3.5 h-3.5 text-amber-300 fill-amber-300 ml-0.5" />
          )}
        </button>

        {/* Mute / Unmute Button */}
        <button
          onClick={handleToggleMute}
          className={`p-1 sm:p-1.5 rounded-full transition-colors active:scale-90 ${
            isMuted
              ? 'text-amber-400/60 hover:bg-amber-400/15 hover:text-amber-300'
              : 'text-amber-200 hover:bg-amber-400/20 hover:text-amber-100'
          }`}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-amber-400/70" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
          )}
        </button>
      </div>
    </motion.aside>
  );
};
