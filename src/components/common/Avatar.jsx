import { initials } from "../../utils";

const colors = ["#e3198c", "#c2187a", "#8e3fe0", "#2f6bff", "#ff7a1a", "#13a89e", "#d6336c"];

/* Avatar — round (or square) bubble with the initials of a name. */
function Avatar({ name, size, square }) {
  const width = size || 30;
  let sum = 0;
  for (let i = 0; i < (name || "").length; i++) sum = sum + name.charCodeAt(i);
  const background = square ? "#2f6bff" : colors[sum % colors.length];
  return (
    <span
      className={square ? "avatar avatar-square" : "avatar"}
      style={{ width: width, height: width, background: background, fontSize: width * 0.36 }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export default Avatar;
