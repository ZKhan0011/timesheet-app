import { useState, useEffect } from 'react';
import { CheckCircle, Send, Edit, Trash2 } from 'lucide-react';
import { fetchTimeEntries, deleteTimeEntry, submitTimeEntry } from '../data/api';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { toast } from 'sonner';
import './Timesheets.css';

export function Timesheets() {
  const [selectedWeek, setSelectedWeek] = useState('0');
  const [weekData, setWeekData] = useState({ entries: [], totalHours: 0, status: 'draft' });
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(new Date());
  const [weekEnd, setWeekEnd] = useState(new Date());

  const loadWeekData = async (weeksAgo) => {
    setLoading(true);
    try {
      const ws = startOfWeek(subWeeks(new Date(), weeksAgo), { weekStartsOn: 1 });
      const we = endOfWeek(ws, { weekStartsOn: 1 });
      setWeekStart(ws);
      setWeekEnd(we);

      const entries = await fetchTimeEntries({
        dateFrom: format(ws, 'yyyy-MM-dd'),
        dateTo: format(we, 'yyyy-MM-dd'),
      });

      const totalHours = entries.reduce((sum, entry) => sum + parseFloat(entry.hours), 0);
      const status = entries.length > 0 ? entries[0].status : 'draft';

      setWeekData({ entries, totalHours, status });
    } catch (err) {
      console.error('Failed to load timesheet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeekData(parseInt(selectedWeek));
  }, [selectedWeek]);

  const handleSubmit = async () => {
    try {
      // Submit all draft entries for this week
      const draftEntries = weekData.entries.filter(e => e.status === 'draft');
      await Promise.all(draftEntries.map(e => submitTimeEntry(e.id)));
      toast.success('Timesheet submitted!', {
        description: 'Your timesheet has been sent for approval',
      });
      loadWeekData(parseInt(selectedWeek));
    } catch (err) {
      toast.error('Failed to submit timesheet', { description: err.message });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTimeEntry(id);
      toast.success('Entry deleted', {
        description: 'Time entry has been removed',
      });
      loadWeekData(parseInt(selectedWeek));
    } catch (err) {
      toast.error('Failed to delete entry', { description: err.message });
    }
  };

  return (
    <div className="timesheets-page">
      <div className="timesheets-header">
        <div>
          <h2 className="page-title">Timesheets</h2>
          <p className="page-subtitle">
            View and manage your time entries
          </p>
        </div>
        <select
          className="week-select"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
        >
          <option value="0">This Week</option>
          <option value="1">Last Week</option>
          <option value="2">2 Weeks Ago</option>
          <option value="3">3 Weeks Ago</option>
        </select>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="week-summary-header">
            <div>
              <h3 className="card-title">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </h3>
              <p className="week-info">
                {weekData.entries.length} entries • {weekData.totalHours} hours
              </p>
            </div>
            <span className={`status-badge status-${weekData.status}`}>
              {weekData.status === 'approved' && <CheckCircle className="badge-icon" />}
              {weekData.status.charAt(0).toUpperCase() + weekData.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="empty-state">
              <p className="empty-message">Loading...</p>
            </div>
          ) : weekData.entries.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">No time entries for this week</p>
              <button className="btn-link">Add Time Entry</button>
            </div>
          ) : (
            <div>
              <table className="entries-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Description</th>
                    <th className="text-right">Hours</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weekData.entries.map(entry => {
                    const project = entry.project;
                    return (
                      <tr key={entry.id}>
                        <td className="font-medium">
                          {format(new Date(entry.date), 'EEE, MMM d')}
                        </td>
                        <td>
                          <div className="project-cell">
                            <div
                              className="project-color"
                              style={{ backgroundColor: project?.color }}
                            />
                            <div>
                              <p className="project-name">{project?.name}</p>
                              <p className="project-client">{project?.client}</p>
                            </div>
                          </div>
                        </td>
                        <td className="description-cell">
                          {entry.description}
                        </td>
                        <td className="hours-cell">
                          {entry.hours}h
                        </td>
                        <td className="actions-cell">
                          {entry.status === 'draft' && (
                            <div className="action-buttons">
                              <button className="action-btn edit-btn">
                                <Edit className="action-icon" />
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(entry.id)}
                              >
                                <Trash2 className="action-icon" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {weekData.status === 'draft' && weekData.entries.length > 0 && (
                <div className="timesheet-footer">
                  <div>
                    <p className="total-hours">Total Hours: {weekData.totalHours}h</p>
                    <p className="remaining-hours">
                      {weekData.totalHours >= 40 ? 'Full week logged' : `${40 - weekData.totalHours}h to full week`}
                    </p>
                  </div>
                  <button onClick={handleSubmit} className="btn btn-primary">
                    <Send className="btn-icon" />
                    Submit Timesheet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {weekData.entries.length > 0 && (
        <div className="card daily-breakdown-card">
          <div className="card-header">
            <h3 className="card-title">Daily Breakdown</h3>
          </div>
          <div className="card-content">
            <div className="daily-grid">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const dayDate = new Date(weekStart);
                dayDate.setDate(dayDate.getDate() + index);
                const dayEntries = weekData.entries.filter(
                  e => format(new Date(e.date), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd')
                );
                const dayHours = dayEntries.reduce((sum, e) => sum + parseFloat(e.hours), 0);

                return (
                  <div key={day} className="day-cell">
                    <p className="day-label">{day}</p>
                    <div className={`day-hours ${dayHours > 0 ? 'has-hours' : ''}`}>
                      <p className="hours-value">
                        {dayHours > 0 ? `${dayHours}h` : '-'}
                      </p>
                      <p className="day-date">{format(dayDate, 'd')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
