import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.dueDate ? new Date(initialData.dueDate) : null);
  const [dueTime, setDueTime] = useState(initialData.dueTime || '09:00');
  const [priority, setPriority] = useState(initialData.priority || 'medium');
  const [pinned, setPinned] = useState(initialData.pinned || false);
  const [error, setError] = useState('');

  const timePresets = [
    { label: 'Morning', value: '09:00' },
    { label: 'Afternoon', value: '14:00' },
    { label: 'Evening', value: '19:00' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
      dueTime,
      priority,
      pinned,
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>{initialData.id ? 'Edit Mission' : 'Create New Mission'}</h3>
      {error && <p className="error-text">{error}</p>}

      <div className="form-group">
        <label>Mission Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional intel..."
          rows="3"
        />
      </div>

      <div className="form-row-grid">
        <div className="form-group">
          <label>Due Date</label>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Date"
            isClearable
          />
        </div>
        <div className="form-group">
          <label>Due Time</label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
          <div className="time-presets">
            {timePresets.map(preset => (
              <button
                key={preset.label}
                type="button"
                className={`preset-btn ${dueTime === preset.value ? 'active' : ''}`}
                onClick={() => setDueTime(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row-grid">
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="option-select">
            <option value="high">High (Combat)</option>
            <option value="medium">Medium (Active)</option>
            <option value="low">Low (Routine)</option>
          </select>
        </div>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label className="pin-checkbox">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            📌 Pin Mission
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-action btn-submit">
          {initialData.id ? 'Authorize Update' : 'Initialize Mission'}
        </button>
        <button type="button" className="btn-action btn-cancel" onClick={onCancel}>
          Abort
        </button>
      </div>
    </form>
  );
};

export default TaskForm;