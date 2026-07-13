import { useState } from 'react';
import { useAcopio } from '../../store/AcopioContext';
import ModalShell from './ModalShell';

export default function ValueModal({ modal }) {
  const { setModal, setHumAt, setFeAt } = useAcopio();
  const [value, setValue] = useState(modal.initial || '');

  const close = () => setModal(null);
  const save = () => {
    if (modal.isFe) setFeAt(modal.sector, modal.idx, value.trim());
    else setHumAt(modal.sector, modal.idx, value.trim());
    close();
  };
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } if (e.key === 'Escape') close(); };

  return (
    <ModalShell onClose={close}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e0e6f0', margin: 0 }}>{modal.title}</h3>
      <p className="font-mono-scada" style={{ fontSize: 10.5, color: '#6b7a94', fontWeight: 600, margin: '6px 0 14px' }}>{modal.subtitle}</p>
      <label className="scada-label" style={{ display: 'block', marginBottom: 6 }}>{modal.isFe ? 'LEY DE FE' : 'HUMEDAD'}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid #1a2435', borderRadius: 4, padding: '10px 12px', background: '#0a0e17' }}>
        <input
          autoFocus
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="0,0"
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontSize: 20, fontWeight: 700, color: '#00e5ff', fontFamily: "'JetBrains Mono',monospace" }}
        />
        <span className="font-mono-scada" style={{ fontSize: 16, color: '#6b7a94', fontWeight: 600 }}>%</span>
      </div>
      <p style={{ fontSize: 10.5, color: '#3a4a60', margin: '9px 0 0' }}>Deja el campo vacío para borrar el registro.</p>

      <div style={{ display: 'flex', gap: 9, marginTop: 20 }}>
        <button onClick={close} style={cancelBtn}>CANCELAR</button>
        <button onClick={save} style={okBtn}>GUARDAR</button>
      </div>
    </ModalShell>
  );
}

export const cancelBtn = {
  border: '1px solid #1a2435', background: 'transparent', color: '#6b7a94', borderRadius: 4, padding: '9px 16px',
  cursor: 'pointer', fontSize: 11.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
};
export const okBtn = {
  border: 'none', background: '#00e5ff', color: '#04222b', borderRadius: 4, padding: '9px 20px',
  cursor: 'pointer', fontSize: 11.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginLeft: 'auto',
  boxShadow: '0 0 12px #00e5ff55',
};
export const deleteBtn = {
  border: '1px solid #ff174455', background: 'transparent', color: '#ff1744', borderRadius: 4, padding: '9px 16px',
  cursor: 'pointer', fontSize: 11.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", marginRight: 'auto',
};
