import { useState } from 'react';
import { useAcopio } from '../../store/AcopioContext';
import ModalShell from './ModalShell';
import { cancelBtn, okBtn } from './ValueModal';

export default function Sinter6Modal({ modal }) {
  const { setModal, setSinterAt } = useAcopio();
  const [values, setValues] = useState(() => Object.fromEntries(modal.fields.map((f) => [f.key, f.initial || ''])));

  const close = () => setModal(null);
  const save = () => {
    for (const f of modal.fields) setSinterAt(modal.provider, f.key, modal.sector, modal.idx, (values[f.key] || '').trim());
    close();
  };
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } if (e.key === 'Escape') close(); };

  return (
    <ModalShell onClose={close} maxWidth={480}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e0e6f0', margin: 0 }}>{modal.title}</h3>
      <p className="font-mono-scada" style={{ fontSize: 10.5, color: '#6b7a94', fontWeight: 600, margin: '6px 0 14px' }}>{modal.subtitle}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {modal.fields.map((f, i) => (
          <div key={f.key}>
            <label className="scada-label" style={{ display: 'block', marginBottom: 4, fontSize: 9 }}>{f.label.toUpperCase()}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, border: '1.5px solid #1a2435', borderRadius: 4, padding: '7px 8px', background: '#0a0e17' }}>
              <input
                autoFocus={i === 0}
                type="text"
                inputMode="decimal"
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                onKeyDown={onKey}
                placeholder="0,0"
                style={{ width: '100%', minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontWeight: 700, color: '#00e5ff', fontFamily: "'JetBrains Mono',monospace" }}
              />
              <span className="font-mono-scada" style={{ fontSize: 11, color: '#6b7a94', fontWeight: 600 }}>%</span>
            </div>
            <p style={{ fontSize: 8.5, color: '#3a4a60', margin: '4px 0 0' }}>{f.hint}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10.5, color: '#3a4a60', margin: '14px 0 0' }}>Deja un campo vacío para borrar ese registro.</p>

      <div style={{ display: 'flex', gap: 9, marginTop: 20 }}>
        <button onClick={close} style={cancelBtn}>CANCELAR</button>
        <button onClick={save} style={okBtn}>GUARDAR</button>
      </div>
    </ModalShell>
  );
}
