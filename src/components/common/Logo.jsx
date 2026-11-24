import { appName } from "../../Data";

/* Logo — "YallaWin" in the italic serif font (+ an optional small subtitle). */
function Logo({ className, subtitle }) {
  return (
    <div className={"logo " + (className || "")}>
      <span className="logo-word">{appName}</span>
      {subtitle && <span className="logo-sub">{subtitle}</span>}
    </div>
  );
}

export default Logo;
