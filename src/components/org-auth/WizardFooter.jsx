import Icon from "../common/Icon";

/** WizardFooter — text button on the left (Cancel / Back), white pill on the right (Continue / Submit). */
function WizardFooter({ backLabel, onBack, nextLabel, nextDisabled = false }) {
  return (
    <div className="wizard-footer">
      <button type="button" className="wizard-back" onClick={onBack}>
        {backLabel}
      </button>
      <button type="submit" className="btn btn-white wizard-next" disabled={nextDisabled}>
        {nextLabel} <Icon name="arrowRight" size={16} />
      </button>
    </div>
  );
}

export default WizardFooter;
