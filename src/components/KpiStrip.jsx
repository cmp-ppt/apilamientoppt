import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function KpiStrip({ kpis, columns }) {
  return (
    <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns || kpis.length}, 1fr)`, gap: 8 }}>
      {kpis.map((k, i) => {
        const hasSeries = k.series && k.series.some((p) => p.value != null);
        return (
          <div key={i} className="scada-panel" style={{ padding: '10px 12px' }}>
            <div className="scada-label">{k.label}</div>
            <div
              className="font-mono-scada kpi-value-glow"
              style={{ fontWeight: 700, fontSize: 20, lineHeight: 1.15, marginTop: 4, color: k.color }}
            >
              {k.value}
            </div>
            <div style={{ fontSize: 10, color: '#54637a', marginTop: 2, fontWeight: 500 }}>{k.sub}</div>
            {hasSeries && (
              <div className="no-print" style={{ height: 22, marginTop: 6 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={k.series} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                    <Area
                      type="monotone" dataKey="value" stroke={k.color} strokeWidth={1.5}
                      fill={k.color} fillOpacity={0.15} connectNulls dot={false} isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
