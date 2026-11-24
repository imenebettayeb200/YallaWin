import IconField from '../create-event/IconField.jsx';
import PasswordField from '../auth/PasswordField.jsx';
import WizardCard from './WizardCard.jsx';
import WizardFooter from './WizardFooter.jsx';
import OrgTypeSelect from './OrgTypeSelect.jsx';
import EventTypeChips from './EventTypeChips.jsx';
import { ORG_EVENT_TYPES, ORG_TYPES } from '../../data/data.js';

/** Step 1 — "Tell us about your organization". */
export default function OrgInfoStep({ info, errors, onChange, onCancel, onNext }) {
  const set = (key) => (e) => onChange({ [key]: e.target.value });
  return (
    <WizardCard
      title="Tell us about your organization"
      intro="Verified organizations get a badge, can sell tickets and access the dashboard. This takes about 5 minutes."
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="wizard-grid">
        <IconField label="Organization name" icon="building" placeholder="Foll'Amour" value={info.name} error={errors.name} onChange={set('name')} />
        <IconField label="City" icon="pin" placeholder="Gammarth, Tunis" value={info.city} error={errors.city} onChange={set('city')} />
      </div>

      <OrgTypeSelect options={ORG_TYPES} value={info.type} error={errors.type} onChange={(type) => onChange({ type })} />

      <div className="wizard-grid">
        <IconField label="Website or Instagram" icon="share" placeholder="instagram.com/yourpage" value={info.website} error={errors.website} onChange={set('website')} />
        <IconField label="Admin email" icon="mail" type="email" placeholder="events@yourorg.tn" autoComplete="email" value={info.adminEmail} error={errors.adminEmail} onChange={set('adminEmail')} />
      </div>

      <div className="wizard-grid">
        <PasswordField label="Admin password" placeholder="8+ characters, letters & numbers" autoComplete="new-password" value={info.password} error={errors.password} onChange={set('password')} />
        <PasswordField label="Confirm password" placeholder="Repeat the password" autoComplete="new-password" value={info.confirm} error={errors.confirm} onChange={set('confirm')} />
      </div>

      <EventTypeChips options={ORG_EVENT_TYPES} value={info.eventTypes} error={errors.eventTypes} onChange={(eventTypes) => onChange({ eventTypes })} />

      <WizardFooter backLabel="Cancel" onBack={onCancel} nextLabel="Continue" />
    </WizardCard>
  );
}
