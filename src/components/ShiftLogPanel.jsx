import { useAcopio } from '../store/AcopioContext';

const GROUPS = ['G1', 'G2', 'G3', 'G4'];

export default function ShiftLogPanel() {
  const { month, refDay, shift, setShift, log, setLog } = useAcopio();
  const rec = log?.[month]?.[refDay]?.[shift] || {};

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div className="scada-label" style={{ color: '#e0e6f0', fontSize: 11 }}>REGISTRO DE TURNO</div>
          <span className="font-mono-scada" style={{ fontSize: 10, color: '#6b7a94' }}>{String(refDay).padStart(2, '0')}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#0a0e17', padding: 3, borderRadius: 4, border: '1px solid #1a2435' }}>
          {['D', 'N'].map((sh) => (
            <button key={sh} onClick={() => setShift(sh)} style={segBtn(shift === sh, '#00e5ff')}>{sh === 'D' ? 'DÍA' : 'NOCHE'}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="GRUPO">
          <div style={{ display: 'flex', gap: 5, flex: 1 }}>
            {GROUPS.map((g) => (
              <button key={g} onClick={() => setLog('turno', rec.turno === g ? '' : g)} style={{ ...segBtn(rec.turno === g, '#448aff'), flex: 1 }}>{g}</button>
            ))}
          </div>
        </Field>

        <Field label="CONTROLADOR">
          <input
            type="text"
            defaultValue={rec.controlador || ''}
            key={`${month}-${refDay}-${shift}`}
            onBlur={(e) => setLog('controlador', e.target.value)}
            placeholder="Nombre controlador sala"
            style={inputStyle}
          />
        </Field>

        <Field label="USO BULLDOZER">
          <div style={{ display: 'flex', gap: 5 }}>
            {[['Sí', 'si'], ['No', 'no']].map(([label, v]) => (
              <button key={v} onClick={() => setLog('bulldozer', rec.bulldozer === v ? '' : v)} style={segBtn(rec.bulldozer === v, v === 'si' ? '#00e676' : '#6b7a94')}>{label}</button>
            ))}
          </div>
        </Field>

        <Field label="USO EXCAVADORA">
          <div style={{ display: 'flex', gap: 5 }}>
            {[['Sí', 'si'], ['No', 'no']].map(([label, v]) => (
              <button key={v} onClick={() => setLog('excavadora', rec.excavadora === v ? '' : v)} style={segBtn(rec.excavadora === v, v === 'si' ? '#00e676' : '#6b7a94')}>{label}</button>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span className="scada-label" style={{ width: 82, flex: 'none', fontSize: 9.5 }}>{label}</span>
      {children}
    </div>
  );
}

function segBtn(active, color) {
  return {
    border: `1px solid ${active ? color : '#1a2435'}`,
    background: active ? color : '#0a0e17',
    color: active ? '#0a0e17' : '#6b7a94',
    borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
    fontSize: 10.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
  };
}

const inputStyle = {
  flex: 1, minWidth: 0, border: '1px solid #1a2435', background: '#0a0e17', borderRadius: 4, padding: '6px 9px',
  fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11.5, color: '#e0e6f0', outline: 'none',
};
