import { useState } from 'react';
import { useAcopio } from '../../store/AcopioContext';
import ModalShell from './ModalShell';
import { cancelBtn, okBtn } from './ValueModal';

export default function Sinter6Modal({ modal }) {
  const { setModal, setSinterMulti } = useAcopio();
  const [values, setValues] = useState(() => Object.fromEntries(modal.fields.map((f) => [f.key, f.initial || ''])));

  const close = () => setModal(null);
  const save = () => {
    const entries = modal.fields.map((f) => ({ paramKey: f.key, raw: (values[f.key] || '').trim() }));
    setSinterMulti(modal.provider, modal.sector, modal.idx, entries);
    close();
  };
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } if (e.key === 'Escape') close(); };

  return (
    <ModalShell onClose={close} maxWidth={480}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#182a44', margin: 0 }}>{modal.title}</h3>
      <p className="font-mono-scada" style={{ fontSize: 10.5, color: '#54637a', fontWeight: 600, margin: '6px 0 14px' }}>{modal.subtitle}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {modal.fields.map((f, i) => (
          <div key={f.key}>
            <label className="scada-label" style={{ display: 'block', marginBottom: 4, fontSize: 9 }}>{f.label.toUpperCase()}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1.5px solid #e2e7ef', borderRadius: 4, padding: '7px 8px', background: '#eef1f6' }}>
              <input
                autoFocus={i === 0}
                type="text"
                inputMode="decimal"
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                onKeyDown={onKey}
                placeholder="0,0"
                style={{ width: '100%', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 700, color: '#1a73e8', fontFamily: "'JetBrains Mono',monospace" }}
              />
              <span className="font-mono-scada" style={{ fontSize: 11, color: '#54637a', fontWeight: 600 }}>%</span>
            </div>
            <p style={{ fontSize: 8.5, color: '#9aa7b8', margin: '4px 0 0' }}>{f.hint}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10.5, color: '#9aa7b8', margin: '14px 0 0' }}>Deja un campo vacío para borrar ese registro.</p>

      <div style={{ display: 'flex', gap: 9, marginTop: 20 }}>
        <button onClick={close} style={cancelBtn}>CANCELAR</button>
        <button onClick={save} style={okBtn}>GUARDAR</button>
      </div>
    </ModalShell>
  );
}
