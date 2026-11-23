import { initials } from '../../utils/format.js';

const COLORS = ['#e3198c', '#c2187a', '#8e3fe0', '#2f6bff', '#ff7a1a', '#13a89e', '#d6336c'];

export default function Avatar({ name = '', size = 30, square = false }) {
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const bg = square ? '#2f6bff' : COLORS[h % COLORS.length];
  return (
    <span
      className={`avatar ${square ? 'avatar-square' : ''}`}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
