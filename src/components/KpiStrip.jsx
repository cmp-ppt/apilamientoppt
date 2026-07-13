export default function KpiStrip({ kpis, columns }) {
  return (
    <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns || kpis.length}, 1fr)`, gap: 8 }}>
      {kpis.map((k, i) => (
        <div key={i} className="scada-panel" style={{ padding: '10px 12px' }}>
          <div className="scada-label">{k.label}</div>
          <div
            className="font-mono-scada kpi-value-glow"
            style={{ fontWeight: 700, fontSize: 20, lineHeight: 1.15, marginTop: 4, color: k.color }}
          >
            {k.value}
          </div>
          <div style={{ fontSize: 10, color: '#6b7a94', marginTop: 2, fontWeight: 500 }}>{k.sub}</div>
        </div>
      ))}
    </div>
  );
}
