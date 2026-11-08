import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SceneStep, GreetingData } from './types';
import { parseGreetingFromUrl, DEFAULT_GREETING, updateBrowserUrl } from './utils/urlParams';
import { audioService } from './utils/audio';
import { CinematicCanvas, CinematicCanvasHandle } from './components/CinematicCanvas';
import { RealisticDiya } from './components/RealisticDiya';
import { FloatingDiyas } from './components/FloatingDiyas';
import { SceneNarrative } from './components/SceneNarrative';
import { HeroSection } from './components/HeroSection';
import { ActionControls } from './components/ActionControls';
import { DevotionalDarshan } from './components/DevotionalDarshan';
import { PersonalizeModal } from './components/PersonalizeModal';
import { VideoDownloadModal } from './components/VideoDownloadModal';
import { CrackerControls } from './components/CrackerControls';
import { Toast, ToastData } from './components/Toast';

export const App: React.FC = () => {
  const [greetingData, setGreetingData] = useState<GreetingData>(DEFAULT_GREETING);
  const [currentScene, setCurrentScene] = useState<SceneStep>(0);
  const [isLit, setIsLit] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isDarshanOpen, setIsDarshanOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasHandleRef = useRef<CinematicCanvasHandle | null>(null);
  const timelineRef = useRef<number[]>([]);
  const toastTimerRef = useRef<number | null>(null);

  // Show Toast Helper
  const showToast = useCallback((title: string, message?: string, type: 'success' | 'share' = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({
      id: Date.now().toString(),
      title,
      message,
      type,
    });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2800);
  }, []);

  // Parse greeting from URL on mount
  useEffect(() => {
    const data = parseGreetingFromUrl();
    setGreetingData(data);
  }, []);

  // Clear any existing scene timeline timers
  const clearTimeline = useCallback(() => {
    timelineRef.current.forEach((id) => clearTimeout(id));
    timelineRef.current = [];
  }, []);

  // Run the 15-20 second cinematic choreography
  const startCinematicSequence = useCallback(() => {
    clearTimeline();
    setCurrentScene(1);
    setIsLit(true);

    // Audio cues
    audioService.playDiyaIgnition();
    audioService.startFestiveAmbience();

    // Scene 2: 4.0s (Lighting Diya, Petals drift, light expands)
    const t2 = window.setTimeout(() => {
      setCurrentScene(2);
      audioService.playTempleBell(587.33, 0);
    }, 4000);

    // Scene 3: 8.0s (Personal Greeting reveal)
    const t3 = window.setTimeout(() => {
      setCurrentScene(3);
      audioService.playTempleBell(739.99, 0);
    }, 8000);

    // Scene 4: 12.5s (Grand Diwali Reveal: Fireworks, Golden Title, Rangoli & Crackers)
    const t4 = window.setTimeout(() => {
      setCurrentScene(4);
      audioService.playFireworkBurst(0.5);
      canvasHandleRef.current?.triggerAnar();
      setTimeout(() => {
        canvasHandleRef.current?.triggerChakri();
      }, 1200);
    }, 12500);

    // Scene 5: 17.5s (Final Message & Celebration Card + Dock)
    const t5 = window.setTimeout(() => {
      setCurrentScene(5);
      audioService.playTempleBell(880, 0);
    }, 17500);

    timelineRef.current = [t2, t3, t4, t5];
  }, [clearTimeline]);

  // Handle first user gesture
  const handleStartExperience = () => {
    startCinematicSequence();
  };

  // Replay experience
  const handleReplay = () => {
    startCinematicSequence();
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioService.setMuted(next);
  };

  // Update greeting and preview
  const handleSaveAndPreview = (newData: GreetingData) => {
    setGreetingData(newData);
    updateBrowserUrl(newData);
    startCinematicSequence();
    showToast(
      'Diwali Greeting Updated! ✨',
      `Greeting customized from ${newData.senderName}`,
      'success'
    );
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearTimeline();
      audioService.stopFestiveAmbience();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [clearTimeline]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05010a] text-amber-100 flex flex-col items-center justify-center select-none touch-manipulation">
      {/* 1. Cinematic Multi-Layer Canvas (Stars, Particles, Petals, Fireworks, Anar, Chakri, Sparkler, Glow) */}
      <CinematicCanvas
        ref={canvasHandleRef}
        currentScene={currentScene}
        canvasRef={canvasRef}
      />

      {/* 2. Soft Cinematic Vignette */}
      <div className="absolute inset-0 cinematic-vignette pointer-events-none z-10" />

      {/* 3. Floating Peripheral Diyas (Scenes 2 - 5) */}
      <FloatingDiyas currentScene={currentScene} />

      {/* 3.5 Devotional Darshan of Lord Ganesha & Goddess Lakshmi (Scenes 1 to 5) */}
      <DevotionalDarshan
        currentScene={currentScene}
        isLit={isLit}
        isModalOpen={isDarshanOpen}
        onOpenModal={() => setIsDarshanOpen(true)}
        onCloseModal={() => setIsDarshanOpen(false)}
      />

      {/* 4. Central Heroic Diya */}
      {currentScene >= 1 && (
        <div className="absolute bottom-16 sm:bottom-20 inset-x-0 mx-auto flex items-center justify-center pointer-events-auto" style={{ zIndex: 20 }}>
          <RealisticDiya
            currentScene={currentScene}
            isLit={isLit}
            theme={greetingData.diyaTheme || 'royal-brass'}
            scale={1.15}
          />
        </div>
      )}

      {/* 5. Cinematic Text & Scene Narrative */}
      <SceneNarrative
        currentScene={currentScene}
        greetingData={greetingData}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
        onOpenDarshan={() => setIsDarshanOpen(true)}
      />

      {/* 6. Unforgettable Cinematic Hero Section */}
      {currentScene === 0 && (
        <HeroSection
          greetingData={greetingData}
          onStartExperience={handleStartExperience}
          onOpenPersonalize={() => setIsPersonalizeOpen(true)}
          onOpenDarshan={() => setIsDarshanOpen(true)}
          onQuickShare={() => setIsPersonalizeOpen(true)}
        />
      )}

      {/* 7. Interactive Cracker Controls (Anar, Chakri, Phooljhadi, Ladi, Rocket) */}
      <CrackerControls
        currentScene={currentScene}
        onTriggerAnar={() => canvasHandleRef.current?.triggerAnar()}
        onTriggerChakri={() => canvasHandleRef.current?.triggerChakri()}
        onTriggerLadi={() => canvasHandleRef.current?.triggerLadi()}
        onTriggerRocket={() => canvasHandleRef.current?.triggerRocket()}
        onToggleSparkler={() => canvasHandleRef.current?.toggleSparkler()}
      />

      {/* 8. Action Controls (Mute, Replay, Share, Video Download, Create Diya, Darshan) */}
      <ActionControls
        currentScene={currentScene}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReplay={handleReplay}
        onOpenPersonalize={() => setIsPersonalizeOpen(true)}
        onOpenVideoDownload={() => setIsVideoModalOpen(true)}
        onOpenDarshan={() => setIsDarshanOpen(true)}
        greetingData={greetingData}
        onShowToast={showToast}
      />

      {/* 9. Personalize & Share Dialog */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        currentData={greetingData}
        onSaveAndPreview={handleSaveAndPreview}
        onShowToast={showToast}
      />

      {/* 10. Video Recording & Download Dialog */}
      <VideoDownloadModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        canvasRef={canvasRef}
        greetingData={greetingData}
      />

      {/* 11. Instant Feedback Toast */}
      <Toast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </main>
  );
};

export default App;
