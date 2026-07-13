import { shade } from '../utils/color';
import FeederIcon, { feederRollerY } from './FeederIcon';

// Renders a row of ore-stockpile silhouettes for the reference day — one mound per feeder
// sitting above a schematic reclaim feeder (hopper + roller) on a shared conveyor line,
// height scaled by tonnage capacity, color/gradient encoding material state.
function moundPath(cx, baseY, topY, halfWidth) {
  const x0 = cx - halfWidth, x1 = cx + halfWidth;
  const shoulderY = baseY - (baseY - topY) * 0.18;
  return `M ${x0} ${baseY}
    C ${x0 + halfWidth * 0.1} ${shoulderY}, ${cx - halfWidth * 0.4} ${topY + 5}, ${cx} ${topY}
    C ${cx + halfWidth * 0.4} ${topY + 5}, ${x1 - halfWidth * 0.1} ${shoulderY}, ${x1} ${baseY}
    Z`;
}

export default function PileView({ piles }) {
  const maxTons = Math.max(1, ...piles.map((p) => p.tons || 0));
  const W = 92, baseY = 92, minTopY = 20;
  const feederY = baseY + 5, feederSize = 20;
  const rollerY = feederRollerY(feederY, feederSize);
  const H = rollerY + 12;

  return (
    <div className="scada-scroll" style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
      {piles.map((p) => {
        const empty = p.state === 'libre';
        const heightFrac = empty ? 0 : Math.max(0.32, (p.tons || 0) / maxTons);
        const topY = baseY - (baseY - minTopY) * heightFrac;
        const halfWidth = 32;
        const gradId = `pile-grad-${p.sector}`;
        const gradId2 = `pile-grad2-${p.sector}`;
        const clipId = `pile-clip-${p.sector}`;
        const base = p.color || '#3a4a60';
        const colorFrom = shade(base, -0.4);
        const colorTo = shade(base, 0.3);
        const base2 = p.colorSecondary;
        const colorFrom2 = base2 ? shade(base2, -0.4) : null;
        const colorTo2 = base2 ? shade(base2, 0.3) : null;
        const path = moundPath(W / 2, baseY, topY, halfWidth);
        const feederColor = empty ? '#33415a' : base;

        return (
          <div key={p.sector} style={{ flex: 'none', width: W, textAlign: 'center' }}>
            <div className="font-mono-scada" style={{ fontSize: 10, fontWeight: 700, color: '#00e5ff', marginBottom: 2 }}>{p.sector}</div>
            <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
              <defs>
                <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={colorFrom} />
                  <stop offset="100%" stopColor={colorTo} />
                </linearGradient>
                {base2 && (
                  <>
                    <linearGradient id={gradId2} x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor={colorFrom2} />
                      <stop offset="100%" stopColor={colorTo2} />
                    </linearGradient>
                    <clipPath id={clipId}>
                      <rect x={W / 2} y="0" width={W / 2} height={H} />
                    </clipPath>
                  </>
                )}
              </defs>
              <line x1="4" y1={baseY} x2={W - 4} y2={baseY} stroke="#1a2435" strokeWidth="2" />
              {!empty && (
                <path
                  d={path}
                  fill={`url(#${gradId})`}
                  stroke={p.isBad ? '#ff1744' : 'none'}
                  strokeWidth={p.isBad ? 2 : 0}
                  strokeDasharray={p.isBad ? '4,3' : 'none'}
                />
              )}
              {!empty && base2 && (
                <path d={path} fill={`url(#${gradId2})`} clipPath={`url(#${clipId})`} />
              )}
              {p.dayLabel != null && !empty && (
                <g>
                  <rect x={W / 2 - 13} y={topY - 17} width="26" height="14" rx="3" fill="#0a0e17" stroke={base} strokeWidth="1" />
                  <text x={W / 2} y={topY - 7} textAnchor="middle" className="font-mono-scada" fontSize="9" fontWeight="700" fill="#e0e6f0">{p.dayLabel}</text>
                </g>
              )}

              {/* schematic reclaim feeder + conveyor line */}
              <line x1="0" y1={rollerY} x2={W} y2={rollerY} stroke="#1a2435" strokeWidth="3" />
              <FeederIcon x={W / 2} y={baseY + 5} size={20} color={feederColor} running={!empty} />
              {!empty && base2 && (
                <g clipPath={`url(#${clipId})`}>
                  <FeederIcon x={W / 2} y={baseY + 5} size={20} color={base2} running />
                </g>
              )}
            </svg>
            <div className="font-mono-scada" style={{ fontSize: 8.5, fontWeight: 700, color: empty ? '#4a5a74' : (p.color || '#3a4a60'), marginTop: 2, whiteSpace: 'nowrap' }}>{p.stateLabel}</div>
          </div>
        );
      })}
    </div>
  );
}
