import Icon from '../common/Icon.jsx';

export default function SubmitButton({ children, disabled = false, muted = false }) {
  return (
    <button type="submit" className={`btn btn-block ${muted ? 'btn-muted' : 'btn-white'}`} disabled={disabled}>
      {children} <Icon name="arrowRight" size={16} />
    </button>
  );
}
