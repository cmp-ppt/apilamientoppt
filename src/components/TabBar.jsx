import { useAcopio } from '../store/AcopioContext';

const TABS = [
  { key: 'CNN', label: 'ACOPIO CNN', sub: '6 feeders' },
  { key: 'PM', label: 'ACOPIO MAGNETITA', sub: '5 feeders' },
  { key: 'SF', label: 'SINTER FEED', sub: '6 feeders' },
];

export default function TabBar() {
  const { cancha, setCancha } = useAcopio();

  return (
    <div className="tab-bar" style={{ display: 'flex', gap: 6, background: '#0f1520', border: '1px solid #1a2435', padding: 4, borderRadius: 4, flexWrap: 'wrap' }}>
      {TABS.map((t) => {
        const active = cancha === t.key;
        return (
          <button
            key={t.key}
            onClick={() => setCancha(t.key)}
            className="font-mono-scada"
            style={{
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: 0.5,
              background: active ? '#131b2a' : 'transparent',
              color: active ? '#00e5ff' : '#6b7a94',
              boxShadow: active ? 'inset 0 0 0 1px #00e5ff44, 0 0 8px #00e5ff22' : 'none',
              transition: 'all .15s',
            }}
          >
            {t.label} <span style={{ opacity: 0.55, fontWeight: 500 }}>· {t.sub}</span>
          </button>
        );
      })}
    </div>
  );
}
