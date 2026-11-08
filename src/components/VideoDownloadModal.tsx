import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Film, Download, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { GreetingData } from '../types';
import { DiwaliVideoRecorder } from '../utils/videoRecorder';

interface VideoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  greetingData: GreetingData;
  onTriggerCinematicRecording?: () => void;
}

export const VideoDownloadModal: React.FC<VideoDownloadModalProps> = ({
  isOpen,
  onClose,
  canvasRef,
  greetingData,
  onTriggerCinematicRecording,
}) => {
  const supportedFormats = DiwaliVideoRecorder.getSupportedFormats();
  const [selectedFormat, setSelectedFormat] = useState<'webm' | 'mp4'>(
    DiwaliVideoRecorder.isFormatSupported('mp4') ? 'mp4' : 'webm'
  );
  const [duration, setDuration] = useState<number>(10);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [downloadReady, setDownloadReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      setError('Visual canvas not found. Please refresh and try again.');
      return;
    }

    try {
      setIsRecording(true);
      setError(null);
      setProgress(0);
      setDownloadReady(false);
      setStatusMessage('Starting cinematic video capture...');

      if (onTriggerCinematicRecording) {
        onTriggerCinematicRecording();
      }

      const recorder = new DiwaliVideoRecorder();
      const blob = await recorder.recordCanvas(canvas, greetingData, {
        durationSeconds: duration,
        format: selectedFormat,
        fps: 30,
        onProgress: (p, msg) => {
          setProgress(p);
          setStatusMessage(msg);
        },
      });

      // Prepare clean safe filename (defense against path traversal, invalid characters, and empty names)
      const rawClean = (greetingData.senderName || 'Diya')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 32);
      const cleanSender = rawClean.replace(/^_+|_+$/g, '') || 'Diya';
      const safeFormat = selectedFormat === 'mp4' ? 'mp4' : 'webm';
      const filename = `Diwali_Greeting_From_${cleanSender}.${safeFormat}`;

      DiwaliVideoRecorder.downloadBlob(blob, filename);
      setDownloadReady(true);
      setIsRecording(false);
      setStatusMessage(`Downloaded successfully as ${filename}!`);
    } catch (err: unknown) {
      setIsRecording(false);
      setError((err as Error)?.message || 'Failed to record video on this device.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl luxury-glass gold-foil-border text-amber-100 shadow-2xl"
        >
          {/* Close button */}
          {!isRecording && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs tracking-wider uppercase font-sans mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic Video Export</span>
            </div>
            <h2 className="font-serif text-2xl font-bold gold-text-gradient">
              Download Diwali Video
            </h2>
            <p className="text-xs text-amber-200/70 font-sans mt-1">
              Capture your glowing diya, fireworks and festive blessings into a video you can save or share on social media.
            </p>
          </div>

          {/* Configuration */}
          {!isRecording && !downloadReady && (
            <div className="space-y-4">
              {/* Format Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-2">
                  Video Format
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('webm')}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      selectedFormat === 'webm'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-glow-sm'
                        : 'border-amber-500/20 bg-purple-950/20 text-amber-300/70 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="text-xs font-semibold font-serif">WebM Video</div>
                    <div className="text-[10px] text-amber-200/50">Universal HD standard</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (DiwaliVideoRecorder.isFormatSupported('mp4')) {
                        setSelectedFormat('mp4');
                      } else {
                        alert('MP4 direct encoding is not natively supported by this browser. WebM is recommended.');
                      }
                    }}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      selectedFormat === 'mp4'
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-glow-sm'
                        : supportedFormats.includes('mp4')
                        ? 'border-amber-500/20 bg-purple-950/20 text-amber-300/70'
                        : 'border-white/10 bg-black/20 text-stone-500 opacity-60'
                    }`}
                  >
                    <div className="text-xs font-semibold font-serif">MP4 Video</div>
                    <div className="text-[10px] text-amber-200/50">
                      {DiwaliVideoRecorder.isFormatSupported('mp4') ? 'Hardware supported' : 'Browser dependent'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-sans text-amber-300 font-semibold mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { sec: 10, label: '10 Seconds', desc: 'Quick festive burst' },
                    { sec: 16, label: '16 Seconds', desc: 'Full cinematic greeting' },
                  ].map((dur) => (
                    <button
                      key={dur.sec}
                      type="button"
                      onClick={() => setDuration(dur.sec)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all ${
                        duration === dur.sec
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-glow-sm'
                          : 'border-amber-500/20 bg-purple-950/20 text-amber-300/70'
                      }`}
                    >
                      <div className="text-xs font-semibold font-serif">{dur.label}</div>
                      <div className="text-[10px] text-amber-200/50">{dur.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleStartRecording}
                className="w-full mt-2 py-3 rounded-xl gold-foil-button text-stone-950 font-serif font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm"
              >
                <Download className="w-4 h-4 text-stone-950" />
                <span>Start Recording Video</span>
              </button>
            </div>
          )}

          {/* Recording in Progress */}
          {isRecording && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
                <Sparkles className="w-8 h-8 text-amber-400 animate-spin-very-slow" />
              </div>

              <div className="w-full bg-purple-950/60 rounded-full h-3 border border-amber-500/30 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div>
                <p className="font-serif text-lg font-bold text-amber-300">{progress}%</p>
                <p className="text-xs text-amber-200/80 font-sans mt-1">{statusMessage}</p>
              </div>

              <p className="text-[11px] text-amber-400/50 font-sans italic">
                Please keep this tab open while the cinematic frames are being captured.
              </p>
            </div>
          )}

          {/* Ready State */}
          {downloadReady && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
              <h3 className="font-serif text-xl font-bold gold-text-gradient">
                Greeting Video Downloaded!
              </h3>
              <p className="text-xs text-amber-200/80 font-sans">
                Your cinematic Diwali greeting video has been saved to your downloads. You can send it directly on WhatsApp, Instagram, or email.
              </p>

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={() => setDownloadReady(false)}
                  className="flex-1 py-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-amber-500/30 text-amber-200 text-xs font-sans"
                >
                  Record Another
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl gold-foil-button text-stone-950 font-serif font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
