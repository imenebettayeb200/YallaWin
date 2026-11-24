import { eventImage } from "../../utils";

/* EventThumb — small square picture of an event (tables, lists). */
function EventThumb({ event, size }) {
  const width = size || 40;
  return <img className="event-thumb" src={eventImage(event)} alt="" style={{ width: width, height: width }} />;
}

export default EventThumb;
