import { useRef } from 'react';
import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';
import DayHeaderRow from './DayHeaderRow';
import PileView from './PileView';
import SectorTag from './SectorTag';
import { lerpColor } from '../utils/color';
import { DIAS_RECOMENDADOS } from '../constants';

const STATE_BG = { fresca: '#448aff', secado: '#00e676', libre: '#131b2a' };
const STATE_LABEL = { fresca: 'FRESCA', secado: 'SECADO', libre: 'LIBRE' };
const CONTAM_BG = 'repeating-linear-gradient(45deg,#448aff,#448aff 4px,#ff1744 4px,#ff1744 6px)';

export default function EstadoMatrix() {
  const { cycle, setRefDay, requestReset, refDay, importExcel, setModal } = useAcopio();
  const { dayHeaders, rowsEstado, canchaTitle, contamTotal, tons, refIdx } = useCanchaView();
  const fileRef = useRef(null);

  const piles = rowsEstado.map((row) => {
    const cell = row.cells[refIdx];
    const color = cell.state === 'secado'
      ? lerpColor('#448aff', '#00e676', Math.min(1, (cell.dias || 0) / DIAS_RECOMENDADOS))
      : STATE_BG[cell.state];
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
          <div className="scada-label" style={{ color: '#e0e6f0', fontSize: 11 }}>OCUPACIÓN POR FEEDER — {canchaTitle.toUpperCase()}</div>
          <div style={{ fontSize: 10.5, color: '#6b7a94', marginTop: 2 }}>Selecciona un día (columna cian) y haz clic en la celda para cambiar el estado · rayado = fresca sobre secado</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="no-print" onClick={requestReset} style={smallBtn}>BORRAR DÍA {String(refDay).padStart(2, '0')}</button>
          <button className="no-print" onClick={() => fileRef.current?.click()} title="Importar humedad y Ley Fe desde Excel — solo se aplican a feeders en acopio fresco" style={{ ...smallBtn, background: '#448aff', color: '#0a0e17', borderColor: '#448aff' }}>IMPORTAR EXCEL</button>
          <input ref={fileRef} type="file" accept=".xlsx" onChange={onImport} style={{ display: 'none' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
        <Legend color="#448aff" label="Acopio fresca" />
        <Legend color="#00e676" label="Secado" />
        <Legend color="#131b2a" border label="Libre" />
        <Legend gradient={CONTAM_BG} label={`Acopio sobre secado (${contamTotal})`} />
      </div>

      <div className="scada-label" style={{ fontSize: 9, marginBottom: 6 }}>VISTA DE ACOPIO · DÍA {String(refDay).padStart(2, '0')}</div>
      <PileView piles={piles} />

      <div className="matrix-scroll scada-scroll" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'inline-block', minWidth: '100%' }}>
          <DayHeaderRow dayHeaders={dayHeaders} onSelectDay={setRefDay} />
          {rowsEstado.map((row) => (
            <div key={row.sector} style={{ display: 'flex', alignItems: 'stretch' }}>
              <div className="font-mono-scada matrix-sticky-col" style={{ width: 62, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', borderRight: '1px solid #1a2435', borderBottom: '1px solid #1a2435', fontWeight: 700, fontSize: 10.5, color: '#00e5ff' }}>
                <SectorTag sector={row.sector} />
              </div>
              {row.cells.map((c) => {
                const bg = c.state === 'fresca' && c.isBad
                  ? CONTAM_BG
                  : c.state === 'secado'
                    ? lerpColor('#448aff', '#00e676', Math.min(1, (c.dias || 0) / DIAS_RECOMENDADOS))
                    : STATE_BG[c.state];
                return (
                  <div
                    key={c.day}
                    title={`${row.sector} · día ${String(c.day).padStart(2, '0')} · ${c.state}${c.dias ? ' · ' + c.dias + 'd secado' : ''}`}
                    onClick={() => (c.isRef ? cycle(row.sector, c.day - 1) : setRefDay(c.day))}
                    className="matrix-cell"
                    style={{
                      width: 34, height: 30, background: bg, cursor: 'pointer',
                      boxShadow: c.isBad ? 'inset 0 0 0 2px #ff1744' : c.isRef ? 'inset 0 0 0 2px #00e5ff' : 'none',
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
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7a94', fontWeight: 500 }}>
      <span style={{ width: 13, height: 13, borderRadius: 3, background: gradient || color, border: border ? '1px solid #3a4a60' : 'none' }} />
      {label}
    </span>
  );
}

const smallBtn = {
  border: '1px solid #1a2435', background: '#131b2a', color: '#6b7a94', borderRadius: 4, padding: '5px 10px',
  cursor: 'pointer', fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 0.5,
};
