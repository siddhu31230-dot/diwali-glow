import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Copy,
  Check,
  MessageCircle,
  Share2,
  Sparkles,
  Wand2,
  Download,
  Eye,
  Heart,
} from 'lucide-react';
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
  'May Lord Ganesha remove every obstacle and Goddess Lakshmi bless your home with happiness and peace.',
  'श्री गणेश और माता लक्ष्मी आपके जीवन को सुख, समृद्धि, वैभव और शांति से परिपूर्ण करें।',
  'दीपों का यह पावन पर्व आपके घर-आँगन में नई खुशियाँ, उमंग और प्रेम की अनन्त रौशनी लाए।',
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
  const [customMessage, setCustomMessage] = useState(
    currentData.customMessage || MESSAGE_PRESETS[0]
  );
  const [diyaTheme, setDiyaTheme] = useState<'classic' | 'royal-brass' | 'terracotta'>(
    currentData.diyaTheme || 'royal-brass'
  );
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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
      setTimeout(() => setCopied(false), 2400);
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

  // Generate and Download High-Resolution Greeting Card Image (1080x1080)
  const handleDownloadCardImage = async () => {
    setIsGeneratingImage(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // 1. Background gradient (Midnight Purple & Royal Navy)
      const bg = ctx.createRadialGradient(540, 540, 60, 540, 540, 760);
      bg.addColorStop(0, '#2d0a4e');
      bg.addColorStop(0.45, '#150328');
      bg.addColorStop(0.85, '#090114');
      bg.addColorStop(1, '#040008');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1080, 1080);

      // 2. Decorative Stars
      ctx.fillStyle = 'rgba(254, 240, 138, 0.45)';
      for (let i = 0; i < 60; i++) {
        const sx = (i * 179 + 45) % 1080;
        const sy = (i * 283 + 92) % 1080;
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3 === 0 ? 2 : 1.2), 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Indian Ornate Border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1000);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(55, 55, 970, 970);
      ctx.setLineDash([]);

      // Corner Flourishes
      ctx.fillStyle = '#fbbf24';
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✧', 75, 80);
      ctx.fillText('✧', 1005, 80);
      ctx.fillText('✧', 75, 1010);
      ctx.fillText('✧', 1005, 1010);

      // 4. Vedic Header
      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 24px sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('॥ श्री गणेशाय नमः • ॐ महालक्ष्म्यै नमः ॥', 540, 140);

      // 5. Main Title: शुभ दीपावली
      ctx.fillStyle = '#fffbeb';
      ctx.font = 'bold 72px serif';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
      ctx.shadowBlur = 25;
      ctx.fillText('✨ शुभ दीपावली ✨', 540, 245);
      ctx.shadowBlur = 0;

      // Subtitle
      ctx.fillStyle = '#fde68a';
      ctx.font = 'italic 500 26px serif';
      ctx.fillText('Festival of Light, Love & Prosperity', 540, 295);

      // Divider line
      const divGrad = ctx.createLinearGradient(300, 0, 780, 0);
      divGrad.addColorStop(0, 'transparent');
      divGrad.addColorStop(0.5, '#f59e0b');
      divGrad.addColorStop(1, 'transparent');
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(340, 330);
      ctx.lineTo(740, 330);
      ctx.stroke();

      // 6. Recipient Attribution
      if (previewData.receiverName) {
        ctx.fillStyle = '#fcd34d';
        ctx.font = 'italic 32px serif';
        ctx.fillText(`To Dearest ${previewData.receiverName}`, 540, 395);
      }

      // 7. Sender Attribution
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px serif';
      ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
      ctx.shadowBlur = 15;
      ctx.fillText(`${previewData.senderName}`, 540, 465);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fef08a';
      ctx.font = '300 24px sans-serif';
      ctx.fillText('has lit a sacred Diwali Diya for you 🪔', 540, 508);

      // 8. Diya Graphic in Center
      const diyaY = 640;
      // Ambient glow
      const halo = ctx.createRadialGradient(540, diyaY - 20, 10, 540, diyaY - 20, 140);
      halo.addColorStop(0, 'rgba(254, 215, 170, 0.8)');
      halo.addColorStop(0.4, 'rgba(245, 158, 11, 0.4)');
      halo.addColorStop(1, 'transparent');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(540, diyaY - 20, 140, 0, Math.PI * 2);
      ctx.fill();

      // Flame
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(540, diyaY - 70);
      ctx.bezierCurveTo(560, diyaY - 40, 555, diyaY - 15, 540, diyaY - 15);
      ctx.bezierCurveTo(525, diyaY - 15, 520, diyaY - 40, 540, diyaY - 70);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(540, diyaY - 50);
      ctx.bezierCurveTo(550, diyaY - 32, 548, diyaY - 15, 540, diyaY - 15);
      ctx.bezierCurveTo(532, diyaY - 15, 530, diyaY - 32, 540, diyaY - 50);
      ctx.fill();

      // Diya Bowl
      ctx.fillStyle = previewData.diyaTheme === 'terracotta' ? '#9a3412' : '#ca8a04';
      ctx.beginPath();
      ctx.ellipse(540, diyaY + 10, 85, 25, 0, 0, Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 9. Personal Blessing Message
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.font = 'italic 28px serif';
      const words = (previewData.customMessage || '').split(' ');
      let line = '';
      let msgY = 760;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 820 && n > 0) {
          ctx.fillText(`"${line.trim()}"`, 540, msgY);
          line = words[n] + ' ';
          msgY += 40;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim() ? `"${line.trim()}"` : '', 540, msgY);

      // 10. Footer URL Branding
      ctx.fillStyle = 'rgba(251, 191, 36, 0.6)';
      ctx.font = '18px sans-serif';
      ctx.fillText('✨ Experience the cinematic light at diwali-glow-iugl.vercel.app', 540, 990);

      // Trigger Browser Download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      const safeName = (previewData.senderName || 'diwali').replace(/[^a-zA-Z0-9]/g, '_');
      downloadLink.download = `Diwali_Greeting_${safeName}.png`;
      downloadLink.href = dataUrl;
      downloadLink.click();

      onShowToast?.(
        'Greeting Card Image Downloaded! 🖼️✨',
        'Ready to share on WhatsApp Status or Instagram Stories',
        'success'
      );
    } catch {
      onShowToast?.('Download failed', 'Please try copying the link instead', 'share');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-xl my-auto p-5 sm:p-7 rounded-3xl luxury-glass gold-foil-border text-amber-100 shadow-2xl max-h-[92vh] overflow-y-auto"
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
          <div className="text-center mb-4 sm:mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs tracking-wider uppercase font-sans mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Greeting Creator</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-text-gradient">
              Send Your Diwali Wish
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 font-sans mt-0.5">
              Customize names, blessings & generate instant shareable greeting links or images.
            </p>
          </div>

          {/* LIVE GREETING CARD PREVIEW */}
          <div className="mb-5 p-4 rounded-2xl bg-gradient-to-b from-purple-950/70 via-stone-950/80 to-purple-950/80 border border-amber-400/35 relative overflow-hidden shadow-inner text-center">
            <div className="flex items-center justify-between text-[11px] font-sans text-amber-300/80 mb-2 border-b border-amber-500/20 pb-1.5">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Card Preview</span>
              </span>
              <span className="text-amber-400 font-serif italic text-xs">✨ शुभ दीपावली ✨</span>
            </div>

            {previewData.receiverName && (
              <p className="text-xs text-amber-300 font-serif italic tracking-wide">
                To Dearest {previewData.receiverName}
              </p>
            )}

            <div className="my-1.5">
              <h3 className="font-serif text-lg sm:text-xl font-bold gold-text-gradient">
                {previewData.senderName}
              </h3>
              <p className="text-xs text-amber-100/90 font-light font-sans">
                lit a sacred Diwali Diya for you 🪔
              </p>
            </div>

            <p className="font-serif text-xs sm:text-sm text-amber-200/90 italic line-clamp-2 px-2 my-1">
              "{previewData.customMessage}"
            </p>

            <div className="flex items-center justify-center gap-2 text-[10px] text-amber-400/60 font-sans mt-2">
              <span>Theme: {previewData.diyaTheme}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-amber-400 inline" /> With Love & Blessings
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5 text-left">
            {/* Sender Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-1">
                Your Name / Family Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Krishna & Ishwar, The Kapoors"
                className="w-full px-3.5 py-2 rounded-xl bg-purple-950/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-sans"
              />
            </div>

            {/* Receiver Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-1">
                Recipient's Name <span className="text-amber-200/50 lowercase font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="e.g. Priya, Rahul, Mom & Dad"
                className="w-full px-3.5 py-2 rounded-xl bg-purple-950/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-sans"
              />
            </div>

            {/* Diya Theme Finish */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-1.5">
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
                    className={`p-2 rounded-xl border text-center transition-all ${
                      diyaTheme === th.id
                        ? 'border-amber-400 bg-amber-500/25 text-amber-200 shadow-glow-sm'
                        : 'border-amber-500/20 bg-purple-950/20 text-amber-300/70 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="text-xs font-semibold font-serif">{th.label}</div>
                    <div className="text-[10px] text-amber-200/50">{th.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message with Presets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold">
                  Personal Blessing Message
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next =
                      MESSAGE_PRESETS[(MESSAGE_PRESETS.indexOf(customMessage) + 1) % MESSAGE_PRESETS.length];
                    setCustomMessage(next);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-sans"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Cycle Wishes</span>
                </button>
              </div>

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {MESSAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomMessage(preset)}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                      customMessage === preset
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-medium'
                        : 'bg-purple-950/30 border-amber-500/20 text-amber-200/60 hover:text-amber-200'
                    }`}
                  >
                    {idx === 0
                      ? 'Prosperity & Peace'
                      : idx === 1
                      ? 'Radiant Diyas'
                      : idx === 2
                      ? 'Lakshmi-Ganesha Blessings'
                      : idx === 3
                      ? 'सुख-समृद्धि'
                      : 'खुशियाँ व प्रेम'}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Write your heartfelt Diwali blessing..."
                className="w-full px-3.5 py-2 rounded-xl bg-purple-950/40 border border-amber-500/30 text-amber-100 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-sans resize-none"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-4 border-t border-amber-500/20 flex flex-col gap-2.5">
            {/* Primary: Experience Now */}
            <button
              onClick={handleApplyAndWatch}
              className="w-full py-3 rounded-xl gold-foil-button text-stone-950 font-serif font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-glow-sm active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Experience My Greeting Now</span>
            </button>

            {/* Sharing Grid: WhatsApp, Copy Link, Download Image */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleWhatsAppShare}
                className="py-2.5 px-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-200 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                title="Send via WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2.5 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                title="Copy shareable link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadCardImage}
                disabled={isGeneratingImage}
                className="py-2.5 px-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/35 border border-amber-300/40 text-amber-100 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-95 disabled:opacity-50"
                title="Download greeting card as image"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>{isGeneratingImage ? 'Saving...' : 'Card Image'}</span>
              </button>
            </div>

            <button
              onClick={handleNativeShare}
              className="py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-amber-500/20 text-amber-300 text-xs font-sans flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share via Other Apps (Instagram, Messages, Telegram)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
