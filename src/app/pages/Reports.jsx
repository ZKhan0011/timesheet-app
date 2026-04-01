import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { timeEntries, projects } from '../data/mockData';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import './Reports.css';

export function Reports() {
  // Weekly hours data
  const weeklyData = [0, 1, 2, 3].map(weeksAgo => {
    const weekStart = startOfWeek(subWeeks(new Date(), weeksAgo), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    
    const weekEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    return {
      id: `week-${weeksAgo}`,
      week: format(weekStart, 'MMM d'),
      hours: weekEntries.reduce((sum, e) => sum + e.hours, 0),
    };
  }).reverse();

  // Project distribution
  const projectData = projects.map((project) => {
    const projectEntries = timeEntries.filter(e => e.projectId === project.id);
    const hours = projectEntries.reduce((sum, e) => sum + e.hours, 0);
    return {
      id: project.id,
      name: project.name,
      hours,
      color: project.color,
    };
  }).filter(p => p.hours > 0);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const avgWeeklyHours = (totalHours / 4).toFixed(1);
  const mostActiveProject = projectData.reduce((prev, current) => 
    prev.hours > current.hours ? prev : current
  , projectData[0]);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2 className="page-title">Reports & Analytics</h2>
        <p className="page-subtitle">
          Insights into your time tracking
        </p>
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Hours Tracked</div>
          <div className="stat-value">{totalHours}h</div>
          <div className="stat-description">Last 4 weeks</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Weekly Average</div>
          <div className="stat-value">{avgWeeklyHours}h</div>
          <div className="stat-description">Per week</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Most Active Project</div>
          <div className="stat-value-lg">{mostActiveProject?.name}</div>
          <div className="stat-description">{mostActiveProject?.hours}h logged</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Weekly Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Weekly Hours Trend</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #84cc16',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="hours" fill="#84cc16" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Project Distribution</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#84cc16"
                  dataKey="hours"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #84cc16',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Project Summary Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Project Summary</h3>
        </div>
        <div className="card-content">
          <div className="project-summary">
            {projectData.map(project => {
              const percentage = ((project.hours / totalHours) * 100).toFixed(1);
              return (
                <div key={project.name} className="project-row">
                  <div className="project-header-row">
                    <div className="project-info-row">
                      <div
                        className="project-color-dot"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="project-name-text">{project.name}</span>
                    </div>
                    <div className="project-stats">
                      <span className="project-percentage">{percentage}%</span>
                      <span className="project-hours-text">
                        {project.hours}h
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        backgroundColor: project.color,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
