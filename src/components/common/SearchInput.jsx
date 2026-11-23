import Icon from './Icon.jsx';

export default function SearchInput({ value, onChange, placeholder = 'Search', inputRef = null, className = 'search-input' }) {
  return (
    <label className={className}>
      <Icon name="search" size={15} />
      <input ref={inputRef} type="search" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
