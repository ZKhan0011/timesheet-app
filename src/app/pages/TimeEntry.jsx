import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save } from 'lucide-react';
import {
  format, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
  addMonths, subMonths, addDays, isSameMonth, isSameDay,
  isWithinInterval, eachDayOfInterval
} from 'date-fns';
import { projects } from '../data/mockData';
import { toast } from 'sonner';
import './TimeEntry.css';

function WeekCalendar({ selectedWeekStart, onWeekSelect }) {
  const [viewMonth, setViewMonth] = useState(selectedWeekStart || new Date());

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  // Pad to full weeks (Mon–Sun grid)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const weekStart = selectedWeekStart
    ? startOfWeek(selectedWeekStart, { weekStartsOn: 1 })
    : null;
  const weekEnd = weekStart ? endOfWeek(weekStart, { weekStartsOn: 1 }) : null;

  const isInSelectedWeek = (day) =>
    weekStart && weekEnd && isWithinInterval(day, { start: weekStart, end: weekEnd });

  const handleDayClick = (day) => {
    onWeekSelect(startOfWeek(day, { weekStartsOn: 1 }));
  };

  return (
    <div className="week-calendar">
      <div className="calendar-header">
        <button
          type="button"
          className="cal-nav-btn"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="calendar-month-label">
          {format(viewMonth, 'MMMM yyyy')}
        </span>
        <button
          type="button"
          className="cal-nav-btn"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="calendar-grid">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="calendar-dow">{d}</div>
        ))}

        {days.map((day) => {
          const inWeek = isInSelectedWeek(day);
          const isWeekStart = weekStart && isSameDay(day, weekStart);
          const isWeekEnd = weekEnd && isSameDay(day, weekEnd);
          const isToday = isSameDay(day, new Date());
          const faded = !isSameMonth(day, viewMonth);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => handleDayClick(day)}
              className={[
                'calendar-day',
                inWeek ? 'in-week' : '',
                isWeekStart ? 'week-start' : '',
                isWeekEnd ? 'week-end' : '',
                isToday ? 'today' : '',
                faded ? 'faded' : '',
              ].filter(Boolean).join(' ')}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Selected week label */}
      {weekStart && (
        <div className="selected-week-label">
          Week of {format(weekStart, 'MMM d')} – {format(weekEnd, 'MMM d, yyyy')}
        </div>
      )}
    </div>
  );
}

export function TimeEntry() {
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [projectId, setProjectId] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!projectId || !hours || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    const weekEnd = endOfWeek(selectedWeekStart, { weekStartsOn: 1 });
    toast.success('Time entry saved successfully!', {
      description: `${hours} hours logged for week of ${format(selectedWeekStart, 'MMM d')}–${format(weekEnd, 'MMM d, yyyy')}`,
    });
    setProjectId('');
    setHours('');
    setDescription('');
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved', { description: 'You can continue editing later' });
  };

  return (
    <div className="time-entry-page">
      <div className="page-header">
        <h2 className="page-title">Log Time</h2>
        <p className="page-subtitle">Select a week and log your hours</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">New Time Entry</h3>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="time-entry-form">

            <div className="form-group">
              <label className="form-label">Week</label>
              <WeekCalendar
                selectedWeekStart={selectedWeekStart}
                onWeekSelect={setSelectedWeekStart}
              />
            </div>

            <div className="form-group">
              <label htmlFor="project" className="form-label">Project</label>
              <select
                id="project"
                className="form-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name} - {project.client}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="hours" className="form-label">Hours</label>
              <input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                max="168"
                placeholder="40.0"
                className="form-input"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                placeholder="Describe what you worked on..."
                rows="4"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary flex-1">
                <Plus className="btn-icon" />
                Add Entry
              </button>
              <button type="button" className="btn btn-outline" onClick={handleSaveDraft}>
                <Save className="btn-icon" />
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}