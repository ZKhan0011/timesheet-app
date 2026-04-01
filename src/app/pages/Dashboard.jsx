import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { projects, timeEntries, getProjectById } from '../data/mockData';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { Link } from 'react-router';
import './Dashboard.css';

export function Dashboard() {
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

  const thisWeekEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= currentWeekStart && entryDate <= currentWeekEnd;
  });

  const thisWeekHours = thisWeekEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const submittedEntries = timeEntries.filter(e => e.status === 'submitted').length;
  const approvedEntries = timeEntries.filter(e => e.status === 'approved').length;
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const recentEntries = [...timeEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">
            Week of {format(currentWeekStart, 'MMM d')} - {format(currentWeekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <Link to="/time-entry" className="btn btn-primary">
          <Clock className="btn-icon" />
          Log Time
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">This Week</span>
            <Clock className="stat-icon" />
          </div>
          <div className="stat-value">{thisWeekHours}h</div>
          <p className="stat-description">
            {40 - thisWeekHours}h remaining to full week
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Pending Approval</span>
            <AlertCircle className="stat-icon" />
          </div>
          <div className="stat-value">{submittedEntries}</div>
          <p className="stat-description">
            Awaiting manager review
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Approved</span>
            <CheckCircle className="stat-icon" />
          </div>
          <div className="stat-value">{approvedEntries}</div>
          <p className="stat-description">
            This month
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Hours</span>
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-value">{totalHours}h</div>
          <p className="stat-description">
            All time tracked
          </p>
        </div>
      </div>

      <div className="content-grid">
        {/* Recent Entries */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Time Entries</h3>
          </div>
          <div className="card-content">
            <div className="entries-list">
              {recentEntries.map(entry => {
                const project = getProjectById(entry.projectId);
                return (
                  <div key={entry.id} className="entry-item">
                    <div
                      className="entry-color"
                      style={{ backgroundColor: project?.color }}
                    />
                    <div className="entry-details">
                      <p className="entry-project">{project?.name}</p>
                      <p className="entry-description">{entry.description}</p>
                      <p className="entry-date">
                        {format(new Date(entry.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="entry-info">
                      <p className="entry-hours">{entry.hours}h</p>
                      <span className={`status-badge status-${entry.status}`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <Link to="/timesheets" className="btn btn-outline full-width">
              View All Entries
            </Link>
          </div>
        </div>

        {/* Active Projects */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Projects</h3>
          </div>
          <div className="card-content">
            <div className="projects-list">
              {projects.map(project => {
                const projectEntries = timeEntries.filter(e => e.projectId === project.id);
                const projectHours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
                return (
                  <div key={project.id} className="project-item">
                    <div className="project-header">
                      <div
                        className="project-icon"
                        style={{ backgroundColor: project.color }}
                      >
                        <span className="project-initials">
                          {project.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="project-info">
                        <p className="project-name">{project.name}</p>
                        <p className="project-client">{project.client}</p>
                        <div className="project-progress">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                backgroundColor: project.color,
                                width: `${Math.min((projectHours / 100) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="project-hours">{projectHours}h</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
