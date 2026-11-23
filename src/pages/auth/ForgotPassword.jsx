import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import TextField from '../../components/auth/TextField.jsx';
import PasswordField from '../../components/auth/PasswordField.jsx';
import SubmitButton from '../../components/auth/SubmitButton.jsx';
import BackLink from '../../components/auth/BackLink.jsx';
import DemoInbox from '../../components/auth/DemoInbox.jsx';
import { maskEmail, useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function ForgotPassword() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [demoCode, setDemoCode] = useState(null);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRequest = (e) => {
    e.preventDefault();
    setError('');
    try {
      setDemoCode(requestPasswordReset(email).demoCode);
      setStep('reset');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    try {
      resetPassword(code, password);
      toast.show('Password updated — you can sign in now.');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AuthLayout>
      {step === 'email' ? (
        <AuthCard title="Reset your password" subtitle="We'll email you a code to choose a new password" error={error} onSubmit={handleRequest}>
          <TextField label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <SubmitButton>Send code</SubmitButton>
          <div className="auth-divider" />
          <BackLink onClick={() => navigate('/login')}>Back to sign in</BackLink>
        </AuthCard>
      ) : (
        <AuthCard title="Choose a new password" subtitle={`If an account exists for ${email}, a code is on its way.`} error={error} onSubmit={handleReset}>
          <TextField label="6-digit code" inputMode="numeric" maxLength={6} placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
          <PasswordField label="New password" placeholder="At least 8 characters, letters & numbers" value={password} onChange={(e) => setPassword(e.target.value)} />
          <SubmitButton>Update password</SubmitButton>
          <div className="auth-divider" />
          <BackLink onClick={() => setStep('email')}>Use another email</BackLink>
        </AuthCard>
      )}
      {step === 'reset' && <DemoInbox to={maskEmail(email)} subject="Reset your YallaWin password" code={demoCode} />}
    </AuthLayout>
  );
}
