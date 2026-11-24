import { Link } from "react-router-dom";
import { maxTicketsPerBooking } from "../../Data";
import { eventCapacity, minPrice, spotsLeft } from "../../utils";
import Icon from "../common/Icon";
import QuantityPicker from "../common/QuantityPicker";

/*
 * BookBox — price box of the event page: "From 45 TND", quantity, spots left, Book now,
 * heart and share. myTicket = the user's booking for this event (or null).
 */
function BookBox({ event, status, qty, onQtyChange, onBook, liked, onLike, onShare, myTicket }) {
  const left = spotsLeft(event);
  const price = minPrice(event);
  const canBook = status === "on_sale" || status === "almost_full";

  return (
    <aside className="book-box panel">
      <p className="muted small">From</p>
      <p className="book-price">{price === 0 ? "Free" : price + " TND"}</p>

      {canBook && (
        <div className="book-row">
          <QuantityPicker
            value={qty}
            max={Math.min(maxTicketsPerBooking, left)}
            onChange={onQtyChange}
          ></QuantityPicker>
          <span className="muted small">
            {left} of {eventCapacity(event)} spots left
          </span>
        </div>
      )}
      {status === "sold_out" && <p className="text-red small">Sold out — all tickets are gone.</p>}
      {status === "ended" && <p className="muted small">This event has ended.</p>}

      <div className="book-actions">
        <button type="button" className="btn btn-gradient" onClick={onBook} disabled={!canBook}>
          {price === 0 ? "Reserve" : "Book now"} <Icon name="arrowRight" size={16}></Icon>
        </button>
        <button type="button" className={liked ? "round-btn liked" : "round-btn"} onClick={onLike} aria-label="Like">
          <Icon name="heart" size={16} filled={liked}></Icon>
        </button>
        <button type="button" className="round-btn" onClick={onShare} aria-label="Share">
          <Icon name="share" size={16}></Icon>
        </button>
      </div>

      {myTicket && (
        <Link to={"/ticket/" + myTicket.id} className="book-going">
          <Icon name="check" size={14}></Icon> You're going · {myTicket.qty} ticket(s) · View ticket
        </Link>
      )}
    </aside>
  );
}

export default BookBox;
