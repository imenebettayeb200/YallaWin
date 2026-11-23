import { useCallback, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import useClickOutside from '../../hooks/useClickOutside.js';

/** Pill button with a menu. options: [{ key, label }]; the first option means "no filter". */
export default function Dropdown({ label, value, options, onChange, icon = 'chevronDown' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, open, close);

  const current = options.find((o) => o.key === value) || options[0];
  const isDefault = value === options[0].key;

  return (
    <div className="popover-wrap" ref={ref}>
      <button type="button" className={`filter-pill ${isDefault ? '' : 'active'}`} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {isDefault ? label : current.label} <Icon name={icon} size={13} />
      </button>
      {open && (
        <div className="popover popover-right" role="menu">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              role="menuitemradio"
              aria-checked={o.key === value}
              className={`popover-item ${o.key === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(o.key);
                setOpen(false);
              }}
            >
              {o.label}
              {o.key === value && <Icon name="check" size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
