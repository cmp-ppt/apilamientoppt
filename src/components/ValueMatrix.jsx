import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';
import { TML } from '../constants';
import { AZU_RANGE } from '../utils/format';
import DayHeaderRow from './DayHeaderRow';
import SectorTag from './SectorTag';
import TrendChart from './TrendChart';

const tmlStr = TML.toString().replace('.', ',');
const HUM_LEGEND = [
  { color: '#1f9d55', label: `< ${tmlStr}% · bajo TML` },
  { color: '#ef9b3a', label: `${(TML + 0.01).toFixed(2).replace('.', ',')} – 9% · límite` },
  { color: '#dc2626', label: '> 9% · sobre TML' },
];
const FE_LEGEND = [
  { color: '#1f9d55', label: '≥ 65,5%' },
  { color: '#8cc63e', label: '65,2 – 65,49%' },
  { color: '#ef9b3a', label: '65,0 – 65,19%' },
  { color: '#dc2626', label: '< 65,0%' },
];
const fmtPct = (n) => n.toString().replace('.', ',');
const azuLegend = (cancha) => {
  const { lo, hi } = AZU_RANGE[cancha] || AZU_RANGE.CNN;
  return [
    { color: '#1f9d55', label: `< ${fmtPct(lo)}%` },
    { color: '#ef9b3a', label: `${fmtPct(lo)} – ${fmtPct(hi)}%` },
    { color: '#dc2626', label: `> ${fmtPct(hi)}%` },
  ];
};

const PARAM = {
  humedad: { title: 'HUMEDAD POR FEEDER', label: 'HUMEDAD', modalTitle: 'Registrar humedad', chartColor: '#1a73e8', chartTitle: 'TENDENCIA DEL MES — HUMEDAD (%)' },
  fe: { title: 'LEY DE FE POR FEEDER', label: 'LEY DE FE', modalTitle: 'Registrar Ley Fe', chartColor: '#1f9d55', chartTitle: 'TENDENCIA DEL MES — LEY DE FE (%)' },
  azu: { title: 'LEY DE AZUFRE POR FEEDER', label: 'LEY DE AZUFRE', modalTitle: 'Registrar Ley de Azufre', chartColor: '#7c3aed', chartTitle: 'TENDENCIA DEL MES — LEY DE AZUFRE (%)' },
};

// Piso minimo de rango para que la linea no se vea plana con poca variacion,
// pero se expande solo si un valor real cae fuera de ese piso.
function domainFor(mode, cancha) {
  if (mode === 'fe') return [(dataMin) => Math.min(64, dataMin - 0.3), (dataMax) => Math.max(66, dataMax + 0.3)];
  if (mode === 'azu') {
    const { hi } = AZU_RANGE[cancha] || AZU_RANGE.CNN;
    return [0, (dataMax) => Math.max(hi * 1.3, (dataMax || 0) * 1.15)];
  }
  return [(dataMin) => Math.min(8, dataMin - 0.3), (dataMax) => Math.max(10, dataMax + 0.3)];
}

function setpointFor(mode, cancha) {
  if (mode === 'fe') return 65.5;
  if (mode === 'azu') return (AZU_RANGE[cancha] || AZU_RANGE.CNN).hi;
  return TML;
}

export default function ValueMatrix({ mode }) {
  const { setModal } = useAcopio();
  const { dayHeaders, rowsHum, rowsFe, rowsAzu, humSeries, feSeries, azuSeries, canchaTitle, cancha } = useCanchaView();
  const rows = mode === 'fe' ? rowsFe : mode === 'azu' ? rowsAzu : rowsHum;
  const series = mode === 'fe' ? feSeries : mode === 'azu' ? azuSeries : humSeries;
  const legend = mode === 'fe' ? FE_LEGEND : mode === 'azu' ? azuLegend(cancha) : HUM_LEGEND;
  const { title, label, modalTitle, chartColor, chartTitle } = PARAM[mode];
  const subtitle = mode === 'fe'
    ? 'Clic en un feeder en acopio para registrar la Ley de Fe (%)'
    : mode === 'azu'
      ? 'Clic en un feeder en acopio para registrar la Ley de Azufre (%)'
      : `Clic en un feeder en acopio para registrar la humedad medida (%) · TML ${tmlStr}%`;

  const openEdit = (sector, idx) => {
    const cell = rows.find((r) => r.sector === sector).cells[idx];
    const dd = String(idx + 1).padStart(2, '0');
    setModal({
      kind: 'hum',
      sector, idx, param: mode, label,
      title: modalTitle,
      subtitle: `${sector} · ${dd} · ${canchaTitle}`,
      initial: cell.measured ? String(cell.value).replace('.', ',') : '',
    });
  };

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div className="matrix-trend-row" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 1 auto', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <div>
              <div className="scada-label" style={{ color: '#182a44', fontSize: 11 }}>{title} — {canchaTitle.toUpperCase()}</div>
              <div style={{ fontSize: 10.5, color: '#54637a', marginTop: 2 }}>{subtitle}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {legend.map((lg) => (
                <span key={lg.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#54637a' }}>
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
                  <div className="font-mono-scada matrix-sticky-col" style={{ width: 62, flex: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px', borderRight: '1px solid #e2e7ef', borderBottom: '1px solid #e2e7ef', fontWeight: 700, fontSize: 10.5, color: '#1a73e8' }}>
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
                        background: c.measured ? c.bg : '#ffffff',
                        color: c.measured ? c.fg : '#9aa7b8',
                        cursor: c.clickable ? 'pointer' : 'default',
                        fontSize: 8.5, fontWeight: c.measured ? 700 : 400,
                        boxShadow: c.isRef ? 'inset 0 0 0 2px #1a73e8' : 'none',
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

        <div style={{ flex: 1, minWidth: 280 }}>
          <TrendChart
            title={chartTitle} data={series} color={chartColor} unit="%" height={260}
            domain={domainFor(mode, cancha)} setpoint={setpointFor(mode, cancha)}
          />
        </div>
      </div>
    </div>
  );
}
