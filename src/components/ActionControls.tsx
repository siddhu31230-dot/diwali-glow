import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Film,
  Sparkles,
} from 'lucide-react';
import { GreetingData, SceneStep } from '../types';
import {
  generateGreetingUrl,
  copyToClipboard,
  openWhatsAppShare,
  shareGreetingNative,
} from '../utils/urlParams';

interface ActionControlsProps {
  currentScene: SceneStep;
  isMuted: boolean;
  onToggleMute: () => void;
  onReplay: () => void;
  onOpenPersonalize: () => void;
  onOpenVideoDownload: () => void;
  onOpenDarshan?: () => void;
  greetingData: GreetingData;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'share') => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  currentScene,
  isMuted,
  onToggleMute,
  onReplay,
  onOpenPersonalize,
  onOpenVideoDownload,
  onOpenDarshan,
  greetingData,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = generateGreetingUrl(greetingData);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      onShowToast?.(
        'Diwali Link Copied! 📋✨',
        'Ready to paste & share on WhatsApp, Instagram or Messages',
        'success'
      );
    } else {
      prompt('Copy your Diwali Greeting Link:', shareUrl);
    }
  };

  const handleWhatsAppShare = () => {
    openWhatsAppShare(greetingData, shareUrl);
    onShowToast?.(
      'Opening WhatsApp 💬',
      'Sending your personalized Diya greeting...',
      'share'
    );
  };

  const handleNativeShare = async () => {
    const result = await shareGreetingNative(greetingData, shareUrl);
    if (result === 'shared') {
      onShowToast?.(
        'Diwali Gift Shared! ✨',
        'Your sacred flame has been sent to your loved ones.',
        'share'
      );
    } else if (result === 'fallback_needed') {
      handleCopyLink();
    }
  };

  return (
    <>
      {/* Top Header Floating Controls (Persistent & Minimalist) */}
      <header className="fixed top-3 sm:top-6 inset-x-3 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-none pt-[env(safe-area-inset-top)]">
        {/* Subtle Brand Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentScene >= 1 ? 0.8 : 0 }}
          transition={{ duration: 1 }}
          className="flex items-center gap-2 pointer-events-auto"
        >
          <span className="font-serif text-amber-300 text-xs sm:text-sm tracking-widest uppercase font-medium flex items-center gap-1.5 drop-shadow-sm">
            <span>✨</span> Diwali Glow
          </span>
        </motion.div>

        {/* Top Right: Light Diya & Audio Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Devotional Darshan Button */}
          {onOpenDarshan && currentScene >= 1 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenDarshan}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full luxury-glass border border-amber-500/30 text-amber-200 text-xs font-sans font-medium flex items-center gap-1.5 hover:border-amber-400 hover:text-amber-100 shadow-glow-sm transition-all"
              title="Devotional Darshan of Lord Ganesha & Goddess Lakshmi"
            >
              <span>🪔</span>
              <span className="hidden xs:inline">पावन दर्शन</span>
              <span className="xs:hidden">दर्शन</span>
            </motion.button>
          )}

          {/* Share Diwali Glow Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWhatsAppShare}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-sans font-medium flex items-center gap-1.5 shadow-sm transition-all"
            title="Share Diwali Glow on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Share</span>
          </motion.button>

          {/* Light a Diya for someone button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenPersonalize}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full luxury-glass border border-amber-500/30 text-amber-200 text-xs font-sans font-medium flex items-center gap-1.5 hover:border-amber-400 hover:text-amber-100 shadow-glow-sm transition-all"
            title="Create and send your own personalized Diya"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Light for Someone</span>
            <span className="xs:hidden">Send Diya</span>
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMute}
            className="p-2 sm:p-2.5 rounded-full luxury-glass border border-amber-500/30 text-amber-300 hover:text-amber-100 hover:border-amber-400 shadow-glow-sm transition-all"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
          </motion.button>
        </div>
      </header>

      {/* Bottom Cinematic Control Dock (Fades in during Scene 4 & 5) */}
      <AnimatePresence>
        {currentScene >= 4 && (
          <motion.nav
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="fixed bottom-3 sm:bottom-6 inset-x-2 sm:inset-x-0 mx-auto max-w-fit z-30 pointer-events-auto pb-[env(safe-area-inset-bottom)]"
          >
            <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full luxury-glass gold-foil-border shadow-2xl backdrop-blur-xl">
              {/* Replay */}
              <button
                onClick={onReplay}
                className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-full bg-amber-500/10 hover:bg-amber-500/25 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all"
                title="Replay cinematic experience"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Replay</span>
              </button>

              <div className="h-5 w-px bg-amber-500/30 mx-0.5" />

              {/* One-click WhatsApp Share */}
              <button
                onClick={handleWhatsAppShare}
                className="px-3 sm:px-4 py-2 rounded-xl sm:rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-100 text-xs font-sans font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="One-click share on WhatsApp with prefilled greeting"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              {/* Copy Link with Instant Feedback */}
              <button
                onClick={handleCopyLink}
                className="px-2.5 sm:px-3.5 py-2 rounded-xl sm:rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95"
                title="Copy personalized greeting link"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span className="hidden xs:inline">Copy Link</span>
                  </>
                )}
              </button>

              {/* Native Web Share for iOS & Android */}
              <button
                onClick={handleNativeShare}
                className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-full bg-purple-900/30 hover:bg-purple-900/50 text-amber-200 text-xs font-sans flex items-center gap-1.5 transition-all active:scale-95"
                title="Share via other mobile apps (iOS & Android native share sheet)"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <div className="h-5 w-px bg-amber-500/30 mx-0.5" />

              {/* Download Video */}
              <button
                onClick={onOpenVideoDownload}
                className="px-3 sm:px-4 py-2 rounded-xl sm:rounded-full gold-foil-button text-stone-950 font-serif font-bold text-xs flex items-center gap-1.5 shadow-glow-sm hover:scale-105 transition-all active:scale-95"
                title="Record & download as high-definition video"
              >
                <Film className="w-3.5 h-3.5 text-stone-950" />
                <span>Download Video</span>
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};
