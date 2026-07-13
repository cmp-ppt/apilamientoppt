import { useAlarms } from '../hooks/useAlarms';
import StatusDot from './StatusDot';

const SEV_COLOR = { high: '#dc2626', medium: '#ef9b3a', low: '#54637a' };
const SEV_LABEL = { high: 'ALTA', medium: 'MEDIA', low: 'BAJA' };

export default function AlarmPanel() {
  const { alarms, totalActive, dismiss, dismissAll } = useAlarms();

  return (
    <div className="scada-panel" style={{ padding: 0, overflow: 'hidden' }}>
      <div className="scada-panel-header" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="scada-label" style={{ color: '#182a44' }}>PANEL DE ALARMAS · 3 ÁREAS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="font-mono-scada" style={{ fontSize: 11, fontWeight: 700, color: totalActive ? '#dc2626' : '#1f9d55' }}>
            {totalActive} ACTIVAS
          </span>
          {totalActive > 0 && (
            <button onClick={dismissAll} className="no-print font-mono-scada" style={{ border: '1px solid #e2e7ef', background: 'transparent', color: '#54637a', borderRadius: 3, padding: '2px 7px', cursor: 'pointer', fontSize: 9, fontWeight: 700 }}>
              ACUSAR TODAS
            </button>
          )}
        </div>
      </div>
      <div className="scada-scroll" style={{ maxHeight: 260, overflowY: 'auto' }}>
        {alarms.length === 0 && (
          <div style={{ padding: '18px 14px', color: '#9aa7b8', fontSize: 11.5, textAlign: 'center' }}>Sin alarmas activas</div>
        )}
        {alarms.map((a) => (
          <div
            key={a.id}
            className={a.severity === 'high' ? 'alarm-row-bg' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderBottom: '1px solid #e2e7ef' }}
          >
            <StatusDot color={SEV_COLOR[a.severity]} size={7} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#182a44', fontWeight: 600 }}>{a.message}</div>
              <div className="font-mono-scada" style={{ fontSize: 9.5, color: '#54637a', marginTop: 1 }}>
                {a.source}{a.day != null ? ` · día ${String(a.day).padStart(2, '0')}` : ''}
              </div>
            </div>
            <span className="font-mono-scada" style={{ fontSize: 9, fontWeight: 700, color: SEV_COLOR[a.severity] }}>{SEV_LABEL[a.severity]}</span>
            <button
              onClick={() => dismiss(a.id)}
              title="Acusar alarma"
              className="no-print"
              style={{ border: '1px solid #e2e7ef', background: 'transparent', color: '#9aa7b8', borderRadius: 3, width: 18, height: 18, lineHeight: 1, cursor: 'pointer', fontSize: 11 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
