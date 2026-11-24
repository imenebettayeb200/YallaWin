import Checkbox from '../auth/Checkbox.jsx';
import WizardCard from './WizardCard.jsx';
import WizardFooter from './WizardFooter.jsx';
import ReviewSection from './ReviewSection.jsx';
import { ORG_DOCUMENTS, ORG_TYPES } from '../../data/data.js';

/** Step 3 — "Review and submit": summary of steps 1 and 2 + terms checkbox. */
export default function ReviewStep({ info, documents, accepted, onAccept, error, submitting, onEditStep, onBack, onSubmit }) {
  const typeLabel = (ORG_TYPES.find((t) => t.key === info.type) || {}).label || '—';
  return (
    <WizardCard
      title="Review and submit"
      intro="Make sure everything is correct. You can still edit before submitting."
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <ReviewSection
        title="Organization"
        onEdit={() => onEditStep(0)}
        rows={[
          ['Name', info.name],
          ['Type', typeLabel],
          ['City', info.city],
          ['Event types', info.eventTypes.join(', ')],
        ]}
      />
      <ReviewSection
        title="Contact"
        onEdit={() => onEditStep(0)}
        rows={[
          ['Admin email', info.adminEmail],
          ['Online presence', info.website],
        ]}
      />
      <ReviewSection
        title="Documents"
        onEdit={() => onEditStep(1)}
        rows={ORG_DOCUMENTS.map((doc) => [doc.short, documents[doc.key] ? '✓ Uploaded' : 'Not provided'])}
      />

      <Checkbox label="I confirm this information is accurate and accept the Organizer Terms" checked={accepted} onChange={onAccept} />
      {error && <p className="field-error">{error}</p>}

      <WizardFooter backLabel="Back" onBack={onBack} nextLabel={submitting ? 'Submitting…' : 'Submit for verification'} nextDisabled={!accepted || submitting} />
    </WizardCard>
  );
}
