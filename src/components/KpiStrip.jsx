import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
import { shade } from '../utils/color';
import KpiIcon from './KpiIcon';

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
        const badgeColor = k.iconColor || k.color;
        return (
          <div key={i} className="scada-panel kpi-card" style={{ padding: '10px 12px 10px 15px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: badgeColor }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div className="scada-label" style={{ paddingTop: 2 }}>{k.label}</div>
              {k.icon && (
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flex: 'none',
                  background: shade(badgeColor, 0.85), color: badgeColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <KpiIcon name={k.icon} size={15} />
                </div>
              )}
            </div>
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
