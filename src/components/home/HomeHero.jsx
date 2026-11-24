import { appName } from "../../Data";
import { formatLongDate, todayIso } from "../../utils";

/* HomeHero — "Welcome back, Sarra" (or "Welcome to YallaWin"), today's date and the top picks (children). */
function HomeHero({ user, liveCount, children }) {
  return (
    <section className="home-hero">
      <h1>
        {user ? "Welcome back, " : "Welcome to "}
        <em>{user ? user.firstName : appName}</em>
      </h1>
      <p className="hero-live">
        <span className="live-dot" aria-hidden="true"></span>
        {formatLongDate(todayIso())} · {liveCount} events on sale
      </p>
      <div className="divider-label">
        <span>{user ? "TOP PICKS FOR YOU" : "TOP PICKS"}</span>
      </div>
      {children}
      <div className="divider-short"></div>
    </section>
  );
}

export default HomeHero;
