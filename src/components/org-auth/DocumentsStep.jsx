import WizardCard from './WizardCard.jsx';
import WizardFooter from './WizardFooter.jsx';
import DocumentUploadRow from './DocumentUploadRow.jsx';
import SecurityNote from './SecurityNote.jsx';
import { ORG_DOCUMENTS } from '../../data/data.js';
import { isDocumentRequired } from '../../services/orgService.js';

/** Step 2 — "Upload your documents". */
export default function DocumentsStep({ documents, eventTypes, errors, onSelect, onBack, onNext }) {
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
        {ORG_DOCUMENTS.map((doc) => (
          <DocumentUploadRow
            key={doc.key}
            doc={doc}
            file={documents[doc.key]}
            required={isDocumentRequired(doc, eventTypes)}
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
