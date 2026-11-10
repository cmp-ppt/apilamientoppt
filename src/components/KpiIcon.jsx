// Minimal line-icon set (20x20, stroke=currentColor) matching FeederIcon's
// stripped-down schematic style. One icon per KPI card / equipment toggle,
// picked so the badge reads at a glance — never as decoration alone.
const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

function Svg({ children, size = 20 }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} {...common}>
      {children}
    </svg>
  );
}

function Stockpile({ size }) {
  return (
    <Svg size={size}>
      <path d="M5 16.5 L5 7.2 C5 4.5 15 4.5 15 7.2 L15 16.5" />
      <path d="M5 7.2 C5 9.9 15 9.9 15 7.2" />
      <line x1="3.3" y1="16.5" x2="16.7" y2="16.5" />
    </Svg>
  );
}

function Feeder({ size }) {
  return (
    <Svg size={size}>
      <path d="M4 4 L16 4 L12 11 L8 11 Z" />
      <circle cx="10" cy="14.5" r="2.1" />
      <line x1="2" y1="17" x2="18" y2="17" />
    </Svg>
  );
}

function Droplet({ size }) {
  return (
    <Svg size={size}>
      <path d="M10 2.5 C10 2.5, 15.5 9.3, 15.5 13 C15.5 16 13 17.8 10 17.8 C7 17.8 4.5 16 4.5 13 C4.5 9.3, 10 2.5, 10 2.5 Z" />
    </Svg>
  );
}

function OreIngot({ size }) {
  return (
    <Svg size={size}>
      <path d="M4 13.5 L5.5 6.5 L14.5 6.5 L16 13.5 Z" />
      <line x1="5" y1="10" x2="15" y2="10" />
    </Svg>
  );
}

function Flask({ size }) {
  return (
    <Svg size={size}>
      <path d="M8 3 L8 8 L4.3 15.5 C3.8 16.6 4.6 17.8 5.8 17.8 L14.2 17.8 C15.4 17.8 16.2 16.6 15.7 15.5 L12 8 L12 3" />
      <line x1="7" y1="3" x2="13" y2="3" />
      <line x1="6.3" y1="12.5" x2="13.7" y2="12.5" />
    </Svg>
  );
}

function Crystal({ size }) {
  return (
    <Svg size={size}>
      <path d="M6.5 4 L13.5 4 L17 8.5 L10 17 L3 8.5 Z" />
      <line x1="3" y1="8.5" x2="17" y2="8.5" />
      <line x1="6.5" y1="4" x2="10" y2="8.5" />
      <line x1="13.5" y1="4" x2="10" y2="8.5" />
    </Svg>
  );
}

function Warning({ size }) {
  return (
    <Svg size={size}>
      <path d="M10 3 L18 17 L2 17 Z" />
      <line x1="10" y1="8" x2="10" y2="12" />
      <circle cx="10" cy="14.4" r="0.15" fill="currentColor" stroke="none" />
    </Svg>
  );
}

function Ship({ size }) {
  return (
    <Svg size={size}>
      <path d="M3 12 L17 12 L15 16.5 L5 16.5 Z" />
      <line x1="10" y1="12" x2="10" y2="3" />
      <path d="M10 3 L14.5 7 L10 10 Z" />
    </Svg>
  );
}

function Bulldozer({ size }) {
  return (
    <Svg size={size}>
      <path d="M3 11 L3 7 L5 7 L5 11" />
      <path d="M5 8 L13 8 L13 12 L5 12 Z" />
      <rect x="13" y="9" width="2.2" height="3" />
      <circle cx="6.5" cy="15" r="2" />
      <circle cx="11.5" cy="15" r="2" />
      <line x1="2" y1="15" x2="2" y2="11" />
    </Svg>
  );
}

function Excavator({ size }) {
  return (
    <Svg size={size}>
      <rect x="4" y="9" width="7" height="4.5" rx="0.6" />
      <path d="M8 9 L14 4.5 L17.5 6 L13 10" />
      <path d="M13 10 L15.5 12.5 L12.5 13.5 L11.5 11" />
      <rect x="2" y="13.5" width="13" height="2.2" rx="1" />
    </Svg>
  );
}

const ICONS = {
  stockpile: Stockpile,
  feeder: Feeder,
  droplet: Droplet,
  ore: OreIngot,
  flask: Flask,
  crystal: Crystal,
  warning: Warning,
  ship: Ship,
  bulldozer: Bulldozer,
  excavator: Excavator,
};

export default function KpiIcon({ name, size = 20 }) {
  const C = ICONS[name];
  if (!C) return null;
  return <C size={size} />;
}
