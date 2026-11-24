import Icon from "../common/Icon";

/* MobileBookBar — bar stuck at the bottom of the event page on phones: "2 tickets · 90 TND [Book]". */
function MobileBookBar({ qty, total, disabled, onBook }) {
  return (
    <div className="mobile-book-bar">
      <div>
        <p className="muted small">{qty} ticket(s)</p>
        <p className="strong">{total === 0 ? "Free" : total + " TND"}</p>
      </div>
      <button type="button" className="btn btn-gradient" onClick={onBook} disabled={disabled}>
        Book <Icon name="arrowRight" size={16}></Icon>
      </button>
    </div>
  );
}

export default MobileBookBar;
