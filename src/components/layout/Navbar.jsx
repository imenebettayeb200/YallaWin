import { Link, NavLink } from "react-router-dom";
import { userNav } from "../../Data";
import Icon from "../common/Icon";
import Logo from "../common/Logo";
import SearchInput from "../common/SearchInput";
import UserMenu from "./UserMenu";
import MobileTabBar from "./MobileTabBar";

/*
 * Navbar — top bar of the attendee pages: logo · Home / Going To / My Events · search · account.
 * The search box is only shown when the page gives onSearch (the home page).
 * On phones the links move to the bottom tab bar (MobileTabBar).
 */
function Navbar({ user, onLogout, search, onSearch }) {
  return (
    <>
      <header className="home-nav">
        <Link to="/" aria-label="YallaWin home">
          <Logo className="home-logo"></Logo>
        </Link>

        <nav className="home-tabs">
          {userNav.map((item) => (
            <NavLink key={item.to} to={item.to} end>
              <Icon name={item.icon} size={13}></Icon> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="home-nav-right">
          {onSearch && (
            <SearchInput
              className="home-search"
              placeholder="Search events"
              value={search}
              onChange={onSearch}
            ></SearchInput>
          )}
          {user && user.role === "org" && (
            <Link to="/org" className="btn btn-gradient btn-nav">
              Dashboard <Icon name="arrowRight" size={14}></Icon>
            </Link>
          )}
          {user ? (
            <UserMenu user={user} onLogout={onLogout}></UserMenu>
          ) : (
            <>
              <Link to="/login" className="btn btn-white btn-nav">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-outline btn-nav hide-mobile">
                Create account
              </Link>
            </>
          )}
        </div>
      </header>
      <MobileTabBar></MobileTabBar>
    </>
  );
}

export default Navbar;
