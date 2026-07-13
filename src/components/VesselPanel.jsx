import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';

export default function VesselPanel() {
  const { setModal, modalVesselType, setModalVesselType, month, refDay, vesselsFor } = useAcopio();
  const { vessels } = useCanchaView();

  const openAdd = () => {
    setModalVesselType('hierro_apf');
    setModal({ kind: 'vessel', index: null, title: 'Agregar motonave', initial: { name: '', from: refDay || 1, to: refDay || 1, tons: '' } });
  };
  const openEdit = (v) => {
    const raw = vesselsFor(month)[v.index];
    if (!raw) return;
    const typeKey = raw.op === 'hierro' ? 'hierro_' + String(raw.prod || 'APF').toLowerCase() : raw.op;
    setModalVesselType(typeKey);
    setModal({
      kind: 'vessel', index: v.index, title: 'Editar motonave',
      initial: { name: raw.name, from: raw.from, to: raw.to, tons: raw.tons },
    });
  };

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="scada-label" style={{ color: '#e0e6f0', fontSize: 11 }}>CALENDARIO DE MOTONAVES</div>
        <button className="no-print" onClick={openAdd} style={addBtn}>+ AGREGAR</button>
      </div>
      <div className="scada-scroll" style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {vessels.length === 0 && (
          <div style={{ padding: '20px 8px', textAlign: 'center', color: '#3a4a60', fontSize: 11.5 }}>
            Sin motonaves programadas este mes.<br />Usa <strong style={{ color: '#00e5ff' }}>+ Agregar</strong> para registrar una.
          </div>
        )}
        {vessels.map((v) => (
          <div
            key={v.index}
            onClick={() => openEdit(v)}
            style={{ display: 'flex', gap: 10, padding: '8px 8px', borderRadius: 4, border: '1px solid #1a2435', background: '#0a0e17', opacity: v.muted ? 0.55 : 1, cursor: 'pointer' }}
          >
            <div style={{ width: 3, borderRadius: 2, background: v.accent }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ flex: 1, minWidth: 0, fontWeight: 600, fontSize: 12, color: '#e0e6f0' }}>{v.name}</span>
                <span className="font-mono-scada" style={{ flex: 'none', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 3, color: v.riskColor, background: v.riskColor + '22' }}>{v.riskLabel}</span>
              </div>
              <div className="font-mono-scada" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 3, fontSize: 10, color: '#6b7a94' }}>
                <span>{v.range}{v.tonsLabel ? '  ·  ' + v.tonsLabel : ''}</span>
                <span style={{ color: v.humColor }}>{v.humLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const addBtn = {
  border: '1px solid #00e5ff', background: 'transparent', color: '#00e5ff', borderRadius: 4, padding: '5px 10px',
  cursor: 'pointer', fontSize: 10.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace",
};
