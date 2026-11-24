import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { maskEmail, passwordError } from "../../utils";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import TextField from "../../components/auth/TextField";
import PasswordField from "../../components/auth/PasswordField";
import SubmitButton from "../../components/auth/SubmitButton";
import BackLink from "../../components/auth/BackLink";
import DemoInbox from "../../components/auth/DemoInbox";
import OtpInput from "../../components/auth/OtpInput";
import Icon from "../../components/common/Icon";

const emptyCode = ["", "", "", "", "", ""];

/*
 * ForgotPassword — /forgot-password, in 2 steps:
 *  1. "Reset your password": type your email
 *  2. "Check your inbox": type the 6-digit code + a new password
 */
function ForgotPassword({ resetRequest, onRequestReset, onResend, onConfirmReset }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(emptyCode);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = (e) => {
    e.preventDefault();
    const result = onRequestReset(email);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError("");
    setStep("code");
    setCooldown(42);
  };

  const resend = () => {
    onResend();
    setCooldown(42);
    setDigits(emptyCode);
  };

  const saveNewPassword = (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      setError("Enter the 6 digits of the code.");
      return;
    }
    if (passwordError(password)) {
      setError(passwordError(password));
      return;
    }
    const problem = onConfirmReset(code, password);
    if (problem) setError(problem);
    else navigate("/login", { replace: true });
  };

  if (step === "email") {
    return (
      <AuthLayout>
        <AuthCard
          title="Reset your password"
          subtitle="We'll email you a code to choose a new password."
          error={error}
          onSubmit={sendCode}
        >
          <TextField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></TextField>
          <SubmitButton>Send code</SubmitButton>
          <div className="auth-divider"></div>
          <BackLink to="/login">Back to sign in</BackLink>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard className="auth-card-2fa" pageTitle="Check your inbox" error={error} onSubmit={saveNewPassword}>
        <span className="shield-badge">
          <Icon name="mail" size={18}></Icon>
        </span>
        <h1 className="auth-title">Check your inbox</h1>
        <p className="auth-subtitle center">If an account exists, we sent a 6-digit code to {email}.</p>
        <OtpInput value={digits} hasError={false} onChange={setDigits}></OtpInput>
        <PasswordField
          label="New password"
          placeholder="At least 8 characters, letters & numbers"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></PasswordField>
        <SubmitButton>Reset password</SubmitButton>
        <p className="resend">
          Didn't get it?{" "}
          {cooldown > 0 ? (
            "Resend in 0:" + String(cooldown).padStart(2, "0")
          ) : (
            <button type="button" className="link-blue link-button" onClick={resend}>
              Resend code
            </button>
          )}
        </p>
        <BackLink onClick={() => setStep("email")}>Use another email</BackLink>
      </AuthCard>
      {resetRequest && (
        <DemoInbox
          to={maskEmail(resetRequest.email)}
          subject="Reset your YallaWin password"
          code={resetRequest.code}
        ></DemoInbox>
      )}
    </AuthLayout>
  );
}

export default ForgotPassword;
