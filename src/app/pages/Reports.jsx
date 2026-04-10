import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchProjects, fetchTimeEntries, hourlyRate } from '../data/api';
import { format, subWeeks, startOfWeek, endOfWeek } from 'date-fns';
import './Reports.css';

export function Reports() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projects, allEntries] = await Promise.all([
          fetchProjects(),
          fetchTimeEntries(),
        ]);

        const weekly = [0, 1, 2, 3].map(weeksAgo => {
          const ws = startOfWeek(subWeeks(new Date(), weeksAgo), { weekStartsOn: 1 });
          const we = endOfWeek(ws, { weekStartsOn: 1 });
          const weekEntries = allEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= ws && entryDate <= we;
          });
          const hours = weekEntries.reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
          return {
            id: `week-${weeksAgo}`,
            week: format(ws, 'MMM d'),
            hours: hours,
            pay: hours * (hourlyRate || 0),
          };
        }).reverse();

        const projData = projects.map((project) => {
          const projectEntries = allEntries.filter(e => e.project?.id === project.id);
          const hours = projectEntries.reduce((sum, e) => sum + parseFloat(e.hours || 0), 0);
          return {
            id: project.id,
            name: project.name,
            hours,
            earnings: hours * (hourlyRate || 0),
            color: project.color,
          };
        }).filter(p => p.hours > 0);

        const total = allEntries.reduce((sum, entry) => sum + parseFloat(entry.hours || 0), 0);

        setWeeklyData(weekly);
        setProjectData(projData);
        setTotalHours(total);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="reports-page">...Loading</div>;

  const totalEarnings = totalHours * (hourlyRate || 0);
  const avgWeeklyPay = (totalEarnings / 4).toFixed(2);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2 className="page-title">Reports & Analytics</h2>
        <p className="page-subtitle">Insights into your time tracking and earnings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Hours</div>
          <div className="stat-value">{totalHours}h</div>
          <div className="stat-description">Last 4 weeks</div>
        </div>
        <div className="stat-card highlight-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value">
            £{totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-description">Avg £{avgWeeklyPay}/week</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Most Active Project</div>
          <div className="stat-value-lg">
            {projectData.length > 0 ? projectData.reduce((prev, curr) => (prev.hours > curr.hours ? prev : curr)).name : 'N/A'}
          </div>
          <div className="stat-description">By total hours</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Earnings Trend (£)</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  formatter={(value) => [`£${value.toFixed(2)}`, 'Earnings']}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #84cc16' }}
                />
                <Bar dataKey="pay" fill="#22c55e" radius={[8, 8, 0, 0]} />
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
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #84cc16' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Project Financials</h3>
        </div>
        <div className="card-content">
          <div className="project-summary">
            {projectData.map(project => {
              const percentage = totalHours > 0 ? ((project.hours / totalHours) * 100).toFixed(1) : "0.0";
              const displayEarnings = (project.earnings || 0).toFixed(2);
              return (
                <div key={project.id || project.name} className="project-row">
                  <div className="project-header-row">
                    <div className="project-info-row">
                      <div className="project-color-dot" style={{ backgroundColor: project.color }} />
                      <span className="project-name-text">{project.name}</span>
                    </div>
                    <div className="project-stats">
                      <span className="project-hours-text">{project.hours}h</span>
                      <span className="project-earnings-text" style={{ fontWeight: 'bold', marginLeft: '10px', color: '#22c55e' }}>
                        £{displayEarnings}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ backgroundColor: project.color, width: `${percentage}%` }} />
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