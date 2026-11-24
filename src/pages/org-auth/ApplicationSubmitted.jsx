import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { maskEmail } from "../../utils";
import OrgAuthLayout from "../../components/layout/OrgAuthLayout";
import StatusTimeline from "../../components/org-auth/StatusTimeline";
import DemoInbox from "../../components/auth/DemoInbox";
import Icon from "../../components/common/Icon";

function formatClock(timestamp) {
  const date = new Date(timestamp);
  return "Today, " + String(date.getHours()).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");
}

/*
 * ApplicationSubmitted — /register/organization/submitted/:id. "Application under review".
 * Every second a timer checks if the (simulated) review is over, then the organization
 * is approved and its OrganizationID appears.
 */
function ApplicationSubmitted({ organizations, onApprove, showToast }) {
  const { id } = useParams();
  const [now, setNow] = useState(Date.now());
  const org = organizations.find((o) => o.id === id);

  /* Ticks every second. */
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* Approves the application when the review time is over. */
  useEffect(() => {
    if (org && org.status === "pending" && now >= org.reviewDueAt) onApprove(org.id);
  }, [now]);

  useEffect(() => {
    document.title = "Application under review · YallaWin";
  }, []);

  if (!org) return <Navigate to="/register/organization" replace></Navigate>;

  const approved = org.status === "approved";
  const secondsLeft = Math.max(0, Math.ceil((org.reviewDueAt - now) / 1000));

  const copyId = () => {
    navigator.clipboard.writeText(org.organizationId);
    showToast("OrganizationID copied.");
  };

  return (
    <OrgAuthLayout>
      <section className="wizard-card submitted-card">
        <span className="submitted-badge">
          <Icon name={approved ? "verified" : "shield"} size={22}></Icon>
        </span>
        <h1 className="wizard-title">{approved ? "Your organization is verified" : "Application under review"}</h1>
        <p className="wizard-intro">
          {approved
            ? "Welcome, " + org.name + "! Use your OrganizationID and password to sign in and publish events."
            : "Thanks, " +
              org.name +
              "! Our trust team is checking your documents. We'll email " +
              org.contactEmail +
              " with your OrganizationID once approved."}
        </p>
        <StatusTimeline
          items={[
            { label: "Application submitted", note: formatClock(org.submittedAt || now), state: "done" },
            {
              label: "Document check",
              note: approved ? "Done" : "In progress · usually 24–48h (demo: " + secondsLeft + "s)",
              state: approved ? "done" : "current",
            },
            {
              label: "Approved — OrganizationID issued",
              note: approved ? org.organizationId : "You can then sign in and publish events",
              state: approved ? "done" : "todo",
            },
          ]}
        ></StatusTimeline>
        {approved && (
          <div className="org-id-box">
            <span>
              <span className="org-id-label">Your OrganizationID</span>
              <span className="org-id-value">{org.organizationId}</span>
            </span>
            <button type="button" className="btn btn-outline btn-sm" onClick={copyId}>
              <Icon name="copy" size={13}></Icon> Copy
            </button>
          </div>
        )}
        <Link to="/login/organization" className="btn btn-white submitted-back">
          {approved ? "Sign in now" : "Back to sign in"} <Icon name="arrowRight" size={16}></Icon>
        </Link>
      </section>
      {approved && (
        <DemoInbox
          to={maskEmail(org.contactEmail)}
          subject="You're verified — your OrganizationID"
          code={org.organizationId}
        ></DemoInbox>
      )}
    </OrgAuthLayout>
  );
}

export default ApplicationSubmitted;
