import Icon from '../common/Icon.jsx';

/** SecurityNote — small grey bar with an icon, e.g. "Your documents are encrypted…". */
export default function SecurityNote({ icon = 'lock', children }) {
  return (
    <p className="security-note">
      <Icon name={icon} size={13} />
      <span>{children}</span>
    </p>
  );
}
