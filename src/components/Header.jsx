import { useEffect, useState } from 'react';
import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';
import { exportCSV } from '../utils/csv';
import { TML } from '../constants';
import StatusDot from './StatusDot';
import cmpLogo from '../assets/cmp-logo.jpg';

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return (
    <div className="font-mono-scada" style={{ fontSize: 18, fontWeight: 700, color: '#1a73e8', letterSpacing: 1 }}>
      {hh}:{mm}:<span style={{ opacity: 0.6 }}>{ss}</span>
    </div>
  );
}

export default function Header() {
  const { month, shiftMonth, cancha, data, hum, log, syncStatus, cloudEnabled } = useAcopio();
  const { closed } = useCanchaView();

  const syncColor = syncStatus === 'ok' ? '#1f9d55' : syncStatus === 'error' ? '#dc2626' : '#ef9b3a';
  const syncLabel = syncStatus === 'ok' ? 'SINCRONIZADO' : syncStatus === 'error' ? 'SIN CONEXIÓN' : 'SINCRONIZANDO…';

  return (
    <header className="scada-panel app-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, padding: '10px 18px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 4, background: '#f6f8fb', border: '1px solid #e2e7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img src={cmpLogo} alt="CMP" style={{ height: 30, width: 'auto', display: 'block' }} />
        </div>
        <div>
          <h1 className="font-mono-scada" style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1, color: '#182a44', margin: 0 }}>
            ACOPIO Y SECADO <span style={{ color: '#1a73e8' }}>·</span> SCADA
          </h1>
          <p className="scada-label" style={{ marginTop: 2, letterSpacing: 1 }}>Puerto Punta Totoralillo · CMP — Compañía Minera del Pacífico</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f6f8fb', border: '1px solid #e2e7ef', borderRadius: 4, overflow: 'hidden' }}>
          <button className="no-print" onClick={() => shiftMonth(-1)} style={navBtnStyle}>‹</button>
          <span className="font-mono-scada" style={{ fontSize: 12, fontWeight: 600, padding: '0 8px', minWidth: 110, textAlign: 'center', textTransform: 'capitalize', color: '#182a44' }}>{monthLabelOf(month)}</span>
          <button className="no-print" onClick={() => shiftMonth(1)} style={navBtnStyle}>›</button>
        </div>

        <div style={statBoxStyle}>
          <span className="scada-label">TML LÍMITE</span>
          <span className="font-mono-scada" style={{ fontWeight: 700, fontSize: 14, color: '#1a73e8' }}>{TML.toString().replace('.', ',')}%</span>
        </div>

        <div style={{ ...statBoxStyle, flexDirection: 'row', gap: 7, alignItems: 'center' }}>
          <StatusDot color={closed ? '#54637a' : '#1f9d55'} pulse={!closed} />
          <span className="font-mono-scada" style={{ fontSize: 11, fontWeight: 600, color: closed ? '#54637a' : '#1f9d55' }}>{closed ? 'PUERTO CERRADO' : 'PUERTO OPERATIVO'}</span>
        </div>

        {cloudEnabled && (
          <div className="no-print" title="Datos compartidos entre usuarios" style={{ ...statBoxStyle, flexDirection: 'row', gap: 7, alignItems: 'center' }}>
            <StatusDot color={syncColor} pulse={syncStatus === 'syncing'} />
            <span className="font-mono-scada" style={{ fontSize: 10.5, fontWeight: 600, color: syncColor }}>{syncLabel}</span>
          </div>
        )}

        <Clock />

        <button className="no-print" onClick={() => window.print()} style={actionBtnStyle}>REPORTE PDF</button>
        {cancha !== 'SF' && (
          <button className="no-print" onClick={() => exportCSV({ month, cancha, data, hum, log })} style={{ ...actionBtnStyle, background: 'transparent', color: '#1a73e8', border: '1px solid #1a73e8' }}>CSV</button>
        )}
      </div>
    </header>
  );
}

function monthLabelOf(month) {
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const [y, m] = month.split('-').map(Number);
  return MESES[m - 1] + ' ' + y;
}

const navBtnStyle = {
  border: 'none', background: 'none', padding: '7px 10px', cursor: 'pointer', color: '#54637a', fontSize: 14, lineHeight: 1,
};
const statBoxStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f6f8fb', border: '1px solid #e2e7ef', borderRadius: 4, padding: '5px 12px',
};
const actionBtnStyle = {
  border: '1px solid #3f77e8', background: '#3f77e8', color: '#eef1f6', borderRadius: 4, padding: '8px 14px', cursor: 'pointer',
  fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5,
};
