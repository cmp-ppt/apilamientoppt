import { useState } from 'react';
import { useAcopio } from '../../store/AcopioContext';
import ModalShell from './ModalShell';
import { cancelBtn, okBtn, deleteBtn } from './ValueModal';
import { fmt } from '../../utils/format';

const TYPE_BTNS = [
  ['hierro_apf', 'Emb. hierro APF', '#3f77e8'],
  ['hierro_asf', 'Emb. hierro ASF', '#3f77e8'],
  ['cobre', 'Emb. cobre', '#ef9b3a'],
  ['cerrado', 'Puerto cerrado', '#54637a'],
];

export default function VesselModal({ modal }) {
  const { setModal, modalVesselType, setModalVesselType, saveVesselForm, deleteVessel } = useAcopio();
  const [form, setForm] = useState({
    name: modal.initial.name || '',
    from: modal.initial.from != null ? String(modal.initial.from) : '',
    to: modal.initial.to != null ? String(modal.initial.to) : '',
    tons: modal.initial.tons != null ? fmt(modal.initial.tons) : '',
  });

  const close = () => setModal(null);
  const save = () => { saveVesselForm(modal.index, { ...form, typeKey: modalVesselType }); close(); };
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } if (e.key === 'Escape') close(); };
  const pickType = (tk) => {
    setModalVesselType(tk);
    if (!form.name.trim()) {
      if (tk === 'cerrado') setForm((f) => ({ ...f, name: 'Puerto cerrado' }));
      else if (tk === 'cobre') setForm((f) => ({ ...f, name: 'Embarque cobre' }));
    }
  };

  return (
    <ModalShell onClose={close}>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#182a44', margin: 0 }}>{modal.title}</h3>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
        <Field label="NOMBRE / EVENTO">
          <input autoFocus type="text" value={form.name} onKeyDown={onKey} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ej. MV JUDD" style={fullInput} />
        </Field>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Field label="DESDE (DÍA)">
              <input type="number" min="1" max="31" value={form.from} onKeyDown={onKey} onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))} placeholder="01" style={fullInput} />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="HASTA (DÍA)">
              <input type="number" min="1" max="31" value={form.to} onKeyDown={onKey} onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))} placeholder="05" style={fullInput} />
            </Field>
          </div>
        </div>
        <Field label="TONELAJE (T)">
          <input type="text" inputMode="numeric" value={form.tons} onKeyDown={onKey} onChange={(e) => setForm((f) => ({ ...f, tons: e.target.value }))} placeholder="Ej. 202.900" style={fullInput} />
        </Field>
        <Field label="TIPO">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TYPE_BTNS.map(([tk, label, color]) => (
              <button
                key={tk}
                onClick={() => pickType(tk)}
                style={{
                  flex: '1 1 calc(50% - 3px)', textAlign: 'center',
                  border: `1px solid ${modalVesselType === tk ? color : '#e2e7ef'}`,
                  background: modalVesselType === tk ? color : '#eef1f6',
                  color: modalVesselType === tk ? '#eef1f6' : '#54637a',
                  borderRadius: 4, padding: '8px 6px', cursor: 'pointer', fontSize: 10.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 20 }}>
        {modal.index != null && <button onClick={() => { deleteVessel(modal.index); close(); }} style={deleteBtn}>ELIMINAR</button>}
        <button onClick={close} style={cancelBtn}>CANCELAR</button>
        <button onClick={save} style={okBtn}>GUARDAR</button>
      </div>
    </ModalShell>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="scada-label" style={{ display: 'block', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const fullInput = {
  width: '100%', boxSizing: 'border-box', border: '1.5px solid #e2e7ef', background: '#eef1f6', borderRadius: 4,
  padding: '9px 11px', fontSize: 13, color: '#182a44', outline: 'none', fontFamily: "'JetBrains Mono',monospace",
};
