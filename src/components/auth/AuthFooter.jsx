import { Link } from "react-router-dom";
import Icon from "../common/Icon";

/* AuthFooter — "New to YallaWin? Create account" + the switch between attendee and organization. */
function AuthFooter({ question, linkText, linkTo, switchText, switchLinkText, switchTo }) {
  return (
    <>
      <p className="auth-switch">
        {question}{" "}
        <Link to={linkTo} className="link-blue">
          {linkText} <Icon name="external" size={11}></Icon>
        </Link>
      </p>
      <div className="auth-divider"></div>
      <p className="auth-footer">
        {switchText}{" "}
        <Link to={switchTo} className="link-underline">
          {switchLinkText}
        </Link>
      </p>
    </>
  );
}

export default AuthFooter;
