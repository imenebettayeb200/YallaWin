import { useEffect, useState } from 'react';
import { checkDocumentFile, validateDocuments, validateOrgInfo } from '../services/orgService.js';

const DRAFT_KEY = 'yw_org_application_draft';

const EMPTY_INFO = {
  name: '',
  city: '',
  type: 'company',
  website: '',
  adminEmail: '',
  password: '',
  confirm: '',
  eventTypes: [],
};

function loadDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    if (!saved) return null;
    return { ...saved, info: { ...EMPTY_INFO, ...saved.info } };
  } catch {
    return null;
  }
}

/**
 * useOrgApplication — state of the 3-step "Apply to get verified" wizard.
 *
 * useState  holds the current step, the form, the uploaded documents and the errors.
 * useEffect saves a draft in sessionStorage on every change, so a refresh does not
 *           lose the progress (passwords are never saved in the draft).
 */
export default function useOrgApplication() {
  const [draft] = useState(loadDraft); // read the saved draft once
  const [step, setStep] = useState(draft ? draft.step : 0);
  const [info, setInfo] = useState(draft ? draft.info : EMPTY_INFO);
  const [documents, setDocuments] = useState(draft ? draft.documents : {});
  const [errors, setErrors] = useState({});
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const { password, confirm, ...safeInfo } = info;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, info: { ...safeInfo, password: '', confirm: '' }, documents }));
  }, [step, info, documents]);

  // After a refresh the passwords are empty: send the user back to step 1 to type them again.
  useEffect(() => {
    if (step > 0 && !info.password) setStep(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateInfo = (patch) => {
    setInfo((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((k) => delete next[k]);
      return next;
    });
  };

  /** Keeps only the file name and size (the file itself is not stored). Returns an error message or ''. */
  const selectDocument = (doc, file) => {
    const problem = checkDocumentFile(file, doc);
    if (problem) {
      setErrors((e) => ({ ...e, [doc.key]: problem }));
      return problem;
    }
    setDocuments((d) => ({ ...d, [doc.key]: { name: file.name, size: file.size, type: file.type } }));
    setErrors((e) => {
      const next = { ...e };
      delete next[doc.key];
      return next;
    });
    return '';
  };

  /** Validates the current step and moves forward. Returns true when it moved. */
  const next = () => {
    const stepErrors = step === 0 ? validateOrgInfo(info) : step === 1 ? validateDocuments(documents, info.eventTypes) : {};
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length) return false;
    setStep((s) => Math.min(2, s + 1));
    return true;
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const goTo = (target) => {
    setErrors({});
    setStep(target);
  };

  const clearDraft = () => sessionStorage.removeItem(DRAFT_KEY);

  return { step, info, documents, errors, accepted, setAccepted, updateInfo, selectDocument, next, back, goTo, clearDraft };
}