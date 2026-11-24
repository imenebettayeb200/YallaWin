import WizardCard from "./WizardCard";
import WizardFooter from "./WizardFooter";
import DocumentUploadRow from "./DocumentUploadRow";
import SecurityNote from "./SecurityNote";
import { orgDocuments, permitEventTypes } from "../../Data";

/** Step 2 — "Upload your documents". */
function DocumentsStep({ documents, eventTypes, errors, onSelect, onBack, onNext }) {
  /* A venue permit is only needed for nightlife and outdoor events. */
  const isRequired = (doc) => {
    if (doc.required === "permit") return eventTypes.some((type) => permitEventTypes.includes(type));
    return doc.required === true;
  };

  return (
    <WizardCard
      title="Upload your documents"
      intro="We use these only to confirm your organization is real. Files are encrypted and never shown publicly."
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="doc-list">
        {orgDocuments.map((doc) => (
          <DocumentUploadRow
            key={doc.key}
            doc={doc}
            file={documents[doc.key]}
            required={isRequired(doc)}
            error={errors[doc.key]}
            onSelect={(file) => onSelect(doc, file)}
          />
        ))}
      </div>
      <SecurityNote>Your documents are encrypted and reviewed by the YallaWin trust team only.</SecurityNote>
      <WizardFooter backLabel="Back" onBack={onBack} nextLabel="Continue" />
    </WizardCard>
  );
}

export default DocumentsStep;
