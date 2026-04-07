import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router';
import { Clock, BarChart3, FileText, Home, LogOut } from 'lucide-react';
import './Layout.css';
import { getUserByCredentials } from '../data/mockData';

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = getUserByCredentials(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <Clock size={20} />
        </div>
        <h2 className="login-title">Sign in</h2>
        <p className="login-sub">Time tracking dashboard</p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-btn">Sign in</button>
        </form>
      </div>
    </div>
  );
}

export function Layout() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const location = useLocation();

  if (!user) {
    return (
      <LoginScreen onLogin={(u) => {
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
      }} />
    );
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/time-entry', icon: Clock, label: 'Time Entry' },
    { to: '/timesheets', icon: FileText, label: 'Timesheets' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <div className="layout">
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
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role}</p>
              </div>
              <div className="user-avatar">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button
                className="signout-btn"
                onClick={() => {
                  localStorage.removeItem('user');
                  setUser(null);
                }}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

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

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}