import Checkbox from "../auth/Checkbox";
import WizardCard from "./WizardCard";
import WizardFooter from "./WizardFooter";
import ReviewSection from "./ReviewSection";
import { orgDocuments, orgTypes } from "../../Data";

/** Step 3 — "Review and submit": summary of steps 1 and 2 + terms checkbox. */
function ReviewStep({ info, documents, accepted, onAccept, onEditStep, onBack, onSubmit }) {
  const typeLabel = (orgTypes.find((t) => t.key === info.type) || {}).label || "—";
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
          ["Name", info.name],
          ["Type", typeLabel],
          ["City", info.city],
          ["Event types", info.eventTypes.join(", ")],
        ]}
      />
      <ReviewSection
        title="Contact"
        onEdit={() => onEditStep(0)}
        rows={[
          ["Admin email", info.adminEmail],
          ["Online presence", info.website],
        ]}
      />
      <ReviewSection
        title="Documents"
        onEdit={() => onEditStep(1)}
        rows={orgDocuments.map((doc) => [doc.short, documents[doc.key] ? "✓ Uploaded" : "Not provided"])}
      />

      <Checkbox
        label="I confirm this information is accurate and accept the Organizer Terms"
        checked={accepted}
        onChange={onAccept}
      />

      <WizardFooter backLabel="Back" onBack={onBack} nextLabel="Submit for verification" nextDisabled={!accepted} />
    </WizardCard>
  );
}

export default ReviewStep;
