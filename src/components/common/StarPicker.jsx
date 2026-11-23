import Icon from './Icon.jsx';

export default function StarPicker({ value, onChange, size = 18 }) {
  return (
    <div className="star-picker" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" role="radio" aria-checked={value === s} onClick={() => onChange(s)} aria-label={`${s} stars`}>
          <Icon name="star" size={size} filled={s <= value} className={s <= value ? 'star-on' : 'star-off'} />
        </button>
      ))}
    </div>
  );
}
