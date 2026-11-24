import Icon from "./Icon";

/* StarPicker — 5 clickable stars to choose a rating. */
function StarPicker({ value, onChange, size }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)} aria-label={star + " stars"}>
          <Icon
            name="star"
            size={size || 18}
            filled={star <= value}
            className={star <= value ? "star-on" : "star-off"}
          ></Icon>
        </button>
      ))}
    </div>
  );
}

export default StarPicker;
