import { paymentMethods } from "../../Data";
import Icon from "../common/Icon";
import TextField from "../auth/TextField";

/*
 * PaymentPicker — step 3 of the checkout: Card, D17 or Pay at door.
 * The card fields are only checked for their format: no real payment happens in this demo.
 */
function PaymentPicker({ method, onMethodChange, card, onCardChange, errors, free }) {
  if (free) {
    return (
      <div className="panel form-panel">
        <h2 className="panel-title">Payment</h2>
        <p className="muted">This ticket is free, nothing to pay. Just confirm your booking.</p>
      </div>
    );
  }

  const change = (key, value) => {
    onCardChange({ ...card, [key]: value });
  };

  return (
    <div className="panel form-panel">
      <h2 className="panel-title">Payment</h2>
      <div className="pay-methods">
        {paymentMethods.map((m) => (
          <button
            key={m.key}
            type="button"
            className={method === m.key ? "pay-method active" : "pay-method"}
            onClick={() => onMethodChange(m.key)}
          >
            <Icon name={m.icon} size={18}></Icon>
            <span className="strong">{m.label}</span>
            <span className="muted small">{m.hint}</span>
          </button>
        ))}
      </div>

      {method === "card" && (
        <>
          <TextField
            label="Card number"
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={card.number}
            error={errors.number}
            onChange={(e) => change("number", e.target.value)}
          ></TextField>
          <div className="two-cols">
            <TextField
              label="Expiry (MM/YY)"
              placeholder="08/28"
              value={card.expiry}
              error={errors.expiry}
              onChange={(e) => change("expiry", e.target.value)}
            ></TextField>
            <TextField
              label="CVC"
              inputMode="numeric"
              placeholder="123"
              value={card.cvc}
              error={errors.cvc}
              onChange={(e) => change("cvc", e.target.value)}
            ></TextField>
          </div>
        </>
      )}
      {method === "d17" && (
        <p className="muted small">
          After you confirm, open the D17 app to accept the payment request sent to your phone number.
        </p>
      )}
      {method === "door" && (
        <p className="muted small">Pay in cash at the entrance. Your spot is kept until the doors open.</p>
      )}
    </div>
  );
}

export default PaymentPicker;
