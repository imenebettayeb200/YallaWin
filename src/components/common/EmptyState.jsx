import Icon from "./Icon";

/* EmptyState — icon + title + text (+ a button) shown when a list is empty. */
function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon || "calendar"} size={22}></Icon>
      </span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
