import { useState } from 'react';
import { CheckCircle, Send, Edit, Trash2, Plus } from 'lucide-react'; 
import { timeEntries as initialEntries, getProjectById } from '../data/mockData';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { Link } from 'react-router';
import { toast } from 'sonner';
import './Timesheets.css';

export function Timesheets() {
  const [selectedWeek, setSelectedWeek] = useState('0');
  const [submittedTimesheets, setSubmittedTimesheets] = useState({});

  const [entries, setEntries] = useState(initialEntries);

  const getWeekData = (weeksAgo) => {
    const weekStart = startOfWeek(subWeeks(new Date(), weeksAgo), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const hasSubmittedTimesheet = submittedTimesheets[weeksAgo] === true;
    
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });

    const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
    const hasDraftEntries = entries.some((entry) => entry.status === 'draft');
    const allApproved = entries.length > 0 && entries.every((entry) => entry.status === 'approved');
    const allEntriesSubmitted = entries.length > 0 && entries.every((entry) => entry.status !== 'draft');
    const timesheetStatus = allApproved
      ? 'Approved'
      : allEntriesSubmitted && hasSubmittedTimesheet
        ? 'Pending Approval'
        : 'Not Submitted';

    return {
      weekStart,
      weekEnd,
      entries,
      totalHours,
      hasDraftEntries,
      allApproved,
      allEntriesSubmitted,
      timesheetStatus,
    };
  };

  const weekData = getWeekData(parseInt(selectedWeek));

  const handleSubmit = () => {
    if (weekData.hasDraftEntries) {
      toast.error('Submit all entries first', {
        description: 'Please submit all of your time entries before submitting the timesheet.',
      });
      return;
    }

    setSubmittedTimesheets((currentSubmittedTimesheets) => ({
      ...currentSubmittedTimesheets,
      [selectedWeek]: true,
    }));

    toast.success('Timesheet submitted!', {
      description: 'Your timesheet has been sent for approval',
    });
  };

  const handleDelete = (id) => {
    toast.success('Entry deleted', {
      description: 'Time entry has been removed',
    });
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
                {format(weekData.weekStart, 'MMM d')} - {format(weekData.weekEnd, 'MMM d, yyyy')}
              </h3>
              <p className="week-info">
                {weekData.entries.length} entries • {weekData.totalHours} hours
              </p>
            </div>
            {weekData.entries.length > 0 && (
              <span className={`status-badge ${
                weekData.timesheetStatus === 'Approved'
                  ? 'status-approved'
                  : weekData.timesheetStatus === 'Pending Approval'
                    ? 'status-submitted'
                    : 'status-draft'
              }`}>
                {weekData.timesheetStatus === 'Approved' && <CheckCircle className="badge-icon" />}
                {weekData.timesheetStatus}
              </span>
            )}
          </div>
        </div>
        <div className="card-content">
          {weekData.entries.length === 0 ? (
            <div className="empty-state">
              <p className="empty-message">No time entries for this week</p>
              <Link to="/time-entry" className="btn-link">Add Time Entry</Link>
            </div>
          ) : (
            <div>
              <div className="table-wrapper">
                <table className="entries-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th className="text-right">Hours</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weekData.entries.map(entry => {
                      const project = getProjectById(entry.projectId);
                      const timesheetEntryStatus = entry.status;

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
                          <td className="status-cell">
                            <span className={`status-badge status-${timesheetEntryStatus}`}>
                              {timesheetEntryStatus}
                            </span>
                          </td>
                          <td className="hours-cell">
                            {entry.hours}h
                          </td>
                          <td className="actions-cell">
                            {timesheetEntryStatus === 'draft' && (
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
              </div>

              <div className="mobile-entry-list">
                {weekData.entries.map(entry => {
                  const project = getProjectById(entry.projectId);
                  const timesheetEntryStatus = entry.status;

                  return (
                    <div key={`${entry.id}-mobile`} className="mobile-entry-card">
                      <div className="mobile-entry-header">
                        <div>
                          <p className="project-name">{project?.name}</p>
                          <p className="project-client">{format(new Date(entry.date), 'EEE, MMM d')} • {entry.hours}h</p>
                        </div>
                        <span className={`status-badge status-${timesheetEntryStatus}`}>
                          {timesheetEntryStatus}
                        </span>
                      </div>
                      <p className="mobile-entry-description">{entry.description}</p>
                      {timesheetEntryStatus === 'draft' && (
                        <div className="action-buttons mobile-actions">
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
                    </div>
                  );
                })}
              </div>

              {weekData.entries.length > 0 && weekData.timesheetStatus === 'Not Submitted' && (
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
                const dayDate = new Date(weekData.weekStart);
                dayDate.setDate(dayDate.getDate() + index);
                const dayEntries = weekData.entries.filter(
                  e => format(new Date(e.date), 'yyyy-MM-dd') === format(dayDate, 'yyyy-MM-dd')
                );
                const dayHours = dayEntries.reduce((sum, e) => sum + e.hours, 0);

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
