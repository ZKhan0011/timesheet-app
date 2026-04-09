import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { fetchProjects, fetchTimeEntries, fetchDashboardSummary } from '../data/api';
import { format } from 'date-fns';
import { Link } from 'react-router';
import './Dashboard.css';

export function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryData, projectsData, entriesData] = await Promise.all([
          fetchDashboardSummary(),
          fetchProjects(),
          fetchTimeEntries(),
        ]);
        setSummary(summaryData);
        setProjects(projectsData);
        setAllEntries(entriesData);
        // Entries come sorted by -date from the API, take first 5
        setRecentEntries(entriesData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h2 className="page-title">Dashboard</h2>
            <p className="page-subtitle">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const weekLabel = summary
    ? `Week of ${format(new Date(summary.weekStart), 'MMM d')} - ${format(new Date(summary.weekEnd), 'MMM d, yyyy')}`
    : '';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">{weekLabel}</p>
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
          <div className="stat-value">{summary?.thisWeekHours ?? 0}h</div>
          <p className="stat-description">
            {40 - (summary?.thisWeekHours ?? 0)}h remaining to full week
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Pending Approval</span>
            <AlertCircle className="stat-icon" />
          </div>
          <div className="stat-value">{summary?.submittedEntries ?? 0}</div>
          <p className="stat-description">
            Awaiting manager review
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Approved</span>
            <CheckCircle className="stat-icon" />
          </div>
          <div className="stat-value">{summary?.approvedEntries ?? 0}</div>
          <p className="stat-description">
            This month
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Hours</span>
            <TrendingUp className="stat-icon" />
          </div>
          <div className="stat-value">{summary?.totalHours ?? 0}h</div>
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
                const project = entry.project;
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
                const projectEntries = allEntries.filter(e => e.project?.id === project.id);
                const projectHours = projectEntries.reduce((sum, e) => sum + parseFloat(e.hours), 0);
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
