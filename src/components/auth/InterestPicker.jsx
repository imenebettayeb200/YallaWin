import { categories } from "../../Data";

/* InterestPicker — "What are you into?" chips. Several can be selected. value = ["Music", ...] */
function InterestPicker({ value, onChange, label }) {
  const toggle = (category) => {
    if (value.includes(category)) onChange(value.filter((c) => c !== category));
    else onChange([...value, category]);
  };

  return (
    <div className="field">
      <span className="field-label">{label || "What are you into?"}</span>
      <div className="chips">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={value.includes(category) ? "chip active" : "chip"}
            onClick={() => toggle(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default InterestPicker;
