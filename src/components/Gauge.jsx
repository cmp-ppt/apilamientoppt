// Analog speedometer-style gauge: dial + tick marks + needle from a center hub,
// with the value shown in a separate digital readout below (not floating inside the arc).
export default function Gauge({ label, value, unit = '%', min = 0, max = 100, setpoint, color = '#00e5ff', size = 190 }) {
  const w = size;
  const r = w * 0.34;
  const cx = w / 2;
  const cy = w * 0.44;
  const readoutH = w * 0.26;
  const h = cy + w * 0.1 + readoutH;

  const clamp = (v) => Math.max(min, Math.min(max, v));
  const angleFor = (v) => Math.PI - ((clamp(v) - min) / (max - min)) * Math.PI;
  const point = (angle, radius) => [cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)];

  const arcPath = (fromAngle, toAngle, radius) => {
    const [x1, y1] = point(fromAngle, radius);
    const [x2, y2] = point(toAngle, radius);
    const largeArc = Math.abs(fromAngle - toAngle) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 0 ${x2} ${y2}`;
  };

  const hasValue = value != null && !isNaN(value);
  const valueAngle = hasValue ? angleFor(value) : Math.PI / 2;
  const needleLen = r - w * 0.045;
  const [needleX, needleY] = point(valueAngle, needleLen);
  const trackW = w * 0.045;

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const a = Math.PI - f * Math.PI;
    const [x1, y1] = point(a, r + trackW * 0.7);
    const [x2, y2] = point(a, r + trackW * 0.7 + (f === 0 || f === 1 ? w * 0.05 : w * 0.03));
    return { x1, y1, x2, y2, major: f === 0 || f === 1 };
  });

  const [minX, minY] = point(Math.PI, r + trackW * 0.7 + w * 0.05);
  const [maxX, maxY] = point(0, r + trackW * 0.7 + w * 0.05);

  const needleColor = hasValue ? color : '#3a4a60';

  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h}>
        <path d={arcPath(Math.PI, 0, r)} fill="none" stroke="#1e2940" strokeWidth={trackW} strokeLinecap="butt" />

        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={t.major ? '#5a6a84' : '#33415a'} strokeWidth={t.major ? 2 : 1.2} />
        ))}
        <text x={minX} y={minY + 3} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={size * 0.05} fill="#4a5a74">{min}</text>
        <text x={maxX} y={maxY + 3} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={size * 0.05} fill="#4a5a74">{max}</text>

        {setpoint != null && (() => {
          const a = angleFor(setpoint);
          const [x1, y1] = point(a, r - trackW * 0.7);
          const [x2, y2] = point(a, r + trackW * 0.7);
          return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffab00" strokeWidth="3" strokeLinecap="round" />;
        })()}

        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={needleColor} strokeWidth={w * 0.02} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={w * 0.032} fill="#0a0e17" stroke={needleColor} strokeWidth="2.5" />

        <rect x={cx - w * 0.26} y={cy + w * 0.09} width={w * 0.52} height={readoutH} rx="4" fill="#0a0e17" stroke="#1a2435" />
        <text x={cx} y={cy + w * 0.09 + readoutH * 0.62} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={size * 0.145} fontWeight="700" fill={hasValue ? color : '#3a4a60'}>
          {hasValue ? (typeof value === 'number' ? value.toFixed(1) : value) : '—'}
        </text>
        <text x={cx + w * 0.19} y={cy + w * 0.09 + readoutH * 0.62} textAnchor="start" fontFamily="'JetBrains Mono',monospace" fontSize={size * 0.06} fill="#6b7a94">
          {unit}
        </text>
      </svg>
      <div className="scada-label" style={{ marginTop: 2 }}>{label}</div>
    </div>
  );
}
