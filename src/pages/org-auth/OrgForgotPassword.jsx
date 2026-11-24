import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrgAuthLayout from '../../components/org-auth/OrgAuthLayout.jsx';
import SecurityNote from '../../components/org-auth/SecurityNote.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import TextField from '../../components/auth/TextField.jsx';
import PasswordField from '../../components/auth/PasswordField.jsx';
import SubmitButton from '../../components/auth/SubmitButton.jsx';
import BackLink from '../../components/auth/BackLink.jsx';
import DemoInbox from '../../components/auth/DemoInbox.jsx';
import IconField from '../../components/create-event/IconField.jsx';
import Icon from '../../components/common/Icon.jsx';
import { maskEmail, useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { findOrganization } from '../../services/orgService.js';

/** /forgot-password/organization — "Recover your organization access". */
export default function OrgForgotPassword() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState('identify');
  const [identifier, setIdentifier] = useState('');
  const [sentTo, setSentTo] = useState(null);
  const [demoCode, setDemoCode] = useState(null);
  const [recoveredId, setRecoveredId] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const sendRecovery = (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = requestPasswordReset(identifier);
      const org = findOrganization(identifier);
      setSentTo(res.email);
      setDemoCode(res.demoCode);
      setRecoveredId(org && org.organizationId ? org.organizationId : '');
      setStep('reset');
    } catch (err) {
      setError(err.message);
    }
  };

  const saveNewPassword = (e) => {
    e.preventDefault();
    setError('');
    try {
      resetPassword(code, password);
      toast.show('Password updated — sign in with your OrganizationID.');
      navigate('/login/organization', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <OrgAuthLayout>
      {step === 'identify' ? (
        <AuthCard className="auth-card-org auth-card-recover" pageTitle="Recover organization access" error={error} onSubmit={sendRecovery}>
          <span className="shield-badge">
            <Icon name="building" size={18} />
          </span>
          <h1 className="auth-title">Recover your organization access</h1>
          <p className="auth-subtitle center">Enter your OrganizationID or admin email. We&apos;ll send recovery steps to the verified admin.</p>
          <IconField label="OrganizationID or admin email" icon="building" placeholder="ORG-FOLLAMOUR-2041" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <SubmitButton>Send recovery email</SubmitButton>
          <SecurityNote icon="verified">For security, only the verified admin can reset access.</SecurityNote>
          <BackLink onClick={() => navigate('/login/organization')}>Back to sign in</BackLink>
        </AuthCard>
      ) : (
        <AuthCard
          className="auth-card-org"
          title="Choose a new password"
          subtitle={sentTo ? `We sent a code to ${maskEmail(sentTo)}. It also contains your OrganizationID.` : 'If this organization exists, its admin received a code.'}
          pageTitle="Recover organization access"
          error={error}
          onSubmit={saveNewPassword}
        >
          <TextField label="6-digit code" inputMode="numeric" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
          <PasswordField label="New password" placeholder="At least 8 characters, letters & numbers" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <SubmitButton>Update password</SubmitButton>
          <div className="auth-divider" />
          <BackLink onClick={() => setStep('identify')}>Use another OrganizationID</BackLink>
        </AuthCard>
      )}
      {step === 'reset' && sentTo && <DemoInbox to={maskEmail(sentTo)} subject={recoveredId ? `Recovery code · your OrganizationID is ${recoveredId}` : 'Your recovery code'} code={demoCode} />}
    </OrgAuthLayout>
  );
}
