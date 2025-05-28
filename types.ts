export interface Star {
  id: number;
  x: number;
  y: number;
  sizeClass: string;
  colorClass: string; // Tailwind bg class
  shadowClass: string; // Tailwind shadow class
  animationDelay: string;
  animationDuration: string;
}

export interface ShootingStar {
  id: number;
  startX: string; // Start position X (vw/vh)
  startY: string; // Start position Y (vw/vh)
  travelX: string; // Total travel distance X (vw/vh)
  travelY: string; // Total travel distance Y (vw/vh)
  angle: string;   // Angle of travel (deg)
  animationDelay: string;
  animationDuration: string;
  headColorHex: string; // Hex color for the bright head
  tailColorHexFade: string; // Transparent version of head color for tail fade
  gradient: string; // Full background gradient string
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
  x: number; // offset from center
  y: number; // offset from center
  dx: number; // trajectory
  dy: number; // trajectory
  size: number;
  duration: number;
  delay: number;
  color: string; // Tailwind color class
}
