import { AcopioProvider, useAcopio } from './store/AcopioContext';
import { useCanchaView, useSFView } from './hooks/useDerived';
import Header from './components/Header';
import TabBar from './components/TabBar';
import KpiStrip from './components/KpiStrip';
import RiskSemaforo from './components/RiskSemaforo';
import EstadoMatrix from './components/EstadoMatrix';
import ValueMatrix from './components/ValueMatrix';
import SinterFeedPanel from './components/SinterFeedPanel';
import TrendPanel from './components/TrendPanel';
import AlarmPanel from './components/AlarmPanel';
import VesselPanel from './components/VesselPanel';
import ShiftLogPanel from './components/ShiftLogPanel';
import PrintShiftSummary from './components/PrintShiftSummary';
import ModalRoot from './components/modals/ModalRoot';

function Dashboard() {
  const { cancha } = useAcopio();
  const isSF = cancha === 'SF';
  const cancha_ = useCanchaView();
  const sf = useSFView();

  return (
    <div id="dash" style={{ minHeight: '100vh', background: '#eef1f6', padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Header />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <TabBar />
      </div>

      {!isSF && <KpiStrip kpis={cancha_.kpis} columns={8} />}
      {!isSF && <RiskSemaforo />}
      {isSF && <KpiStrip kpis={sf.sfKpis} columns={6} />}
      {isSF && <KpiStrip kpis={sf.sfKpisMonth} columns={6} />}

      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 14, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          {!isSF && <EstadoMatrix />}
          {!isSF && <ValueMatrix mode="humedad" />}
          {!isSF && <ValueMatrix mode="fe" />}
          {!isSF && <TrendPanel />}
          {isSF && <SinterFeedPanel />}
        </div>

        <div className="side-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AlarmPanel />
          <ShiftLogPanel />
          <VesselPanel />
        </div>
      </div>

      {!isSF && <PrintShiftSummary />}

      <footer className="no-print" style={{ textAlign: 'center', padding: '10px 0 4px', fontSize: 10, color: '#9aa7b8' }}>
        Dashboard Acopio y Secado v2.1 — Diseñado por Héctor Garrido Pérez
      </footer>

      <ModalRoot />
    </div>
  );
}

export default function App() {
  return (
    <AcopioProvider>
      <Dashboard />
    </AcopioProvider>
  );
}
