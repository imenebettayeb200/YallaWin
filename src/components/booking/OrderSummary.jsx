import { formatShortDate, formatTime, formatTND } from "../../utils";
import Icon from "../common/Icon";

/* OrderSummary — right card of the checkout: event, "2 × General admission", service fee, total and the button. */
function OrderSummary({ event, tier, qty, fee, buttonLabel, buttonDisabled, onButton }) {
  const subtotal = tier ? tier.price * qty : 0;
  return (
    <aside className="panel order-summary">
      <h2 className="panel-title">{event.title}</h2>
      <p className="muted small">
        {formatShortDate(event.date)} · {formatTime(event.startTime)} · {event.venue}
      </p>
      <div className="summary-lines">
        <p>
          <span>
            {qty} × {tier ? tier.name : "Choose a ticket"}
          </span>
          <span>{formatTND(subtotal)}</span>
        </p>
        <p>
          <span>Service fee</span>
          <span>{formatTND(fee)}</span>
        </p>
        <p className="summary-total">
          <span>Total</span>
          <span>{formatTND(subtotal + fee)}</span>
        </p>
      </div>
      <button type="button" className="btn btn-gradient btn-block" onClick={onButton} disabled={buttonDisabled}>
        {buttonLabel} <Icon name="arrowRight" size={16}></Icon>
      </button>
      <p className="muted small center">Free cancellation up to 24h before the event.</p>
    </aside>
  );
}

export default OrderSummary;
