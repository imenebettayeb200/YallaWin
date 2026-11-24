import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { demoAccounts } from "../../Data";
import OrgAuthLayout from "../../components/layout/OrgAuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import TextField from "../../components/auth/TextField";
import PasswordField from "../../components/auth/PasswordField";
import SubmitButton from "../../components/auth/SubmitButton";
import Icon from "../../components/common/Icon";

/* OrgLogin — /login/organization. "Sign in with your OrganizationID" (the admin email also works). */
function OrgLogin({ user, onLogin }) {
  const navigate = useNavigate();
  const [organizationId, setOrganizationId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  if (user) return <Navigate to={user.role === "org" ? "/org" : "/"} replace></Navigate>;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!organizationId.trim()) newErrors.organizationId = "Enter your OrganizationID.";
    if (!password) newErrors.password = "Enter your password.";
    setErrors(newErrors);
    setError("");
    if (Object.keys(newErrors).length > 0) return;

    const problem = onLogin(organizationId, password, true);
    if (problem) setError(problem);
    else navigate("/verify");
  };

  const useDemo = () => {
    setOrganizationId(demoAccounts.org.organizationId);
    setPassword(demoAccounts.org.password);
  };

  return (
    <OrgAuthLayout>
      <AuthCard
        className="auth-card-org"
        title="Sign in with your OrganizationID"
        subtitle="Log in to access your organization"
        pageTitle="Organization sign in"
        error={error}
        onSubmit={handleSubmit}
      >
        <TextField
          label="OrganizationID"
          placeholder="ORG-YOURNAME-1234"
          autoComplete="username"
          value={organizationId}
          error={errors.organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
        ></TextField>
        <PasswordField
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        ></PasswordField>
        <SubmitButton>Sign in</SubmitButton>
        <div className="org-links">
          <Link to="/forgot-password/organization" className="link-blue">
            Forgot OrganizationID or password? <Icon name="external" size={11}></Icon>
          </Link>
          <Link to="/register/organization" className="link-blue">
            Apply to get Verified <Icon name="external" size={11}></Icon>
          </Link>
        </div>
        <div className="auth-divider"></div>
        <p className="auth-footer">
          Not an organization?{" "}
          <Link to="/login" className="link-underline">
            Sign in as a user
          </Link>
        </p>
        <div className="demo-row">
          <button type="button" className="demo-fill" onClick={useDemo}>
            Use demo organization ({demoAccounts.org.organizationId})
          </button>
        </div>
      </AuthCard>
    </OrgAuthLayout>
  );
}

export default OrgLogin;
