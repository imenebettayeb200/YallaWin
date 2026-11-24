import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { maxDocumentMb, orgDocuments, orgSignupSteps, orgTypes, permitEventTypes } from "../../Data";
import { isValidEmail, passwordError } from "../../utils";
import OrgAuthLayout from "../../components/layout/OrgAuthLayout";
import Stepper from "../../components/common/Stepper";
import OrgInfoStep from "../../components/org-auth/OrgInfoStep";
import DocumentsStep from "../../components/org-auth/DocumentsStep";
import ReviewStep from "../../components/org-auth/ReviewStep";

const emptyInfo = {
  name: "",
  city: "",
  type: "company",
  website: "",
  adminEmail: "",
  password: "",
  confirm: "",
  eventTypes: [],
};

/*
 * ApplyOrganization — /register/organization. "Apply to get verified" in 3 steps:
 * 1. Organization info   2. Documents   3. Review and submit
 */
function ApplyOrganization({ users, onApply }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState(emptyInfo);
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    document.title = "Apply · " + orgSignupSteps[step] + " · YallaWin";
    window.scrollTo(0, 0);
  }, [step]);

  const changeInfo = (changes) => {
    setInfo({ ...info, ...changes });
  };

  /* Step 1 checks. Returns { field: message }. */
  const checkInfo = () => {
    const found = {};
    if (info.name.trim().length < 2) found.name = "Enter your organization name.";
    if (info.city.trim().length < 2) found.city = "Enter your city.";
    if (!orgTypes.some((t) => t.key === info.type)) found.type = "Choose your organization type.";
    if (info.website.trim().length < 4) found.website = "Add your website or Instagram.";
    if (!isValidEmail(info.adminEmail)) found.adminEmail = "Enter a valid email address.";
    else if (users.some((u) => u.email === info.adminEmail.trim().toLowerCase()))
      found.adminEmail = "An account already uses this email.";
    if (info.eventTypes.length === 0) found.eventTypes = "Pick at least one kind of event.";
    if (passwordError(info.password)) found.password = passwordError(info.password);
    if (info.confirm !== info.password) found.confirm = "Passwords do not match.";
    return found;
  };

  /* Step 2 checks: every required document must be uploaded. */
  const checkDocuments = () => {
    const needsPermit = info.eventTypes.some((type) => permitEventTypes.includes(type));
    const found = {};
    orgDocuments.forEach((doc) => {
      const required = doc.required === true || (doc.required === "permit" && needsPermit);
      if (required && !documents[doc.key]) found[doc.key] = "This document is required.";
    });
    return found;
  };

  const next = () => {
    const found = step === 0 ? checkInfo() : checkDocuments();
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(step + 1);
  };

  const back = () => {
    setErrors({});
    setStep(step - 1);
  };

  /* Keeps only the file name and size: the file itself is not stored in this demo. */
  const selectDocument = (doc, file) => {
    if (!file) return;
    let problem = "";
    if (file.size > maxDocumentMb * 1024 * 1024) problem = "File is too large (max " + maxDocumentMb + " MB).";
    else if (!/^(application\/pdf|image\/(png|jpe?g))$/.test(file.type)) problem = "Use a PDF, JPG or PNG file.";
    else if (doc.key === "logo" && file.type === "application/pdf") problem = "Use a JPG or PNG image.";
    if (problem) {
      setErrors({ ...errors, [doc.key]: problem });
      return;
    }
    setDocuments({ ...documents, [doc.key]: { name: file.name, size: file.size } });
    setErrors({ ...errors, [doc.key]: "" });
  };

  const submit = () => {
    const org = onApply(info, documents);
    navigate("/register/organization/submitted/" + org.id, { replace: true });
  };

  return (
    <OrgAuthLayout wide top={<Stepper steps={orgSignupSteps} current={step}></Stepper>}>
      {step === 0 && (
        <OrgInfoStep
          info={info}
          errors={errors}
          onChange={changeInfo}
          onCancel={() => navigate("/login/organization")}
          onNext={next}
        ></OrgInfoStep>
      )}
      {step === 1 && (
        <DocumentsStep
          documents={documents}
          eventTypes={info.eventTypes}
          errors={errors}
          onSelect={selectDocument}
          onBack={back}
          onNext={next}
        ></DocumentsStep>
      )}
      {step === 2 && (
        <ReviewStep
          info={info}
          documents={documents}
          accepted={accepted}
          onAccept={setAccepted}
          onEditStep={setStep}
          onBack={back}
          onSubmit={submit}
        ></ReviewStep>
      )}
    </OrgAuthLayout>
  );
}

export default ApplyOrganization;
