import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/admin-dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/employees', label: 'Employees', icon: '👥' },
  { path: '/departments', label: 'Departments', icon: '🏢' },
  { path: '/departments/dashboard', label: 'Dept Dashboard', icon: '📈' },
  { path: '/reviews', label: 'Reviews', icon: '📝' },
  { path: '/reviews/new', label: 'New Review', icon: '✍️' },
  { path: '/dailywork', label: 'Daily Work', icon: '📅' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">CoReCo</div>
        <div className="sidebar__subtitle">HR Portal</div>
      </div>
      <nav className="sidebar__nav">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
