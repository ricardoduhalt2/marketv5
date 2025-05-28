import { TerminalLine } from './types';

export const INITIAL_TERMINAL_LINES: Omit<TerminalLine, 'id'>[] = [
  { text: "Booting AEGIS System Kernel...", colorClass: "text-slate-400" },
  { text: "Initializing Quantum Entanglement Subroutines...", colorClass: "text-slate-400" },
  { text: "Accessing Celestial Data Network...", colorClass: "text-slate-400" },
  { text: "Preparing NFT Boutique Marketplace Interface v3.0...", colorClass: "text-purple-400 font-bold" },
  { text: "Loading Arte Eterno Collection - MACQ...", colorClass: "text-cyan-300 font-bold" },
  { text: "", colorClass: ""}, // Spacer
  { text: "Begin dependency integrity scan:", colorClass: "text-slate-300" }
];

export const DEPENDENCIES_TO_INSTALL: { name: string, time: number, detail?: string }[] = [
  { name: "ChronoWeave.dll", time: 1500, detail: "Synchronizing temporal flux matrix..." },
  { name: "QuantumCore.lib", time: 2000, detail: "Calibrating qubit states..." },
  { name: "AetherStream.io", time: 1800, detail: "Establishing hyper-conduit link..." },
  { name: "StardustFX.render", time: 2500, detail: "Compiling cosmic particle shaders..." },
  { name: "NeuralNet_MACQ.ai", time: 2200, detail: "Integrating AI art curator module..." },
  { name: "SecureVault.auth", time: 1000, detail: "Encrypting transaction layer..." },
  { name: "MarketplaceUI.shell", time: 1700, detail: "Rendering holographic interface..." },
];

export const FINAL_MESSAGES: Omit<TerminalLine, 'id'>[] = [
    { text: "", colorClass: ""}, // Spacer
    { text: "All systems nominal. Welcome, Curator.", colorClass: "text-green-400 font-bold" },
    { text: "Portal sequence initiated. Stand by for immersion...", colorClass: "text-amber-400" },
];

export const STAR_VISUALS: { name: string; bg: string; shadow: string; hex: string; tailFade: string }[] = [
  { name: 'cyan', bg: 'bg-cyan-400', shadow: 'shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]', hex: '#22d3ee', tailFade: 'rgba(34,211,238,0)' },
  { name: 'pink', bg: 'bg-pink-400', shadow: 'shadow-[0_0_8px_2px_rgba(244,114,182,0.7)]', hex: '#f472b6', tailFade: 'rgba(244,114,182,0)' },
  { name: 'purple', bg: 'bg-purple-400', shadow: 'shadow-[0_0_8px_2px_rgba(192,132,252,0.7)]', hex: '#c084fc', tailFade: 'rgba(192,132,252,0)' },
  { name: 'yellow', bg: 'bg-yellow-300', shadow: 'shadow-[0_0_8px_2px_rgba(250,204,21,0.7)]', hex: '#facc15', tailFade: 'rgba(250,204,21,0)' },
  { name: 'white', bg: 'bg-white', shadow: 'shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]', hex: '#ffffff', tailFade: 'rgba(255,255,255,0)' },
  { name: 'blue', bg: 'bg-blue-400', shadow: 'shadow-[0_0_8px_2px_rgba(96,165,250,0.7)]', hex: '#60a5fa', tailFade: 'rgba(96,165,250,0)' },
  { name: 'red', bg: 'bg-red-400', shadow: 'shadow-[0_0_8px_2px_rgba(248,113,113,0.7)]', hex: '#f87171', tailFade: 'rgba(248,113,113,0)' },
];

export const STAR_SIZES = ["w-0.5 h-0.5", "w-1 h-1", "w-[1.5px] h-[1.5px]"];
