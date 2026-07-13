export default function DayHeaderRow({ dayHeaders, onSelectDay, colWidth = 34, labelWidth = 62 }) {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: labelWidth, flex: 'none', position: 'sticky', left: 0, background: '#0f1520', zIndex: 3 }} />
      {dayHeaders.map((d) => (
        <div
          key={d.day}
          onClick={() => onSelectDay(d.day)}
          style={{
            width: colWidth, flex: 'none', textAlign: 'center', padding: '4px 0 5px', cursor: 'pointer',
            borderRight: '1px solid #1a2435', background: d.isRef ? '#131b2a' : 'transparent',
            borderBottom: d.vesselOp ? `2px solid ${d.vesselOp === 'hierro' ? '#448aff' : d.vesselOp === 'cobre' ? '#ffab00' : '#3a4a60'}` : '1px solid #1a2435',
          }}
        >
          <div style={{ fontSize: 8, color: '#3a4a60', fontWeight: 600 }}>{d.dow}</div>
          <div
            className="font-mono-scada"
            style={{
              fontSize: 11, fontWeight: 600, marginTop: 2,
              color: d.isRef ? '#0a0e17' : '#6b7a94',
              background: d.isRef ? '#00e5ff' : 'transparent',
              borderRadius: 3, padding: d.isRef ? '1px 0' : 0,
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
}
