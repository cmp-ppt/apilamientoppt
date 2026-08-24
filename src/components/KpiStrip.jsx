import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

// Sin esto, el eje usa un dominio [0, auto] por defecto: para series con poca
// variacion relativa a 0 (ej. humedad entre 8 y 10) la linea se ve casi plana,
// distinta a como se ve el mismo dato en el grafico grande de Tendencia del mes.
// Se calcula el rango real de la serie aca mismo (no como funcion de dominio de
// Recharts, que solo recibe un extremo a la vez) para que ambos coincidan.
function seriesDomain(series) {
  const vals = (series || []).map((p) => p.value).filter((v) => v != null && Number.isFinite(v));
  if (!vals.length) return [0, 1];
  const dataMin = Math.min(...vals);
  const dataMax = Math.max(...vals);
  const pad = Math.max((dataMax - dataMin) * 0.15, Math.abs(dataMax) * 0.02, 0.05);
  return [dataMin - pad, dataMax + pad];
}

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
                    <YAxis hide domain={seriesDomain(k.series)} />
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
