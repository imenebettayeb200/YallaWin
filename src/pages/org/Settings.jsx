import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/layout/PageHeader";
import ProfileForm from "../../components/settings/ProfileForm";
import VerificationCard from "../../components/settings/VerificationCard";
import PasswordForm from "../../components/settings/PasswordForm";
import AccountCard from "../../components/settings/AccountCard";

/* Settings — /org/settings. Organization profile, bank details, verification, password and sign out. */
function Settings({
  user,
  organization,
  notifications,
  onUpdateOrganization,
  onUpdateUser,
  onChangePassword,
  onLogout,
  onResetDemo,
  showToast,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Settings · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  const saveProfile = (values) => {
    onUpdateOrganization(organization.id, {
      name: values.name.trim(),
      city: values.city.trim(),
      bio: values.bio.trim(),
      contactEmail: values.contactEmail.trim(),
      bank: { holder: values.holder.trim(), name: values.bank.trim() },
    });
    onUpdateUser(user.id, { firstName: values.name.trim() });
    showToast("Settings saved.");
  };

  /* Returns true when the password changed (so the form empties itself). */
  const savePassword = (current, next) => {
    const problem = onChangePassword(current, next);
    if (problem) {
      showToast(problem, "error");
      return false;
    }
    showToast("Password updated.");
    return true;
  };

  const signOut = () => {
    onLogout();
    navigate("/", { replace: true });
  };

  const resetDemo = () => {
    if (window.confirm("Reset all data to the demo data? Accounts and events you created will be removed.")) {
      onResetDemo();
      navigate("/", { replace: true });
    }
  };

  const verify = () => {
    onUpdateOrganization(organization.id, { verified: true });
    showToast("Organization verified ✔");
  };

  return (
    <div className="page">
      <PageHeader
        title="Settings"
        subtitle="Your organization profile, payouts and security"
        notifications={notifications}
      ></PageHeader>
      <div className="settings-grid">
        <ProfileForm
          organization={organization}
          onSave={saveProfile}
          onError={(message) => showToast(message, "error")}
        ></ProfileForm>
        <div className="settings-side">
          <VerificationCard verified={organization.verified} onVerify={verify}></VerificationCard>
          <PasswordForm onSubmit={savePassword}></PasswordForm>
          <AccountCard email={user.email} onLogout={signOut} onReset={resetDemo}></AccountCard>
        </div>
      </div>
    </div>
  );
}

export default Settings;
