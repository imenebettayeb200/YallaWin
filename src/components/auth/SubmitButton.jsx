import Icon from "../common/Icon";

/* SubmitButton — the big white "Sign in →" button of the forms. */
function SubmitButton({ children, disabled, muted }) {
  return (
    <button type="submit" className={muted ? "btn btn-block btn-muted" : "btn btn-block btn-white"} disabled={disabled}>
      {children} <Icon name="arrowRight" size={16}></Icon>
    </button>
  );
}

export default SubmitButton;
