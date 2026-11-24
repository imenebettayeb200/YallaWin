import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { maskEmail } from "../../utils";
import AuthLayout from "../../components/layout/AuthLayout";
import OrgAuthLayout from "../../components/layout/OrgAuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import OtpInput from "../../components/auth/OtpInput";
import SubmitButton from "../../components/auth/SubmitButton";
import BackLink from "../../components/auth/BackLink";
import DemoInbox from "../../components/auth/DemoInbox";
import Icon from "../../components/common/Icon";

const emptyCode = ["", "", "", "", "", ""];

/*
 * TwoStepVerification — /verify. Second step of every sign in: the 6-digit code.
 * Organizations see the blue version, attendees the colourful one.
 */
function TwoStepVerification({ user, pendingLogin, onVerify, onResend, onCancel }) {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(emptyCode);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(30);

  /* Counts down 1 second at a time until "Resend code" can be clicked again. */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (user) return <Navigate to={user.role === "org" ? "/org" : "/"} replace></Navigate>;
  if (!pendingLogin) return <Navigate to="/login" replace></Navigate>;

  const isOrg = pendingLogin.role === "org";
  const code = digits.join("");
  const loginPage = isOrg ? "/login/organization" : "/login";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length < 6) return;
    const problem = onVerify(code);
    if (problem) {
      setError(problem);
      setDigits(emptyCode);
    } else {
      navigate(isOrg ? "/org" : "/", { replace: true });
    }
  };

  const handleResend = () => {
    onResend();
    setCooldown(30);
    setError("");
    setDigits(emptyCode);
  };

  const goBack = () => {
    onCancel();
    navigate(loginPage);
  };

  const card = (
    <AuthCard
      className={isOrg ? "auth-card-2fa auth-card-org" : "auth-card-2fa"}
      pageTitle="Two-step verification"
      onSubmit={handleSubmit}
    >
      <span className="shield-badge">
        <Icon name="shield" size={18}></Icon>
      </span>
      <h1 className="auth-title">Two-step verification</h1>
      <p className="auth-subtitle center">
        For your security, we sent a 6-digit code to {maskEmail(pendingLogin.email)}.
      </p>
      <p className="field-label">Enter the 6-digit code</p>
      <OtpInput
        value={digits}
        hasError={error !== ""}
        onChange={(next) => {
          setError("");
          setDigits(next);
        }}
      ></OtpInput>
      {error && <p className="field-error">{error}</p>}
      <p className="resend">
        {cooldown > 0 ? (
          "Resend code in 0:" + String(cooldown).padStart(2, "0")
        ) : (
          <>
            Didn't get it?{" "}
            <button type="button" className="link-blue link-button" onClick={handleResend}>
              Resend code
            </button>
          </>
        )}
      </p>
      <SubmitButton disabled={code.length < 6} muted={code.length < 6}>
        Verify and continue
      </SubmitButton>
      <div className="auth-divider"></div>
      <BackLink onClick={goBack}>Back to sign in</BackLink>
    </AuthCard>
  );
  const inbox = (
    <DemoInbox
      to={maskEmail(pendingLogin.email)}
      subject="Your YallaWin verification code"
      code={pendingLogin.code}
    ></DemoInbox>
  );

  if (isOrg) {
    return (
      <OrgAuthLayout>
        {card}
        {inbox}
      </OrgAuthLayout>
    );
  }
  return (
    <AuthLayout>
      {card}
      {inbox}
    </AuthLayout>
  );
}

export default TwoStepVerification;
