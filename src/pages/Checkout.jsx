import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { checkoutSteps, maxTicketsPerBooking, serviceFeePerTicket } from "../Data";
import { formatShortDate, formatTime, fullName, isUpcoming, isValidEmail } from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Icon from "../components/common/Icon";
import Stepper from "../components/common/Stepper";
import EmptyState from "../components/common/EmptyState";
import QuantityPicker from "../components/common/QuantityPicker";
import TierOptions from "../components/booking/TierOptions";
import DetailsForm from "../components/booking/DetailsForm";
import PaymentPicker from "../components/booking/PaymentPicker";
import OrderSummary from "../components/booking/OrderSummary";

/*
 * Checkout — /checkout/:id/:qty. Booking in 3 steps:
 *  1. Tickets (type + quantity)   2. Your details   3. Payment (Card, D17, Pay at door)
 * "Confirm booking" saves the ticket and opens the "You're going!" page.
 */
function Checkout({ user, events, onLogout, onBook }) {
  const params = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === params.id);
  const firstFreeTier = event ? event.tiers.find((t) => t.quantity - t.sold > 0) : null;

  const [step, setStep] = useState(0);
  const [tierId, setTierId] = useState(firstFreeTier ? firstFreeTier.id : "");
  const [qty, setQty] = useState(Math.max(1, Number(params.qty) || 1));
  const [details, setDetails] = useState({
    name: user ? fullName(user) : "",
    email: user ? user.email : "",
    phone: user ? user.phone : "",
  });
  const [payment, setPayment] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Checkout · YallaWin";
    window.scrollTo(0, 0);
  }, [step]);

  if (!user) return <Navigate to="/login" replace></Navigate>;

  if (!event || !isUpcoming(event) || !firstFreeTier) {
    return (
      <div className="home-page">
        <Background></Background>
        <Navbar user={user} onLogout={onLogout}></Navbar>
        <EmptyState
          icon="ticketPlain"
          title="Tickets are not available"
          text="This event has ended, is sold out or does not exist."
          action={
            <Link to="/" className="btn btn-white">
              Back to all events
            </Link>
          }
        ></EmptyState>
      </div>
    );
  }

  const tier = event.tiers.find((t) => t.id === tierId);
  const left = tier ? tier.quantity - tier.sold : 0;
  const maxQty = Math.min(maxTicketsPerBooking, left);
  const quantity = Math.min(qty, Math.max(1, maxQty));
  const free = tier ? tier.price === 0 : false;
  const fee = free ? 0 : serviceFeePerTicket * quantity;

  /* Checks the current step. Returns { field: message }. */
  const checkStep = () => {
    const found = {};
    if (step === 0 && !tier) found.tier = "Choose a ticket type.";
    if (step === 1) {
      if (details.name.trim().length < 3) found.name = "Enter your full name.";
      if (!isValidEmail(details.email)) found.email = "Enter a valid email address.";
      if (details.phone.replace(/\D/g, "").length < 8) found.phone = "Enter a phone number (8 digits or more).";
    }
    if (step === 2 && !free && payment === "card") {
      if (card.number.replace(/\s/g, "").length !== 16) found.number = "A card number has 16 digits.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) found.expiry = "Use the format MM/YY.";
      if (!/^\d{3}$/.test(card.cvc)) found.cvc = "3 digits on the back of the card.";
    }
    return found;
  };

  const next = () => {
    const found = checkStep();
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    const ticket = onBook({
      eventId: event.id,
      tierId: tier.id,
      qty: quantity,
      payment: free ? "free" : payment,
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone.trim(),
    });
    navigate("/ticket/" + ticket.id, { replace: true });
  };

  let buttonLabel = "Continue";
  if (step === 2) buttonLabel = "Confirm booking";

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>

      <main className="checkout-page">
        {step === 0 ? (
          <Link to={"/event/" + event.id} className="back-link">
            <Icon name="arrowLeft" size={14}></Icon> Back to event
          </Link>
        ) : (
          <button type="button" className="back-link" onClick={() => setStep(step - 1)}>
            <Icon name="arrowLeft" size={14}></Icon> Back
          </button>
        )}

        <Stepper steps={checkoutSteps} current={step}></Stepper>

        <div className="checkout-head">
          <h1>{event.title}</h1>
          <p className="muted">
            {formatShortDate(event.date)} · {formatTime(event.startTime)} · {event.venue}
          </p>
        </div>

        <div className="checkout-grid">
          <div className="checkout-main">
            {step === 0 && (
              <div className="panel form-panel">
                <h2 className="panel-title">Choose your ticket</h2>
                <TierOptions tiers={event.tiers} value={tierId} onChange={setTierId}></TierOptions>
                {errors.tier && <p className="field-error">{errors.tier}</p>}
                <div className="book-row">
                  <span className="field-label">Quantity</span>
                  <QuantityPicker value={quantity} max={maxQty} onChange={setQty}></QuantityPicker>
                </div>
              </div>
            )}
            {step === 1 && <DetailsForm details={details} errors={errors} onChange={setDetails}></DetailsForm>}
            {step === 2 && (
              <PaymentPicker
                method={payment}
                onMethodChange={setPayment}
                card={card}
                onCardChange={setCard}
                errors={errors}
                free={free}
              ></PaymentPicker>
            )}
          </div>
          <OrderSummary
            event={event}
            tier={tier}
            qty={quantity}
            fee={fee}
            buttonLabel={buttonLabel}
            buttonDisabled={!tier}
            onButton={next}
          ></OrderSummary>
        </div>
      </main>
    </div>
  );
}

export default Checkout;
