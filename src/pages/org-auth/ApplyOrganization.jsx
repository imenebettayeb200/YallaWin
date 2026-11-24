import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgAuthLayout from '../../components/org-auth/OrgAuthLayout.jsx';
import Stepper from '../../components/org-auth/Stepper.jsx';
import OrgInfoStep from '../../components/org-auth/OrgInfoStep.jsx';
import DocumentsStep from '../../components/org-auth/DocumentsStep.jsx';
import ReviewStep from '../../components/org-auth/ReviewStep.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ORG_SIGNUP_STEPS } from '../../data/data.js';
import useOrgApplication from '../../hooks/useOrgApplication.js';
import usePageTitle from '../../hooks/usePageTitle.js';
import { submitApplication } from '../../services/orgService.js';

export const LAST_APPLICATION_KEY = 'yw_last_application';

/** /register/organization — "Apply to get verified" in 3 steps. */
export default function ApplyOrganization() {
  const navigate = useNavigate();
  const toast = useToast();
  const app = useOrgApplication();
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  usePageTitle(`Apply · ${ORG_SIGNUP_STEPS[app.step]}`);

  const cancel = () => {
    app.clearDraft();
    navigate('/login/organization');
  };

  const submit = () => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const organization = submitApplication(app.info, app.documents);
      app.clearDraft();
      sessionStorage.setItem(LAST_APPLICATION_KEY, organization.id);
      navigate('/register/organization/submitted', { replace: true, state: { orgId: organization.id } });
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <OrgAuthLayout wide top={<Stepper steps={ORG_SIGNUP_STEPS} current={app.step} />}>
      {app.step === 0 && <OrgInfoStep info={app.info} errors={app.errors} onChange={app.updateInfo} onCancel={cancel} onNext={app.next} />}

      {app.step === 1 && (
        <DocumentsStep
          documents={app.documents}
          eventTypes={app.info.eventTypes}
          errors={app.errors}
          onSelect={(doc, file) => {
            const problem = app.selectDocument(doc, file);
            if (problem) toast.show(problem, 'error');
          }}
          onBack={app.back}
          onNext={app.next}
        />
      )}

      {app.step === 2 && (
        <ReviewStep
          info={app.info}
          documents={app.documents}
          accepted={app.accepted}
          onAccept={app.setAccepted}
          error={submitError}
          submitting={submitting}
          onEditStep={app.goTo}
          onBack={app.back}
          onSubmit={submit}
        />
      )}
    </OrgAuthLayout>
  );
}
