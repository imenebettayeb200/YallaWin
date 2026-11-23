/** "Welcome back, Name" (or "Welcome to YallaWin" for visitors) + "TOP PICKS FOR YOU" divider. */
export default function HomeHero({ user, children }) {
  return (
    <section className="home-hero">
      <h1>
        {user ? 'Welcome back, ' : 'Welcome to '}
        <em>{user ? user.name.split(' ')[0] : 'YallaWin'}</em>
      </h1>
      <div className="divider-label">
        <span>TOP PICKS FOR YOU</span>
      </div>
      {children}
      <div className="divider-short" />
    </section>
  );
}
