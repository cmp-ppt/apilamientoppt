import { useAcopio } from '../store/AcopioContext';

const GROUPS = ['G1', 'G2', 'G3', 'G4'];

export default function ShiftLogPanel() {
  const { month, refDay, shift, setShift, log, setLog } = useAcopio();
  const rec = log?.[month]?.[refDay]?.[shift] || {};

  return (
    <div className="scada-panel no-print" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div className="scada-label" style={{ color: '#182a44', fontSize: 11 }}>REGISTRO DE TURNO</div>
          <span className="font-mono-scada" style={{ fontSize: 10, color: '#54637a' }}>{String(refDay).padStart(2, '0')}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#eef1f6', padding: 3, borderRadius: 4, border: '1px solid #e2e7ef' }}>
          {['D', 'N'].map((sh) => (
            <button key={sh} onClick={() => setShift(sh)} style={segBtn(shift === sh, '#1a73e8')}>{sh === 'D' ? 'DÍA' : 'NOCHE'}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="GRUPO">
          <div style={{ display: 'flex', gap: 5, flex: 1 }}>
            {GROUPS.map((g) => (
              <button key={g} onClick={() => setLog('turno', rec.turno === g ? '' : g)} style={{ ...segBtn(rec.turno === g, '#3f77e8'), flex: 1 }}>{g}</button>
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
              <button key={v} onClick={() => setLog('bulldozer', rec.bulldozer === v ? '' : v)} style={segBtn(rec.bulldozer === v, v === 'si' ? '#1f9d55' : '#54637a')}>{label}</button>
            ))}
          </div>
        </Field>

        <Field label="USO EXCAVADORA">
          <div style={{ display: 'flex', gap: 5 }}>
            {[['Sí', 'si'], ['No', 'no']].map(([label, v]) => (
              <button key={v} onClick={() => setLog('excavadora', rec.excavadora === v ? '' : v)} style={segBtn(rec.excavadora === v, v === 'si' ? '#1f9d55' : '#54637a')}>{label}</button>
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
    border: `1px solid ${active ? color : '#e2e7ef'}`,
    background: active ? color : '#eef1f6',
    color: active ? '#eef1f6' : '#54637a',
    borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
    fontSize: 10.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
  };
}

const inputStyle = {
  flex: 1, minWidth: 0, border: '1px solid #e2e7ef', background: '#eef1f6', borderRadius: 4, padding: '6px 9px',
  fontFamily: "'IBM Plex Sans',sans-serif", fontSize: 11.5, color: '#182a44', outline: 'none',
};
