import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';

/** "New to YallaWin? Create account" + divider + the organization / attendee switch. */
export default function AuthFooter({ question, linkText, linkTo, switchText, switchLinkText, switchTo, externalIcon = false }) {
  return (
    <>
      <p className="auth-switch">
        {question}{' '}
        <Link to={linkTo} className="link-blue">
          {linkText} {externalIcon && <Icon name="external" size={11} />}
        </Link>
      </p>
      <div className="auth-divider" />
      <p className="auth-footer">
        {switchText}{' '}
        <Link to={switchTo} className="link-underline">
          {switchLinkText}
        </Link>
      </p>
    </>
  );
}
