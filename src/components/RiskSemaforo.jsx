import { useCanchaView } from '../hooks/useDerived';

export default function RiskSemaforo() {
  const { semaforo } = useCanchaView();

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div className="scada-label" style={{ color: '#182a44', fontSize: 11, marginBottom: 10 }}>SEMÁFORO DE RIESGO POR FEEDER</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {semaforo.map((s) => (
          <div
            key={s.sector}
            title={`${s.sector} · ${s.stateLabel}${s.dryLabel ? ' · ' + s.dryLabel : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 12px', borderRadius: 6, border: '1px solid #e2e7ef', background: '#f6f8fb', minWidth: 116 }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.riskColor, flex: 'none', boxShadow: `0 0 6px ${s.riskColor}88` }} />
            <div>
              <div className="font-mono-scada" style={{ fontWeight: 700, fontSize: 11, color: '#182a44' }}>{s.sector}</div>
              <div style={{ fontSize: 9.5, color: s.riskColor, fontWeight: 600 }}>{s.riskLabel}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
