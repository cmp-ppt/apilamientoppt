import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';
import DayHeaderRow from './DayHeaderRow';
import SectorTag from './SectorTag';

const HUM_LEGEND = [
  { color: '#00e676', label: '< 8,4% · bajo TML' },
  { color: '#ffab00', label: '8,41 – 9% · límite' },
  { color: '#ff1744', label: '> 9% · sobre TML' },
];
const FE_LEGEND = [
  { color: '#00e676', label: '≥ 65,5%' },
  { color: '#8cc63e', label: '65,2 – 65,49%' },
  { color: '#ffab00', label: '65,0 – 65,19%' },
  { color: '#ff1744', label: '< 65,0%' },
];

export default function ValueMatrix({ mode }) {
  const { setModal } = useAcopio();
  const { dayHeaders, rowsHum, rowsFe, canchaTitle } = useCanchaView();
  const isFe = mode === 'fe';
  const rows = isFe ? rowsFe : rowsHum;
  const legend = isFe ? FE_LEGEND : HUM_LEGEND;
  const title = isFe ? 'LEY DE FE POR FEEDER' : 'HUMEDAD POR FEEDER';
  const subtitle = isFe ? 'Clic en un feeder en acopio para registrar la Ley de Fe (%)' : 'Clic en un feeder en acopio para registrar la humedad medida (%) · TML 8,4%';

  const openEdit = (sector, idx) => {
    const cell = rows.find((r) => r.sector === sector).cells[idx];
    const dd = String(idx + 1).padStart(2, '0');
    setModal({
      kind: 'hum',
      sector, idx, isFe,
      title: isFe ? 'Registrar Ley Fe' : 'Registrar humedad',
      subtitle: `${sector} · ${dd} · ${canchaTitle}`,
      initial: cell.measured ? String(cell.value).replace('.', ',') : '',
    });
  };

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="scada-label" style={{ color: '#e0e6f0', fontSize: 11 }}>{title} — {canchaTitle.toUpperCase()}</div>
          <div style={{ fontSize: 10.5, color: '#6b7a94', marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {legend.map((lg) => (
            <span key={lg.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#6b7a94' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: lg.color }} />
              {lg.label}
            </span>
          ))}
        </div>
      </div>

      <div className="matrix-scroll scada-scroll" style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'inline-block', minWidth: '100%' }}>
          <DayHeaderRow dayHeaders={dayHeaders} onSelectDay={() => {}} />
          {rows.map((row) => (
            <div key={row.sector} style={{ display: 'flex', alignItems: 'stretch' }}>
              <div className="font-mono-scada matrix-sticky-col" style={{ width: 62, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', borderRight: '1px solid #1a2435', borderBottom: '1px solid #1a2435', fontWeight: 700, fontSize: 10.5, color: '#00e5ff' }}>
                <SectorTag sector={row.sector} />
              </div>
              {row.cells.map((c) => (
                <div
                  key={c.day}
                  title={c.measured ? `${row.sector} · día ${String(c.day).padStart(2, '0')} · ${c.text}%` : c.clickable ? 'sin registro — clic para ingresar' : 'libre'}
                  onClick={c.clickable ? () => openEdit(row.sector, c.day - 1) : undefined}
                  className="matrix-cell font-mono-scada"
                  style={{
                    width: 34, height: 30,
                    background: c.measured ? c.bg : '#131b2a',
                    color: c.measured ? c.fg : '#3a4a60',
                    cursor: c.clickable ? 'pointer' : 'default',
                    fontSize: 8.5, fontWeight: c.measured ? 700 : 400,
                    boxShadow: c.isRef ? 'inset 0 0 0 2px #00e5ff' : 'none',
                  }}
                >
                  {c.text}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
