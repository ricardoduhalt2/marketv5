export const INITIAL_TERMINAL_LINES = [
  { id: 1, text: "Booting system...", colorClass: "text-blue-400" },
  { id: 2, text: "Loading components...", colorClass: "text-yellow-400" },
  { id: 3, text: "Initializing UI...", colorClass: "text-green-400" },
];

export const DEPENDENCIES_TO_INSTALL = [
  { name: "Web3.js", detail: "Ethereum JavaScript API", time: 1500 },
  { name: "IPFS", detail: "Decentralized storage", time: 2000 },
  { name: "OpenZeppelin", detail: "Smart contract library", time: 1800 },
];

export const FINAL_MESSAGES = [
  { text: "System ready!", colorClass: "text-green-400" },
  { text: "Launching application...", colorClass: "text-purple-400" },
];

export const STAR_VISUALS = [
  { bg: "bg-white", shadow: "shadow-white", hex: "#ffffff", tailFade: "rgba(255,255,255,0.1)" },
  { bg: "bg-blue-200", shadow: "shadow-blue-200", hex: "#bfdbfe", tailFade: "rgba(191, 219, 254, 0.1)" },
  { bg: "bg-yellow-100", shadow: "shadow-yellow-100", hex: "#fef3c7", tailFade: "rgba(254, 243, 199, 0.1)" },
  { bg: "bg-purple-100", shadow: "shadow-purple-100", hex: "#f3e8ff", tailFade: "rgba(243, 232, 255, 0.1)" },
];

export const STAR_SIZES = ["w-0.5 h-0.5", "w-1 h-1", "w-1.5 h-1.5", "w-2 h-2"];
