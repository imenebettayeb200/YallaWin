import { Link } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import Panel from '../common/Panel.jsx';

/** "Ready to publish?" list with ✓ / ✗ per requirement. */
export default function PublishChecklist({ items, heading = 'Ready to publish?' }) {
  return (
    <Panel className="checklist" as="div">
      <h3>{heading}</h3>
      <ul>
        {items.map((c) => (
          <li key={c.key} className={c.done ? 'done' : 'todo'}>
            <Icon name={c.done ? 'check' : 'x'} size={13} strokeWidth={2.4} />
            {c.key === 'verified' && !c.done ? <Link to="/org/settings">{c.label}</Link> : c.label}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
