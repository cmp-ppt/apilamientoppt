import { useRef } from 'react';
import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';
import DayHeaderRow from './DayHeaderRow';
import PileView from './PileView';
import SectorTag from './SectorTag';

const STATE_BG = { fresca: '#3f77e8', secado: '#1f9d55', libre: '#ffffff' };
const STATE_LABEL = { fresca: 'FRESCA', secado: 'SECADO', libre: 'LIBRE' };
const CONTAM_BG = 'repeating-linear-gradient(45deg,#3f77e8,#3f77e8 4px,#dc2626 4px,#dc2626 6px)';

export default function EstadoMatrix() {
  const { cycle, setRefDay, requestReset, refDay, importExcel, setModal } = useAcopio();
  const { dayHeaders, rowsEstado, canchaTitle, contamTotal, tons, refIdx } = useCanchaView();
  const fileRef = useRef(null);

  const piles = rowsEstado.map((row) => {
    const cell = row.cells[refIdx];
    const color = STATE_BG[cell.state];
    return {
      sector: row.sector,
      tons: tons[row.sector],
      state: cell.state,
      color,
      isBad: cell.isBad,
      dayLabel: cell.state === 'secado' ? `${cell.dias}d` : null,
      stateLabel: STATE_LABEL[cell.state],
    };
  });

  const onImport = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const res = await importExcel(file);
      setModal({ kind: 'confirm', title: res.ok ? 'Importación completada' : 'No se pudo leer el Excel', message: res.message, okLabel: 'Entendido' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="scada-label" style={{ color: '#182a44', fontSize: 11 }}>OCUPACIÓN POR FEEDER — {canchaTitle.toUpperCase()}</div>
          <div style={{ fontSize: 10.5, color: '#54637a', marginTop: 2 }}>Selecciona un día (columna cian) y haz clic en la celda para cambiar el estado · rayado = fresca sobre secado</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="no-print" onClick={requestReset} style={smallBtn}>BORRAR DÍA {String(refDay).padStart(2, '0')}</button>
          <button className="no-print" onClick={() => fileRef.current?.click()} title="Importar humedad y Ley Fe desde Excel — solo se aplican a feeders en acopio fresco" style={{ ...smallBtn, background: '#3f77e8', color: '#eef1f6', borderColor: '#3f77e8' }}>IMPORTAR EXCEL</button>
          <input ref={fileRef} type="file" accept=".xlsx" onChange={onImport} style={{ display: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
        <Legend color="#3f77e8" label="Acopio fresca" />
        <Legend color="#1f9d55" label="Secado" />
        <Legend color="#ffffff" border label="Libre" />
        <Legend gradient={CONTAM_BG} label={`Acopio sobre secado (${contamTotal})`} />
      </div>

      <div className="scada-label" style={{ fontSize: 9, marginBottom: 6 }}>VISTA DE ACOPIO · DÍA {String(refDay).padStart(2, '0')}</div>
      <PileView piles={piles} />

      <div className="matrix-scroll scada-scroll" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'inline-block', minWidth: '100%' }}>
          <DayHeaderRow dayHeaders={dayHeaders} onSelectDay={setRefDay} />
          {rowsEstado.map((row) => (
            <div key={row.sector} style={{ display: 'flex', alignItems: 'stretch' }}>
              <div className="font-mono-scada matrix-sticky-col" style={{ width: 62, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', borderRight: '1px solid #e2e7ef', borderBottom: '1px solid #e2e7ef', fontWeight: 700, fontSize: 10.5, color: '#1a73e8' }}>
                <SectorTag sector={row.sector} />
              </div>
              {row.cells.map((c) => {
                const bg = c.state === 'fresca' && c.isBad ? CONTAM_BG : STATE_BG[c.state];
                return (
                  <div
                    key={c.day}
                    title={`${row.sector} · día ${String(c.day).padStart(2, '0')} · ${c.state}${c.dias ? ' · ' + c.dias + 'd secado' : ''}`}
                    onClick={() => (c.isRef ? cycle(row.sector, c.day - 1) : setRefDay(c.day))}
                    className="matrix-cell"
                    style={{
                      width: 34, height: 30, background: bg, cursor: 'pointer',
                      boxShadow: c.isBad ? 'inset 0 0 0 2px #dc2626' : c.isRef ? 'inset 0 0 0 2px #1a73e8' : 'none',
                      opacity: c.isRef ? 1 : 0.85,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, gradient, border, label }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#54637a', fontWeight: 500 }}>
      <span style={{ width: 13, height: 13, borderRadius: 3, background: gradient || color, border: border ? '1px solid #cdd6e2' : 'none' }} />
      {label}
    </span>
  );
}

const smallBtn = {
  border: '1px solid #e2e7ef', background: '#f6f8fb', color: '#54637a', borderRadius: 4, padding: '5px 10px',
  cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5,
};
