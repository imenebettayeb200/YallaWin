import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import ProfileForm from '../../components/settings/ProfileForm.jsx';
import VerificationCard from '../../components/settings/VerificationCard.jsx';
import PasswordForm from '../../components/settings/PasswordForm.jsx';
import AccountCard from '../../components/settings/AccountCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { db } from '../../data/db.js';

export default function Settings() {
  const { organization, user, changePassword, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const showError = (message) => toast.show(message, 'error');

  const saveProfile = (v) => {
    try {
      db.update('organizations', organization.id, {
        name: v.name.trim(),
        city: v.city.trim(),
        bio: v.bio.trim(),
        contactEmail: v.contactEmail.trim(),
        payoutMethod: { holder: v.holder.trim(), bank: v.bank.trim() },
      });
      db.update('users', user.id, { name: v.name.trim() });
      toast.show('Settings saved.');
    } catch (err) {
      showError(err.message);
    }
  };

  const savePassword = (current, next) => {
    try {
      changePassword(current, next);
      toast.show('Password updated.');
      return true;
    } catch (err) {
      showError(err.message);
      return false;
    }
  };

  const signOut = () => {
    logout();
    navigate('/', { replace: true });
  };

  const resetDemo = () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Reset all data to the demo seed? Accounts you created will be removed.')) return;
    db.reset();
    signOut();
  };

  return (
    <div className="page">
      <PageHeader title="Settings" subtitle="Your organization profile, payouts and security" />
      <div className="settings-grid">
        <ProfileForm organization={organization} onSave={saveProfile} onError={showError} />
        <div className="settings-side">
          <VerificationCard
            verified={organization.verified}
            onVerify={() => {
              db.update('organizations', organization.id, { verified: true });
              toast.show('Organization verified ✔');
            }}
          />
          <PasswordForm onSubmit={savePassword} />
          <AccountCard email={user.email} onLogout={signOut} onReset={resetDemo} />
        </div>
      </div>
    </div>
  );
}
