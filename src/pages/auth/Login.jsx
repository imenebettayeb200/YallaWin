import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import TextField from "../../components/auth/TextField";
import PasswordField from "../../components/auth/PasswordField";
import SubmitButton from "../../components/auth/SubmitButton";
import AuthFooter from "../../components/auth/AuthFooter";
import DemoAccounts from "../../components/auth/DemoAccounts";

/* Login — /login. Email + password, then the 6-digit code page (/verify). */
function Login({ user, onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  if (user) return <Navigate to={user.role === "org" ? "/org" : "/"} replace></Navigate>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!isValidEmail(email)) newErrors.email = "Enter a valid email address.";
    if (!password) newErrors.password = "Enter your password.";
    setErrors(newErrors);
    setError("");
    if (Object.keys(newErrors).length > 0) return;

    const problem = onLogin(email, password, false);
    if (problem) setError(problem);
    else navigate("/verify");
  };

  const pickDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Sign in to your account"
        subtitle="Log in with your email and password"
        error={error}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        ></TextField>
        <PasswordField
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
          labelExtra={
            <Link to="/forgot-password" className="link-blue small">
              Forgot password?
            </Link>
          }
        ></PasswordField>
        <SubmitButton>Sign in</SubmitButton>
        <AuthFooter
          question="New to YallaWin?"
          linkText="Create account"
          linkTo="/register"
          switchText="Hosting events for a club or company?"
          switchLinkText="Sign in as an organization"
          switchTo="/login/organization"
        ></AuthFooter>
        <DemoAccounts onPick={pickDemo}></DemoAccounts>
      </AuthCard>
    </AuthLayout>
  );
}

export default Login;
