import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

/*
 * DashboardLayout — frame of the organization dashboard: sidebar on the left,
 * the current page (<Outlet />) on the right.
 * It also protects the dashboard: only a signed-in organization can enter.
 */
function DashboardLayout({ user, organization, onLogout }) {
  if (!user) return <Navigate to="/login/organization" replace></Navigate>;
  if (user.role !== "org" || !organization) return <Navigate to="/" replace></Navigate>;

  return (
    <div className="dash">
      <Sidebar organization={organization} onLogout={onLogout}></Sidebar>
      <main className="dash-main">
        <Outlet></Outlet>
      </main>
    </div>
  );
}

export default DashboardLayout;
