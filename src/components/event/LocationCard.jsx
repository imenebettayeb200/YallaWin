import { directionsUrl } from "../../utils";
import Icon from "../common/Icon";

/* LocationCard — venue, address, a small map picture and the "Directions" button (opens Google Maps). */
function LocationCard({ event }) {
  return (
    <section className="detail-section">
      <h2>Location</h2>
      <div className="location-card panel">
        <div className="map-box" aria-hidden="true">
          <span className="map-pin">
            <Icon name="pin" size={22}></Icon>
          </span>
        </div>
        <div className="location-text">
          <p className="strong">{event.venue}</p>
          <p className="muted small">{event.address}</p>
          <a href={directionsUrl(event)} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
            <Icon name="pin" size={14}></Icon> Directions
          </a>
        </div>
      </div>
    </section>
  );
}

export default LocationCard;
