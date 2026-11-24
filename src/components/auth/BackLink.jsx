import { Link } from "react-router-dom";
import Icon from "../common/Icon";

/* BackLink — "← Back to sign in". Give "to" for a link or "onClick" for a button. */
function BackLink({ children, to, onClick }) {
  if (to) {
    return (
      <Link to={to} className="back-link">
        <Icon name="arrowLeft" size={14}></Icon> {children}
      </Link>
    );
  }
  return (
    <button type="button" className="back-link" onClick={onClick}>
      <Icon name="arrowLeft" size={14}></Icon> {children}
    </button>
  );
}

export default BackLink;
