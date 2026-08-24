import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

export default function TrendChart({ title, data, dataKey = 'value', color = '#1a73e8', setpoint, average, unit = '', height = 180, domain = [0, 'auto'] }) {
  return (
    <div>
      {title && <div className="scada-label" style={{ marginBottom: 8 }}>{title}</div>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 6, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e2e7ef" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#54637a', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#e2e7ef' }} tickLine={false} />
          <YAxis
            domain={domain} tickFormatter={(v) => (Number.isInteger(v) ? v : v.toFixed(1))}
            tick={{ fill: '#54637a', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }} axisLine={{ stroke: '#e2e7ef' }} tickLine={false} width={38}
          />
          <Tooltip
            contentStyle={{ background: '#f6f8fb', border: '1px solid #e2e7ef', borderRadius: 4, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
            labelStyle={{ color: '#54637a' }}
            itemStyle={{ color }}
            formatter={(v) => [v == null ? '—' : `${v}${unit}`, title || '']}
          />
          {setpoint != null && (
            <ReferenceLine y={setpoint} stroke="#ef9b3a" strokeDasharray="4 3" strokeWidth={1.5} />
          )}
          {average != null && (
            <ReferenceLine y={average} stroke="#54637a" strokeDasharray="4 3" strokeWidth={1.5} />
          )}
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${color.replace('#', '')})`} connectNulls dot={false} activeDot={{ r: 3, fill: color }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
