import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, MessageCircle, Share2, Sparkles, Wand2 } from 'lucide-react';
import { GreetingData } from '../types';
import {
  generateGreetingUrl,
  copyToClipboard,
  openWhatsAppShare,
  shareGreetingNative,
} from '../utils/urlParams';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: GreetingData;
  onSaveAndPreview: (newData: GreetingData) => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'share') => void;
}

const MESSAGE_PRESETS = [
  'May your life shine with happiness, prosperity, peace and endless possibilities.',
  'Wishing you and your family a season as radiant, blessed and joyous as a thousand diyas.',
  'May divine light illuminate your path and bring boundless health, wealth and laughter.',
  'May this Diwali celebrate the victory of light, love, hope and new beginnings in your home.',
];

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onSaveAndPreview,
  onShowToast,
}) => {
  const [senderName, setSenderName] = useState(currentData.senderName);
  const [receiverName, setReceiverName] = useState(currentData.receiverName || '');
  const [customMessage, setCustomMessage] = useState(currentData.customMessage || MESSAGE_PRESETS[0]);
  const [diyaTheme, setDiyaTheme] = useState<'classic' | 'royal-brass' | 'terracotta'>(
    currentData.diyaTheme || 'royal-brass'
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const previewData: GreetingData = {
    senderName: senderName.trim() || 'Someone special',
    receiverName: receiverName.trim(),
    customMessage: customMessage.trim(),
    diyaTheme,
  };

  const shareUrl = generateGreetingUrl(previewData);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
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
    openWhatsAppShare(previewData, shareUrl);
    onShowToast?.(
      'Opening WhatsApp 💬',
      'Sending your personalized Diya greeting...',
      'share'
    );
  };

  const handleNativeShare = async () => {
    const res = await shareGreetingNative(previewData, shareUrl);
    if (res === 'shared') {
      onShowToast?.(
        'Diwali Gift Shared! ✨',
        'Your sacred flame has been sent.',
        'share'
      );
    } else if (res === 'fallback_needed') {
      handleCopyLink();
    }
  };

  const handleApplyAndWatch = () => {
    onSaveAndPreview(previewData);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg my-auto p-5 sm:p-8 rounded-3xl luxury-glass gold-foil-border text-amber-100 shadow-2xl max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs tracking-wider uppercase font-sans mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalize Your Diya</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-text-gradient">
              Send a Digital Diya
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 font-sans mt-1">
              Create a personalized cinematic greeting for family, friends & loved ones.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-left">
            {/* Sender Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-1.5">
                Your Name / Family Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Krishna & Ishwar, The Kapoors"
                className="w-full px-4 py-2.5 rounded-xl bg-purple-950/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-sans"
              />
            </div>

            {/* Receiver Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-1.5">
                Recipient's Name <span className="text-amber-200/50 lowercase font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="e.g. Priya, Rohit, Grandparents"
                className="w-full px-4 py-2.5 rounded-xl bg-purple-950/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-sans"
              />
            </div>

            {/* Diya Theme */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-2">
                Diya Finish
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'royal-brass' as const, label: 'Royal Brass 🪔', desc: 'Golden & Regal' },
                  { id: 'classic' as const, label: 'Classic Gold ✨', desc: 'Radiant Luster' },
                  { id: 'terracotta' as const, label: 'Terracotta 🏺', desc: 'Sacred Clay' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setDiyaTheme(th.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      diyaTheme === th.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-glow-sm'
                        : 'border-amber-500/20 bg-purple-950/20 text-amber-300/70 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="text-xs font-semibold font-serif">{th.label}</div>
                    <div className="text-[10px] text-amber-200/50 mt-0.5">{th.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message with Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold">
                  Personal Blessing
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = MESSAGE_PRESETS[(MESSAGE_PRESETS.indexOf(customMessage) + 1) % MESSAGE_PRESETS.length];
                    setCustomMessage(next);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-sans"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Cycle Wishes</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your heartfelt Diwali blessing..."
                className="w-full px-4 py-2.5 rounded-xl bg-purple-950/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-sans resize-none"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-amber-500/20 flex flex-col gap-3">
            <button
              onClick={handleApplyAndWatch}
              className="w-full py-3 rounded-xl gold-foil-button text-stone-950 font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-glow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Preview & Experience Now</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-sans font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-sans font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleNativeShare}
              className="py-2 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-amber-500/20 text-amber-300 text-xs font-sans flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via Other Apps (iOS & Android)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
