import { Link } from "react-router-dom";
import Icon from "../common/Icon";
import Panel from "../common/Panel";

/** "Ready to publish?" list with ✓ / ✗ per requirement. */
function PublishChecklist({ items, heading = "Ready to publish?" }) {
  return (
    <Panel className="checklist" as="div">
      <h3>{heading}</h3>
      <ul>
        {items.map((c) => (
          <li key={c.key} className={c.done ? "done" : "todo"}>
            <Icon name={c.done ? "check" : "x"} size={13} strokeWidth={2.4} />
            {c.link && !c.done ? <Link to={c.link}>{c.label}</Link> : c.label}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default PublishChecklist;
