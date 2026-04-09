import { useState, useEffect } from 'react';
import { CalendarIcon, Plus, Save } from 'lucide-react';
import { format } from 'date-fns';
import { fetchProjects, createTimeEntry } from '../data/api';
import { toast } from 'sonner';
import './TimeEntry.css';

export function TimeEntry() {
  const [date, setDate] = useState(new Date());
  const [projectId, setProjectId] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [projects, setProjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(err => console.error('Failed to load projects:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectId || !hours || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await createTimeEntry({
        projectId: parseInt(projectId),
        date: format(date, 'yyyy-MM-dd'),
        hours: parseFloat(hours),
        description,
        status: 'draft',
      });

      toast.success('Time entry saved successfully!', {
        description: `${hours} hours logged for ${format(date, 'MMM d, yyyy')}`,
      });

      setProjectId('');
      setHours('');
      setDescription('');
    } catch (err) {
      toast.error('Failed to save time entry', {
        description: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved', {
      description: 'You can continue editing later',
    });
  };

  return (
    <div className="time-entry-page">
      <div className="page-header">
        <h2 className="page-title">Log Time</h2>
        <p className="page-subtitle">
          Enter your time for the selected date
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">New Time Entry</h3>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="time-entry-form">
            <div className="form-group">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                className="form-input"
                value={format(date, 'yyyy-MM-dd')}
                onChange={(e) => setDate(new Date(e.target.value))}
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
                max="24"
                placeholder="8.0"
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
              <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                <Plus className="btn-icon" />
                {submitting ? 'Saving...' : 'Add Entry'}
              </button>
              <button type="button" className="btn btn-outline" onClick={handleSaveDraft}>
                <Save className="btn-icon" />
                Save Draft
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card tips-card">
        <div className="card-header">
          <h3 className="card-title">Tips for Time Entry</h3>
        </div>
        <div className="card-content">
          <ul className="tips-list">
            <li className="tip-item">
              <span className="tip-bullet">•</span>
              <span>Log your time daily for accurate tracking</span>
            </li>
            <li className="tip-item">
              <span className="tip-bullet">•</span>
              <span>Be specific in your descriptions for better reporting</span>
            </li>
            <li className="tip-item">
              <span className="tip-bullet">•</span>
              <span>Round to the nearest 0.5 hours</span>
            </li>
            <li className="tip-item">
              <span className="tip-bullet">•</span>
              <span>Submit your timesheet by end of week for timely approval</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
