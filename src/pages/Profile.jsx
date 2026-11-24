import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { fullName } from "../utils";
import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Avatar from "../components/common/Avatar";
import Icon from "../components/common/Icon";
import TextField from "../components/auth/TextField";
import InterestPicker from "../components/auth/InterestPicker";
import PasswordForm from "../components/settings/PasswordForm";

/* Profile — /profile. The attendee's name, phone, interests and password, plus sign out. */
function Profile({ user, tickets, reviews, onLogout, onUpdateUser, onChangePassword, showToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: user ? user.firstName : "",
    lastName: user ? user.lastName : "",
    phone: user ? user.phone : "",
    interests: user ? user.interests : [],
  });

  useEffect(() => {
    document.title = "My profile · YallaWin";
    window.scrollTo(0, 0);
  }, []);

  if (!user) return <Navigate to="/login" replace></Navigate>;
  if (user.role === "org") return <Navigate to="/org/settings" replace></Navigate>;

  const ticketCount = tickets.filter((t) => t.userId === user.id && t.status === "confirmed").length;
  const reviewCount = reviews.filter((r) => r.userId === user.id).length;

  const change = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const save = (e) => {
    e.preventDefault();
    if (form.firstName.trim().length < 2 || form.lastName.trim().length < 2) {
      showToast("Enter your first and last name.", "error");
      return;
    }
    const phoneChanged = form.phone.trim() !== user.phone;
    onUpdateUser(user.id, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      interests: form.interests,
      phoneVerified: phoneChanged ? false : user.phoneVerified,
    });
    showToast("Profile saved.");
  };

  /* Demo: a real app would send an SMS code before marking the phone as verified. */
  const verifyPhone = () => {
    if (form.phone.replace(/\D/g, "").length < 8) {
      showToast("Add a phone number first.", "error");
      return;
    }
    onUpdateUser(user.id, { phone: form.phone.trim(), phoneVerified: true });
    showToast("Phone number verified ✔ You can now host paid events.");
  };

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
    navigate("/");
  };

  return (
    <div className="home-page">
      <Background></Background>
      <Navbar user={user} onLogout={onLogout}></Navbar>
      <main className="going-page">
        <div className="profile-head">
          <Avatar name={fullName(user)} size={72}></Avatar>
          <div>
            <h1 className="big-title">{fullName(user)}</h1>
            <p className="muted">
              {user.email} · {ticketCount} booking(s) · {reviewCount} review(s)
            </p>
          </div>
        </div>

        <div className="settings-grid">
          <form className="panel form-panel" onSubmit={save}>
            <h2 className="panel-title">Your information</h2>
            <div className="two-cols">
              <TextField
                label="First name"
                value={form.firstName}
                onChange={(e) => change("firstName", e.target.value)}
              ></TextField>
              <TextField
                label="Last name"
                value={form.lastName}
                onChange={(e) => change("lastName", e.target.value)}
              ></TextField>
            </div>
            <TextField
              label="Phone"
              type="tel"
              placeholder="+216 22 345 678"
              value={form.phone}
              onChange={(e) => change("phone", e.target.value)}
            ></TextField>
            {user.phoneVerified ? (
              <p className="verified">
                <Icon name="verified" size={14}></Icon> Phone number verified
              </p>
            ) : (
              <button type="button" className="btn btn-outline btn-sm" onClick={verifyPhone}>
                <Icon name="shield" size={14}></Icon> Verify my phone number
              </button>
            )}
            <InterestPicker
              label="Your interests (used for your top picks)"
              value={form.interests}
              onChange={(value) => change("interests", value)}
            ></InterestPicker>
            <button type="submit" className="btn btn-white">
              Save changes
            </button>
          </form>

          <div className="settings-side">
            <div className="panel form-panel">
              <h2 className="panel-title">Shortcuts</h2>
              <Link to="/going" className="popover-item">
                <Icon name="ticketPlain" size={15}></Icon> My tickets
              </Link>
              <Link to="/my-events" className="popover-item">
                <Icon name="sparkle" size={15}></Icon> Events I host
              </Link>
              <button type="button" className="popover-item" onClick={signOut}>
                <Icon name="logout" size={15}></Icon> Sign out
              </button>
            </div>
            <PasswordForm onSubmit={savePassword}></PasswordForm>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
