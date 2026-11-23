import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import TextField from '../../components/auth/TextField.jsx';
import PasswordField from '../../components/auth/PasswordField.jsx';
import Checkbox from '../../components/auth/Checkbox.jsx';
import SubmitButton from '../../components/auth/SubmitButton.jsx';
import AuthFooter from '../../components/auth/AuthFooter.jsx';
import { homeFor, useAuth } from '../../context/AuthContext.jsx';
import { isValidEmail, ROLES, validatePassword } from '../../models/index.js';

const EMPTY = { orgName: '', name: '', email: '', password: '', confirm: '', terms: false };

function validate(form, isOrg) {
  const errs = {};
  if (isOrg && form.orgName.trim().length < 2) errs.orgName = 'Enter your organization name.';
  if (form.name.trim().length < 2) errs.name = 'Enter your full name.';
  if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
  const pw = validatePassword(form.password);
  if (pw) errs.password = pw;
  if (form.confirm !== form.password) errs.confirm = 'Passwords do not match.';
  if (!form.terms) errs.terms = 'Please accept the terms to continue.';
  return errs;
}

export default function Register({ mode = 'user' }) {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const isOrg = mode === 'org';
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  if (user) return <Navigate to={homeFor(user)} replace />;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form, isOrg);
    setErrors(errs);
    setError('');
    if (Object.keys(errs).length) return;
    try {
      const created = register({ ...form, role: isOrg ? ROLES.ORG : ROLES.USER });
      navigate(homeFor(created), { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title={isOrg ? 'Create an organization account' : 'Create your account'}
        subtitle={isOrg ? 'Host events and sell tickets on YallaWin' : 'Discover and book the best events'}
        error={error}
        onSubmit={handleSubmit}
      >
        {isOrg && <TextField label="Organization name" placeholder="Foll'Amour" value={form.orgName} error={errors.orgName} onChange={set('orgName')} />}
        <TextField label={isOrg ? 'Your full name' : 'Full name'} placeholder="Sarra Ben Ali" autoComplete="name" value={form.name} error={errors.name} onChange={set('name')} />
        <TextField label="Email address" type="email" placeholder="you@example.com" autoComplete="email" value={form.email} error={errors.email} onChange={set('email')} />
        <PasswordField placeholder="At least 8 characters, letters & numbers" autoComplete="new-password" value={form.password} error={errors.password} onChange={set('password')} />
        <PasswordField label="Confirm password" placeholder="Repeat your password" autoComplete="new-password" value={form.confirm} error={errors.confirm} onChange={set('confirm')} />
        <Checkbox label="I agree to the Terms and Privacy Policy" checked={form.terms} onChange={(v) => setForm((f) => ({ ...f, terms: v }))} />
        {errors.terms && <p className="field-error">{errors.terms}</p>}
        <SubmitButton>Create account</SubmitButton>

        <AuthFooter
          question="Already have an account?"
          linkText="Sign in"
          linkTo={isOrg ? '/login/organization' : '/login'}
          switchText={isOrg ? 'Just going to events?' : 'Hosting events for a club or company?'}
          switchLinkText={isOrg ? 'Create an attendee account' : 'Create an organization account'}
          switchTo={isOrg ? '/register' : '/register/organization'}
        />
      </AuthCard>
    </AuthLayout>
  );
}
