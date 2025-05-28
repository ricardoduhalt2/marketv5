export interface Star {
  id: number;
  x: number;
  y: number;
  sizeClass: string;
  colorClass: string;
  shadowClass: string;
  animationDelay: string;
  animationDuration: string;
}

export interface ShootingStar {
  id: number;
  startX: string;
  startY: string;
  travelX: string;
  travelY: string;
  angle: string;
  animationDelay: string;
  animationDuration: string;
  headColorHex: string;
  tailColorHexFade: string;
  gradient: string;
}

export interface TerminalLine {
  id: number;
  text: string;
  colorClass: string;
  prefix?: string;
  prefixColorClass?: string;
}

export interface Spark {
  id: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity?: number;
  progress?: number;
}

export interface RingNode {
  id: string;
  angle: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  delay: number;
}

export interface RingSegment {
  id: string;
  angle: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  delay: number;
  hasGlitch: boolean;
  glitchColor1: string;
  glitchColor2: string;
}

export interface ShootingStar {
  id: number;
  startX: string;
  startY: string;
  travelX: string;
  travelY: string;
  angle: string;
  animationDelay: string;
  animationDuration: string;
  headColorHex: string;
  tailColorHexFade: string;
  gradient: string;
  progress?: number;
  duration?: number;
}
