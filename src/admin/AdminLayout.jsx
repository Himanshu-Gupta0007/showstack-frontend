import { Outlet, NavLink } from "react-router-dom";
import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

const AdminLayout = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="AdminLayout-loading">⏳ Loading...</div>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Optional admin check
  // if (user.publicMetadata?.role !== "admin") {
  //   return <div>❌ Access Denied</div>;
  // }

  const navLinkClass = ({ isActive }) =>
    `AdminLayout-navLink ${isActive ? "active" : ""}`;

  return (
    <div className="AdminLayout">
      {/* SIDEBAR */}
      <aside className="AdminLayout-sidebar">
        <div className="AdminLayout-header">
          <h2>Admin Panel</h2>
        </div>

        <ul className="AdminLayout-nav">
          <li className="AdminLayout-navItem">
            <NavLink to="/admin" end className={navLinkClass}>
              <span className="AdminLayout-icon">📊</span>
              Dashboard
            </NavLink>
          </li>

          <li className="AdminLayout-navItem">
            <NavLink to="/admin/movies" className={navLinkClass}>
              <span className="AdminLayout-icon">🎥</span>
              Movies
            </NavLink>
          </li>

          <li className="AdminLayout-navItem">
            <NavLink to="/admin/add-show" className={navLinkClass}>
              <span className="AdminLayout-icon">➕</span>
              Add Show
            </NavLink>
          </li>

          <li className="AdminLayout-navItem">
            <NavLink to="/admin/bookings" className={navLinkClass}>
              <span className="AdminLayout-icon">📅</span>
              Bookings
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* CONTENT */}
      <main className="AdminLayout-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
