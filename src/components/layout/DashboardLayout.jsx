import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

export default function DashboardLayout() {
  return (
    <div className="dash">
      <Sidebar />
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  );
}
