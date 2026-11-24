import { useState } from "react";
import Icon from "./Icon";

/*
 * Dropdown — pill button that opens a small menu (City, Sort...).
 * options: [{ key, label }]. The first option means "no filter".
 * Clicking anywhere outside the menu closes it (the invisible backdrop).
 */
function Dropdown({ label, value, options, onChange, icon }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.key === value) || options[0];
  const isDefault = value === options[0].key;

  const choose = (key) => {
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="popover-wrap">
      <button type="button" className={isDefault ? "filter-pill" : "filter-pill active"} onClick={() => setOpen(!open)}>
        {isDefault ? label : current.label} <Icon name={icon || "chevronDown"} size={13}></Icon>
      </button>
      {open && <div className="popover-backdrop" onClick={() => setOpen(false)}></div>}
      {open && (
        <div className="popover popover-right" role="menu">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              className={o.key === value ? "popover-item selected" : "popover-item"}
              onClick={() => choose(o.key)}
            >
              {o.label}
              {o.key === value && <Icon name="check" size={13}></Icon>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
