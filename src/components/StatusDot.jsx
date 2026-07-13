export default function StatusDot({ color, pulse = false, size = 9 }) {
  return (
    <span
      className={pulse ? 'pulse-dot' : ''}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color,
        boxShadow: `0 0 6px ${color}88`,
      }}
    />
  );
}
