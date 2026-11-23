import { Link, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import RequireAuth from './components/layout/RequireAuth.jsx';
import { ROLES } from './models/index.js';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import TwoStepVerification from './pages/auth/TwoStepVerification.jsx';
import CreateEvent, { EditEventRoute } from './pages/org/CreateEvent.jsx';
import Events from './pages/org/Events.jsx';
import Overview from './pages/org/Overview.jsx';
import Payouts from './pages/org/Payouts.jsx';
import Reviews from './pages/org/Reviews.jsx';
import Settings from './pages/org/Settings.jsx';
import Home from './pages/home/Home.jsx';

function NotFound() {
  return (
    <div className="fatal-state">
      <h1>Page not found</h1>
      <p>The page you are looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn btn-white">
        Go home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public home page (works signed in or out) */}
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<Navigate to="/" replace />} />

      {/* Authentication */}
      <Route path="/login" element={<Login mode="user" />} />
      <Route path="/login/organization" element={<Login mode="org" />} />
      <Route path="/register" element={<Register mode="user" />} />
      <Route path="/register/organization" element={<Register mode="org" />} />
      <Route path="/verify" element={<TwoStepVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Organization dashboard (requires an organization sign-in) */}
      <Route
        path="/org"
        element={
          <RequireAuth role={ROLES.ORG}>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Overview />} />
        <Route path="events" element={<Events />} />
        <Route path="events/new" element={<CreateEvent key="new" />} />
        <Route path="events/:eventId" element={<EditEventRoute />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="payouts" element={<Payouts />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
