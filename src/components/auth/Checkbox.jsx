/* Checkbox — a checkbox with its label. onChange receives true / false. */
function Checkbox({ label, checked, onChange }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export default Checkbox;
