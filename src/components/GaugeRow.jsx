import { useCanchaView } from '../hooks/useDerived';
import { TML } from '../constants';
import { humCellColor, feColor } from '../utils/format';
import Gauge from './Gauge';

export default function GaugeRow() {
  const { occRaw, avgHumRaw, avgFeRaw } = useCanchaView();
  return (
    <div className="scada-panel" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 10 }}>
      <Gauge label="OCUPACIÓN" value={occRaw} unit="%" min={0} max={100} color="#1a73e8" />
      <Gauge label="HUMEDAD PROM." value={avgHumRaw} unit="%" min={0} max={14} setpoint={TML} color={avgHumRaw != null ? humCellColor(avgHumRaw).bg : '#1a73e8'} />
      <Gauge label="LEY DE FE PROM." value={avgFeRaw} unit="%" min={60} max={70} setpoint={65.5} color={avgFeRaw != null ? feColor(avgFeRaw).bg : '#1a73e8'} />
    </div>
  );
}
