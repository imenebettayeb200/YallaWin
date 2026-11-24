import { NavLink } from "react-router-dom";
import { mobileNav } from "../../Data";
import Icon from "../common/Icon";

/* MobileTabBar — bottom tab bar (Home, Tickets, Host, Profile). The CSS only shows it on phones. */
function MobileTabBar() {
  return (
    <nav className="mobile-tabbar">
      {mobileNav.map((item) => (
        <NavLink key={item.to} to={item.to} end>
          <Icon name={item.icon} size={18}></Icon>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default MobileTabBar;
