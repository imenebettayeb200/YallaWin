import Avatar from "../common/Avatar";
import Icon from "../common/Icon";

/* HostCard — "Hosted by Foll'Amour · Verified organization · 24 events". */
function HostCard({ name, verified, isOrganization, eventCount }) {
  let line = isOrganization ? "Organization" : "YallaWin member";
  if (verified) line = isOrganization ? "Verified organization" : "Verified member";
  return (
    <div className="host-card">
      <Avatar name={name} size={40} square={isOrganization}></Avatar>
      <div>
        <p className="host-name">Hosted by {name}</p>
        <p className="host-meta">
          {verified && <Icon name="verified" size={13}></Icon>} {line} · {eventCount} events
        </p>
      </div>
    </div>
  );
}

export default HostCard;
