import { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import OrgAuthLayout from '../../components/org-auth/OrgAuthLayout.jsx';
import StatusTimeline from '../../components/org-auth/StatusTimeline.jsx';
import DemoInbox from '../../components/auth/DemoInbox.jsx';
import Icon from '../../components/common/Icon.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDbState } from '../../data/useDb.js';
import useNow from '../../hooks/useNow.js';
import usePageTitle from '../../hooks/usePageTitle.js';
import { approveIfDue } from '../../services/orgService.js';
import { maskEmail } from '../../context/AuthContext.jsx';
import { LAST_APPLICATION_KEY } from './ApplyOrganization.jsx';

function formatClock(iso) {
  const d = new Date(iso);
  const sameDay = d.toDateString() === new Date().toDateString();
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return sameDay ? `Today, ${time}` : `${d.toLocaleDateString('en-GB')}, ${time}`;
}

/** /register/organization/submitted — "Application under review", updated live until approved. */
export default function ApplicationSubmitted() {
  const location = useLocation();
  const toast = useToast();
  const state = useDbState();
  const now = useNow(1000);
  const orgId = (location.state && location.state.orgId) || sessionStorage.getItem(LAST_APPLICATION_KEY);
  const org = state.organizations.find((o) => o.id === orgId);
  const status = org && org.verification ? org.verification.status : null;
  usePageTitle(status === 'approved' ? 'Application approved' : 'Application under review');

  // Every second: approve the application once the (simulated) review time is over.
  useEffect(() => {
    if (org && status === 'pending') approveIfDue(org.id, now);
  }, [now, org, status]);

  if (!org) return <Navigate to="/register/organization" replace />;

  const approved = status === 'approved';
  const secondsLeft = Math.max(0, Math.ceil((new Date(org.verification.reviewDueAt) - now) / 1000));

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(org.organizationId);
      toast.show('OrganizationID copied.');
    } catch {
      toast.show('Copy failed — select the ID and copy it manually.', 'error');
    }
  };

  return (
    <OrgAuthLayout>
      <section className="wizard-card submitted-card">
        <span className="submitted-badge">
          <Icon name={approved ? 'verified' : 'shield'} size={22} />
        </span>
        <h1 className="wizard-title">{approved ? 'Your organization is verified' : 'Application under review'}</h1>
        <p className="wizard-intro">
          {approved
            ? `Welcome, ${org.name}! Use your OrganizationID and password to sign in and publish events.`
            : `Thanks, ${org.name}! Our trust team is checking your documents. We'll email ${org.contactEmail} with your OrganizationID once approved.`}
        </p>

        <StatusTimeline
          items={[
            { label: 'Application submitted', note: formatClock(org.verification.submittedAt), state: 'done' },
            {
              label: 'Document check',
              note: approved ? 'Done' : `In progress · usually 24–48h (demo: ${secondsLeft}s)`,
              state: approved ? 'done' : 'current',
            },
            {
              label: 'Approved — OrganizationID issued',
              note: approved ? org.organizationId : 'You can then sign in and publish events',
              state: approved ? 'done' : 'todo',
            },
          ]}
        />

        {approved && (
          <div className="org-id-box">
            <span>
              <span className="org-id-label">Your OrganizationID</span>
              <span className="org-id-value">{org.organizationId}</span>
            </span>
            <button type="button" className="btn btn-outline btn-sm" onClick={copyId}>
              <Icon name="copy" size={13} /> Copy
            </button>
          </div>
        )}

        <Link to="/login/organization" state={approved ? { organizationId: org.organizationId } : undefined} className="btn btn-white submitted-back">
          {approved ? 'Sign in now' : 'Back to sign in'} <Icon name="arrowRight" size={16} />
        </Link>
      </section>

      {approved && <DemoInbox to={maskEmail(org.contactEmail)} subject="You're verified — your OrganizationID" code={org.organizationId} />}
    </OrgAuthLayout>
  );
}
