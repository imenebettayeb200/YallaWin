export default function Logo({ className = '', subtitle = null }) {
  return (
    <div className={`logo ${className}`}>
      <span className="logo-word">YallaWin</span>
      {subtitle && <span className="logo-sub">{subtitle}</span>}
    </div>
  );
}
