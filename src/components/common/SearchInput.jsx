import Icon from "./Icon";

/* SearchInput — text box with a magnifier icon. */
function SearchInput({ value, onChange, placeholder, className }) {
  return (
    <label className={className || "search-input"}>
      <Icon name="search" size={15}></Icon>
      <input
        type="search"
        placeholder={placeholder || "Search"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default SearchInput;
