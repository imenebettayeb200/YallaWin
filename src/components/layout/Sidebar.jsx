import { Link, NavLink } from "react-router-dom";
import { orgNav } from "../../Data";
import Icon from "../common/Icon";
import Logo from "../common/Logo";
import SidebarAccount from "./SidebarAccount";

/* Sidebar — left menu of the dashboard. NavLink adds the "active" class to the current page. */
function Sidebar({ organization, onLogout }) {
  return (
    <aside className="sidebar">
      <Link to="/org" className="sidebar-logo">
        <Logo subtitle="FOR ORGANIZATIONS"></Logo>
      </Link>
      <nav className="sidebar-nav">
        {orgNav.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to !== "/org/reviews"} className="nav-item">
            <Icon name={item.icon} size={16}></Icon>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <Link to="/" className="nav-item nav-item-subtle">
        <Icon name="external" size={15}></Icon>
        <span>View home page</span>
      </Link>
      <SidebarAccount organization={organization} onLogout={onLogout}></SidebarAccount>
    </aside>
  );
}

export default Sidebar;
