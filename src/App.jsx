import { Link, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import RequireAuth from './components/layout/RequireAuth.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';
import usePageTitle from './hooks/usePageTitle.js';
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
import ApplyOrganization from './pages/org-auth/ApplyOrganization.jsx';
import ApplicationSubmitted from './pages/org-auth/ApplicationSubmitted.jsx';
import OrgForgotPassword from './pages/org-auth/OrgForgotPassword.jsx';
import OrgLogin from './pages/org-auth/OrgLogin.jsx';

function NotFound() {
  usePageTitle('Page not found');
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

/**
 * App — all the routes of YallaWin.
 *   /                    public home page
 *   /login … /verify     authentication (attendees)
 *   /register/organization, /login/organization …   organization sign-up & sign-in
 *   /org/…               organization dashboard (needs an organization account)
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public home page (works signed in or out) */}
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<Navigate to="/" replace />} />

        {/* Authentication — attendees */}
        <Route path="/login" element={<Login mode="user" />} />
        <Route path="/register" element={<Register mode="user" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<TwoStepVerification />} />

        {/* Authentication — organizations (apply → under review → OrganizationID → sign in) */}
        <Route path="/register/organization" element={<ApplyOrganization />} />
        <Route path="/register/organization/submitted" element={<ApplicationSubmitted />} />
        <Route path="/login/organization" element={<OrgLogin />} />
        <Route path="/forgot-password/organization" element={<OrgForgotPassword />} />

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
    </>
  );
}