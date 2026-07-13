import FeederIcon from './FeederIcon';

// Small feeder glyph + label, used for the sticky row headers in the day-by-day matrices.
export default function SectorTag({ sector, color = '#1a73e8' }) {
  return (
    <>
      <svg viewBox="0 0 16 15" width="13" height="13" style={{ flex: 'none' }}>
        <FeederIcon x={8} y={0} size={13} color={color} />
      </svg>
      {sector}
    </>
  );
}
