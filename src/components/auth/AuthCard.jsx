import usePageTitle from '../../hooks/usePageTitle.js';

/** Glass card used by every auth screen. Also sets the browser tab title. */
export default function AuthCard({ title, subtitle, error, onSubmit, className = '', pageTitle, children }) {
  usePageTitle(pageTitle || title);
  return (
    <form className={`auth-card ${className}`} onSubmit={onSubmit} noValidate>
      {title && <h1 className="auth-title">{title}</h1>}
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      {error && (
        <div className="form-alert" role="alert">
          {error}
        </div>
      )}
      {children}
    </form>
  );
}