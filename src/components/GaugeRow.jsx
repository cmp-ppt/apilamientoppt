import { useCanchaView } from '../hooks/useDerived';
import { TML } from '../constants';
import { humColor } from '../utils/format';
import Gauge from './Gauge';

export default function GaugeRow() {
  const { occRaw, avgHumRaw, avgFeRaw } = useCanchaView();
  return (
    <div className="scada-panel" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10 }}>
      <Gauge label="OCUPACIÓN" value={occRaw} unit="%" min={0} max={100} color="#00e5ff" />
      <Gauge label="HUMEDAD PROM." value={avgHumRaw} unit="%" min={0} max={14} setpoint={TML} color={avgHumRaw != null ? humColor(avgHumRaw) : '#00e5ff'} />
      <Gauge label="LEY DE FE PROM." value={avgFeRaw} unit="%" min={60} max={70} setpoint={65.5} color="#00e676" />
    </div>
  );
}
