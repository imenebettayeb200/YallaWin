import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isValidEmail, passwordError } from "../../utils";
import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import TextField from "../../components/auth/TextField";
import PasswordField from "../../components/auth/PasswordField";
import Checkbox from "../../components/auth/Checkbox";
import SubmitButton from "../../components/auth/SubmitButton";
import AuthFooter from "../../components/auth/AuthFooter";
import InterestPicker from "../../components/auth/InterestPicker";

const emptyForm = { firstName: "", lastName: "", email: "", password: "", confirm: "", interests: [], terms: false };

/* Register — /register. Creates an attendee account (first/last name, email, password, interests). */
function Register({ user, onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace></Navigate>;

  const change = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.firstName.trim().length < 2) newErrors.firstName = "Enter your first name.";
    if (form.lastName.trim().length < 2) newErrors.lastName = "Enter your last name.";
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email address.";
    if (passwordError(form.password)) newErrors.password = passwordError(form.password);
    if (form.confirm !== form.password) newErrors.confirm = "Passwords do not match.";
    if (!form.terms) newErrors.terms = "Please accept the terms to continue.";
    setErrors(newErrors);
    setError("");
    if (Object.keys(newErrors).length > 0) return;

    const problem = onRegister(form);
    if (problem) setError(problem);
    else navigate("/");
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Discover and book the best events in Tunisia."
        error={error}
        onSubmit={handleSubmit}
      >
        <div className="two-cols">
          <TextField
            label="First name"
            placeholder="Sarra"
            autoComplete="given-name"
            value={form.firstName}
            error={errors.firstName}
            onChange={(e) => change("firstName", e.target.value)}
          ></TextField>
          <TextField
            label="Last name"
            placeholder="Ben Ali"
            autoComplete="family-name"
            value={form.lastName}
            error={errors.lastName}
            onChange={(e) => change("lastName", e.target.value)}
          ></TextField>
        </div>
        <TextField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          error={errors.email}
          onChange={(e) => change("email", e.target.value)}
        ></TextField>
        <PasswordField
          placeholder="At least 8 characters, letters & numbers"
          autoComplete="new-password"
          value={form.password}
          error={errors.password}
          onChange={(e) => change("password", e.target.value)}
        ></PasswordField>
        <PasswordField
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          value={form.confirm}
          error={errors.confirm}
          onChange={(e) => change("confirm", e.target.value)}
        ></PasswordField>
        <InterestPicker
          value={form.interests}
          onChange={(interests) => change("interests", interests)}
        ></InterestPicker>
        <Checkbox
          label="I agree to the Terms and Privacy Policy"
          checked={form.terms}
          onChange={(value) => change("terms", value)}
        ></Checkbox>
        {errors.terms && <p className="field-error">{errors.terms}</p>}
        <SubmitButton>Create account</SubmitButton>
        <AuthFooter
          question="Already have an account?"
          linkText="Sign in"
          linkTo="/login"
          switchText="Hosting events for a club or company?"
          switchLinkText="Apply as an organization"
          switchTo="/register/organization"
        ></AuthFooter>
      </AuthCard>
    </AuthLayout>
  );
}

export default Register;
