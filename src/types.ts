export interface GreetingData {
  senderName: string;
  receiverName?: string;
  customMessage?: string;
  diyaTheme?: 'classic' | 'royal-brass' | 'terracotta';
}

export type SceneStep = 0 | 1 | 2 | 3 | 4 | 5;

export interface AudioSettings {
  muted: boolean;
  isPlaying: boolean;
}

export interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  decay: number;
  life: number;
}

export interface MarigoldPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  swingAngle: number;
  swingSpeed: number;
  swingRadius: number;
  color: string;
  opacity: number;
  aspectRatio: number;
}

export interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  trail: { x: number; y: number }[];
  size: number;
  gravity: number;
  flicker: boolean;
}

export interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
  exploded: boolean;
}

// Crackers System Types
export type CrackerKind = 'anar' | 'chakri' | 'sparkler' | 'ladi' | 'rocket';

export interface FountainParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
  gravity: number;
  branch?: boolean;
}

export interface ChakriParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
}

export interface SparklerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  decay: number;
  branchAngle: number;
  hasBranched: boolean;
}

export interface GroundCrackerItem {
  id: string;
  type: 'anar' | 'chakri';
  x: number; // percentage of width (0 - 1)
  y: number; // percentage of height (0 - 1)
  isActive: boolean;
  remainingMs: number;
  angle?: number;
}
