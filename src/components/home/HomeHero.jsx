import { APP_NAME } from '../../data/data.js';
import { formatLongToday } from '../../utils/format.js';

/** "Welcome back, Name" (or "Welcome to YallaWin" for visitors) + a live clock and top picks. */
export default function HomeHero({ user, now, liveCount = 0, searching = false, children }) {
  const when = now ? formatLongToday(now) : '';
  return (
    <section className="home-hero">
      <h1>
        {user ? 'Welcome back, ' : 'Welcome to '}
        <em>{user ? user.name.split(' ')[0] : APP_NAME}</em>
      </h1>
      <p className="hero-live">
        <span className="live-dot" aria-hidden="true" />
        {searching ? 'Updating results…' : `${when} · ${liveCount} events on sale`}
      </p>
      <div className="divider-label">
        <span>TOP PICKS FOR YOU</span>
      </div>
      {children}
      <div className="divider-short" />
    </section>
  );
}
