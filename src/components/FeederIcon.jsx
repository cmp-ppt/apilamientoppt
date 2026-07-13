// Small schematic reclaim-feeder glyph: hopper funnel + roller, used wherever a feeder
// needs to read as physical equipment rather than a plain label or dot.
// Geometry is predictable from the outside: roller sits at y + bodyH + gap.
export function feederRollerY(y, size) {
  return y + size * 0.56 + size * 0.14;
}

export default function FeederIcon({ x = 0, y = 0, size = 24, color = '#3a4a60', running = false }) {
  const topW = size, botW = size * 0.32;
  const bodyH = size * 0.56;
  const rollerGap = size * 0.14;
  const rollerR = size * 0.13;
  const x0 = x - topW / 2, x1 = x + topW / 2;
  const xb0 = x - botW / 2, xb1 = x + botW / 2;
  const yTop = y, yBot = y + bodyH;
  const rollerY = yBot + rollerGap;

  return (
    <g>
      <path
        d={`M ${x0} ${yTop} L ${x1} ${yTop} L ${xb1} ${yBot} L ${xb0} ${yBot} Z`}
        fill="none"
        stroke={color}
        strokeWidth={Math.max(1.2, size * 0.08)}
        strokeLinejoin="round"
      />
      <circle cx={x} cy={rollerY} r={rollerR} fill={running ? color : 'none'} stroke={color} strokeWidth={Math.max(1, size * 0.07)} />
    </g>
  );
}
