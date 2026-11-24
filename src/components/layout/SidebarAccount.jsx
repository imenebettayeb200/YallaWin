import Avatar from "../common/Avatar";
import Icon from "../common/Icon";

/* SidebarAccount — organization name, "Verified" badge and the sign-out button (bottom of the sidebar). */
function SidebarAccount({ organization, onLogout }) {
  return (
    <div className="sidebar-account">
      <Avatar name={organization.name} size={32} square></Avatar>
      <div className="sidebar-account-text">
        <span className="sidebar-account-name">{organization.name}</span>
        {organization.verified ? (
          <span className="verified">
            <Icon name="verified" size={12}></Icon> Verified
          </span>
        ) : (
          <span className="unverified">Not verified</span>
        )}
      </div>
      <button type="button" className="icon-btn ghost" onClick={onLogout} aria-label="Sign out" title="Sign out">
        <Icon name="logout" size={16}></Icon>
      </button>
    </div>
  );
}

export default SidebarAccount;
