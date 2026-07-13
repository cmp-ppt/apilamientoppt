import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function TrendChart({ title, data, dataKey = 'value', color = '#00e5ff', setpoint, unit = '', height = 180 }) {
  return (
    <div>
      {title && <div className="scada-label" style={{ marginBottom: 8 }}>{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a2435" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#6b7a94', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#1a2435' }} tickLine={false} />
          <YAxis tick={{ fill: '#6b7a94', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#1a2435' }} tickLine={false} width={34} />
          <Tooltip
            contentStyle={{ background: '#131b2a', border: '1px solid #1a2435', borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            labelStyle={{ color: '#6b7a94' }}
            itemStyle={{ color }}
            formatter={(v) => [v == null ? '—' : `${v}${unit}`, title || '']}
          />
          {setpoint != null && (
            <ReferenceLine y={setpoint} stroke="#ffab00" strokeDasharray="4 3" strokeWidth={1.5} />
          )}
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#', '')})`} connectNulls dot={false} activeDot={{ r: 3, fill: color }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
