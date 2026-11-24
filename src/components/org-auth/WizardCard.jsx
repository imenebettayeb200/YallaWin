/** WizardCard — dark rounded card with a big title and a grey intro text. */
function WizardCard({ title, intro, children, onSubmit }) {
  return (
    <form className="wizard-card" onSubmit={onSubmit} noValidate>
      <h1 className="wizard-title">{title}</h1>
      {intro && <p className="wizard-intro">{intro}</p>}
      {children}
    </form>
  );
}

export default WizardCard;
