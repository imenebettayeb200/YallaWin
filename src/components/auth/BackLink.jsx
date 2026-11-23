import Icon from '../common/Icon.jsx';

export default function BackLink({ children, onClick }) {
  return (
    <button type="button" className="back-link" onClick={onClick}>
      <Icon name="arrowLeft" size={14} /> {children}
    </button>
  );
}
