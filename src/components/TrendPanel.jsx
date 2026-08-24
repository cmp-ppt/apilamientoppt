import { useMemo } from 'react';
import { useAcopio } from '../store/AcopioContext';
import { useCanchaView } from '../hooks/useDerived';
import { daysInMonth } from '../utils/format';
import { TML } from '../constants';
import TrendChart from './TrendChart';

function seriesFor(store, month, cancha, shift, sectors, dim) {
  const days = [];
  for (let i = 0; i < dim; i++) {
    const vals = sectors.map((s) => store?.[month]?.[cancha]?.[shift]?.[s]?.[i]).filter((v) => v != null && !isNaN(v)).map(Number);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    days.push({ day: String(i + 1).padStart(2, '0'), value: avg != null ? Math.round(avg * 100) / 100 : null });
  }
  return days;
}

export default function TrendPanel() {
  const { month, cancha, shift, hum, fe } = useAcopio();
  const { sectors } = useCanchaView();
  const dim = daysInMonth(month);

  const humSeries = useMemo(() => seriesFor(hum, month, cancha, shift, sectors, dim), [hum, month, cancha, shift, sectors, dim]);
  const feSeries = useMemo(() => seriesFor(fe, month, cancha, shift, sectors, dim), [fe, month, cancha, shift, sectors, dim]);

  // Piso minimo de rango (8-10 / 64-66) para que la linea no se vea plana con poca
  // variacion, pero se expande solo si un valor real cae fuera de ese piso.
  const humDomain = [(dataMin) => Math.min(8, dataMin - 0.3), (dataMax) => Math.max(10, dataMax + 0.3)];
  const feDomain = [(dataMin) => Math.min(64, dataMin - 0.3), (dataMax) => Math.max(66, dataMax + 0.3)];

  return (
    <div className="scada-panel" style={{ padding: '12px 14px' }}>
      <div className="scada-label" style={{ marginBottom: 10 }}>TENDENCIA DEL MES</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <TrendChart title="HUMEDAD PROMEDIO (%)" data={humSeries} color="#1a73e8" setpoint={TML} unit="%" domain={humDomain} />
        <TrendChart title="LEY DE FE PROMEDIO (%)" data={feSeries} color="#1f9d55" unit="%" domain={feDomain} setpoint={65.5} />
      </div>
    </div>
  );
}
