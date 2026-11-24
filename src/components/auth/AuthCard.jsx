import { useEffect } from "react";

/* AuthCard — the glass card (form) used by every sign-in screen. Also sets the browser tab title. */
function AuthCard({ title, subtitle, error, onSubmit, className, pageTitle, children }) {
  useEffect(() => {
    document.title = (pageTitle || title) + " · YallaWin";
  }, [pageTitle, title]);

  return (
    <form className={"auth-card " + (className || "")} onSubmit={onSubmit} noValidate>
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

export default AuthCard;
