import { useRef } from 'react';
import { useAcopio } from '../store/AcopioContext';
import { useSFView } from '../hooks/useDerived';
import { SF_PARAMS, TONS } from '../constants';
import DayHeaderRow from './DayHeaderRow';
import PileView from './PileView';
import SectorTag from './SectorTag';

const OCC_COLOR = { libre: '#ffffff', ema: '#7c3aed', bella: '#ef9b3a' };
const OCC_LABEL_UP = { libre: 'LIBRE', ema: 'EMA', bella: 'BELLA ESTER', mixto: 'MIXTO' };
const MIXTO_BG = 'repeating-linear-gradient(45deg,#7c3aed,#7c3aed 4px,#ef9b3a 4px,#ef9b3a 8px)';
const OCC_LABEL = { libre: 'Libre', ema: 'Acopio Ema', bella: 'Acopio Bella Ester', mixto: 'Acopio mixto' };

export default function SinterFeedPanel() {
  const { cycleSF, setRefDay, refDay, requestReset, setModal, importExcelSinter } = useAcopio();
  const { dim, sfDayHeaders, sfOccRows, sfSections } = useSFView();
  const fileRef = useRef(null);

  const piles = sfOccRows.map((row) => {
    const cell = row.cells.find((c) => c.isRef);
    const isMixed = cell.state === 'mixto';
    return {
      sector: row.sector,
      tons: TONS.SF[row.sector],
      state: cell.state,
      color: isMixed ? OCC_COLOR.ema : OCC_COLOR[cell.state],
      colorSecondary: isMixed ? OCC_COLOR.bella : null,
      stateLabel: OCC_LABEL_UP[cell.state],
    };
  });

  const onImport = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const res = await importExcelSinter(file);
      setModal({ kind: 'confirm', title: res.ok ? 'Importación completada' : 'No se pudo leer el Excel', message: res.message, okLabel: 'Entendido' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const openSinter6 = (provider, sector, idx) => {
    const bucket = sfSections.find((s) => s.key === provider);
    const row = bucket.rows.find((r) => r.sector === sector);
    const cell = row.cells[idx];
    const fields = SF_PARAMS.map((p) => {
      const mini = cell.minis.find((mc) => mc.key === p.key);
      return { key: p.key, label: p.label, hint: p.hint, initial: mini.measured ? String(mini.value).replace('.', ',') : '' };
    });
    setModal({
      kind: 'sinter6', sector, idx, provider,
      title: 'Registrar leyes químicas',
      subtitle: `${sector} · día ${String(idx + 1).padStart(2, '0')}`,
      fields,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="scada-panel" style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
          <div>
            <div className="scada-label" style={{ color: '#182a44', fontSize: 11 }}>OCUPACIÓN POR FEEDER — SINTER FEED</div>
            <div style={{ fontSize: 10.5, color: '#54637a', marginTop: 2 }}>Selecciona un día y haz clic en la celda para cambiar el proveedor</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="no-print" onClick={requestReset} style={smallBtn}>BORRAR DÍA {String(refDay).padStart(2, '0')}</button>
            <button className="no-print" onClick={() => fileRef.current?.click()} style={{ ...smallBtn, background: '#3f77e8', color: '#eef1f6', borderColor: '#3f77e8' }}>IMPORTAR EXCEL</button>
            <input ref={fileRef} type="file" accept=".xlsx" onChange={onImport} style={{ display: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
          {Object.entries(OCC_LABEL).map(([k, label]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#54637a' }}>
              <span style={{ width: 13, height: 13, borderRadius: 3, background: k === 'mixto' ? MIXTO_BG : OCC_COLOR[k], border: k === 'libre' ? '1px solid #cdd6e2' : 'none' }} />
              {label}
            </span>
          ))}
        </div>

        <div className="scada-label" style={{ fontSize: 9, marginBottom: 6 }}>VISTA DE ACOPIO · DÍA {String(refDay).padStart(2, '0')}</div>
        <PileView piles={piles} />

        <div className="matrix-scroll scada-scroll" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'inline-block', minWidth: '100%' }}>
            <DayHeaderRow dayHeaders={sfDayHeaders} onSelectDay={setRefDay} colWidth={58} labelWidth={62} />
            {sfOccRows.map((row) => (
              <div key={row.sector} style={{ display: 'flex', alignItems: 'stretch' }}>
                <div className="font-mono-scada matrix-sticky-col" style={{ width: 62, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', borderRight: '1px solid #e2e7ef', borderBottom: '1px solid #e2e7ef', fontWeight: 700, fontSize: 10.5, color: '#1a73e8' }}>
                  <SectorTag sector={row.sector} />
                </div>
                {row.cells.map((c) => (
                  <div
                    key={c.day}
                    title={`${row.sector} · día ${String(c.day).padStart(2, '0')} · ${OCC_LABEL[c.state]}`}
                    onClick={() => (c.isRef ? cycleSF(row.sector, c.day - 1) : setRefDay(c.day))}
                    className="matrix-cell"
                    style={{
                      width: 58, height: 30,
                      background: c.state === 'mixto' ? MIXTO_BG : OCC_COLOR[c.state],
                      cursor: 'pointer',
                      boxShadow: c.isRef ? 'inset 0 0 0 2px #1a73e8' : 'none',
                      opacity: c.isRef ? 1 : 0.85,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {sfSections.map((sec) => (
        <div key={sec.key} className="scada-panel" style={{ padding: '12px 14px' }}>
          <div className="scada-label" style={{ color: '#182a44', fontSize: 11, marginBottom: 10 }}>{sec.title.toUpperCase()}</div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,18px)', gridTemplateRows: 'repeat(2,18px)', gap: 1, background: '#1a73e8', padding: 2, borderRadius: 4 }}>
              {['Fe', 'Si', 'Al', 'P', 'S', 'Ti'].map((el) => (
                <span key={el} style={{ background: '#f6f8fb', color: '#1a73e8', fontSize: 7, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'JetBrains Mono',monospace" }}>{el}</span>
              ))}
            </div>
            <span style={{ fontSize: 10, color: '#54637a' }}>posición de cada ley dentro de la casilla</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#54637a' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#1f9d55' }} />Cumple especificación</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#54637a' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#dc2626' }} />Fuera de especificación</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#54637a' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#ffffff', border: '1px solid #cdd6e2' }} />Sin registro</span>
          </div>
          <div className="font-mono-scada" style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap', fontSize: 9.5, color: '#54637a' }}>
            {SF_PARAMS.map((p) => (
              <span key={p.key}><strong style={{ color: '#1a73e8' }}>{p.label}</strong> {p.hint}</span>
            ))}
          </div>
          <div className="matrix-scroll scada-scroll" style={{ overflowX: 'auto', paddingBottom: 4 }}>
            <div style={{ display: 'inline-block', minWidth: '100%' }}>
              <DayHeaderRow dayHeaders={sfDayHeaders} onSelectDay={setRefDay} colWidth={90} labelWidth={62} />
              {sec.rows.map((row) => (
                <div key={row.sector} style={{ display: 'flex', alignItems: 'stretch' }}>
                  <div className="font-mono-scada matrix-sticky-col" style={{ width: 62, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', borderRight: '1px solid #e2e7ef', borderBottom: '1px solid #e2e7ef', fontWeight: 700, fontSize: 10.5, color: '#1a73e8' }}>
                    <SectorTag sector={row.sector} />
                  </div>
                  {row.cells.map((c) => (
                    <div
                      key={c.day}
                      className="matrix-cell"
                      style={{
                        width: 90, height: 34, boxSizing: 'border-box',
                        borderRight: '1px solid #e2e7ef', borderBottom: '1px solid #e2e7ef',
                        display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(2,1fr)', gap: 2, padding: 3,
                        boxShadow: c.isRef ? 'inset 0 0 0 2px #1a73e8' : 'none',
                      }}
                    >
                      {c.minis.map((mc) => (
                        <div
                          key={mc.key}
                          title={`${row.sector} · día ${String(c.day).padStart(2, '0')} · ${mc.label} ${mc.measured ? mc.text + '%' : mc.enabled ? '(sin registro)' : '(marca ocupación primero)'}`}
                          onClick={c.enabled ? () => openSinter6(sec.key, row.sector, c.day - 1) : undefined}
                          className="font-mono-scada"
                          style={{
                            background: mc.measured ? (mc.pass ? '#1f9d55' : '#dc2626') : c.enabled ? '#ffffff' : '#eef1f6',
                            color: mc.measured ? (mc.pass ? '#04160c' : '#fff') : '#9aa7b8',
                            borderRadius: 2, cursor: c.enabled ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch',
                            fontSize: 8, fontWeight: 700, lineHeight: 1, overflow: 'hidden', whiteSpace: 'nowrap',
                          }}
                        >
                          {mc.measured ? mc.text : ''}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const smallBtn = {
  border: '1px solid #e2e7ef', background: '#f6f8fb', color: '#54637a', borderRadius: 4, padding: '5px 10px',
  cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5,
};
