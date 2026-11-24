import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { maskEmail } from "../../utils";
import OrgAuthLayout from "../../components/layout/OrgAuthLayout";
import SecurityNote from "../../components/org-auth/SecurityNote";
import AuthCard from "../../components/auth/AuthCard";
import TextField from "../../components/auth/TextField";
import PasswordField from "../../components/auth/PasswordField";
import SubmitButton from "../../components/auth/SubmitButton";
import BackLink from "../../components/auth/BackLink";
import DemoInbox from "../../components/auth/DemoInbox";
import IconField from "../../components/create-event/IconField";
import Icon from "../../components/common/Icon";

/* OrgForgotPassword — /forgot-password/organization. "Recover your organization access" in 2 steps. */
function OrgForgotPassword({ organizations, resetRequest, onRequestReset, onConfirmReset }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("identify");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const sendRecovery = (e) => {
    e.preventDefault();
    const result = onRequestReset(identifier);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setStep("reset");
  };

  const saveNewPassword = (e) => {
    e.preventDefault();
    const problem = onConfirmReset(code, password);
    if (problem) setError(problem);
    else navigate("/login/organization", { replace: true });
  };

  /* The recovery email also reminds the OrganizationID. */
  let organizationId = "";
  if (resetRequest) {
    const org = organizations.find((o) => o.contactEmail === resetRequest.email);
    if (org && org.organizationId) organizationId = org.organizationId;
  }

  if (step === "identify") {
    return (
      <OrgAuthLayout>
        <AuthCard
          className="auth-card-org auth-card-recover"
          pageTitle="Recover organization access"
          error={error}
          onSubmit={sendRecovery}
        >
          <span className="shield-badge">
            <Icon name="building" size={18}></Icon>
          </span>
          <h1 className="auth-title">Recover your organization access</h1>
          <p className="auth-subtitle center">
            Enter your OrganizationID or admin email. We'll send recovery steps to the verified admin.
          </p>
          <IconField
            label="OrganizationID or admin email"
            icon="building"
            placeholder="ORG-FOLLAMOUR-2041"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          ></IconField>
          <SubmitButton>Send recovery email</SubmitButton>
          <SecurityNote icon="verified">For security, only the verified admin can reset access.</SecurityNote>
          <BackLink to="/login/organization">Back to sign in</BackLink>
        </AuthCard>
      </OrgAuthLayout>
    );
  }

  return (
    <OrgAuthLayout>
      <AuthCard
        className="auth-card-org"
        title="Choose a new password"
        subtitle={
          resetRequest
            ? "We sent a code to " + maskEmail(resetRequest.email) + "."
            : "If this organization exists, its admin received a code."
        }
        pageTitle="Recover organization access"
        error={error}
        onSubmit={saveNewPassword}
      >
        <TextField
          label="6-digit code"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        ></TextField>
        <PasswordField
          label="New password"
          placeholder="At least 8 characters, letters & numbers"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></PasswordField>
        <SubmitButton>Update password</SubmitButton>
        <div className="auth-divider"></div>
        <BackLink onClick={() => setStep("identify")}>Use another OrganizationID</BackLink>
      </AuthCard>
      {resetRequest && (
        <DemoInbox
          to={maskEmail(resetRequest.email)}
          subject={organizationId ? "Recovery code · your OrganizationID is " + organizationId : "Your recovery code"}
          code={resetRequest.code}
        ></DemoInbox>
      )}
    </OrgAuthLayout>
  );
}

export default OrgForgotPassword;
