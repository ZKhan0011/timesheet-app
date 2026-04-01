import { Outlet, Link, useLocation } from 'react-router';
import { Clock, BarChart3, FileText, Home } from 'lucide-react';
import './Layout.css';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/time-entry', icon: Clock, label: 'Time Entry' },
    { to: '/timesheets', icon: FileText, label: 'Timesheets' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <Clock className="icon" />
              </div>
              <div>
                <h1 className="app-title">FDM Timesheets</h1>
                <p className="app-subtitle">Time Tracking System</p>
              </div>
            </div>
            <div className="user-section">
              <div className="user-info">
                <p className="user-name">John Anderson</p>
                <p className="user-role">Consultant</p>
              </div>
              <div className="user-avatar">
                JA
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-items">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="nav-icon" />
                  <span className="nav-label">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
