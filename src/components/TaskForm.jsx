import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatTo12Hour } from '../utils/formatTime'; // adjust path as needed

const TaskForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [dueDate, setDueDate] = useState(initialData.dueDate ? new Date(initialData.dueDate) : null);
  const [dueTime, setDueTime] = useState(initialData.dueTime || '09:00');
  const [priority, setPriority] = useState(initialData.priority || 'medium');
  const [pinned, setPinned] = useState(initialData.pinned || false);
  const [error, setError] = useState('');

  // 12‑hour picker state
  const [hour12, setHour12] = useState(9);
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('AM');

  // Update picker when dueTime changes (e.g., from presets or initialData)
  useEffect(() => {
    if (dueTime) {
      const [hour24, min] = dueTime.split(':');
      const h24 = parseInt(hour24, 10);
      setHour12(h24 % 12 || 12);
      setMinute(min);
      setAmPm(h24 >= 12 ? 'PM' : 'AM');
    }
  }, [dueTime]);

  // Update dueTime when picker changes
  useEffect(() => {
    let h24 = hour12;
    if (ampm === 'PM' && hour12 !== 12) h24 += 12;
    if (ampm === 'AM' && hour12 === 12) h24 = 0;
    const paddedHour = h24.toString().padStart(2, '0');
    setDueTime(`${paddedHour}:${minute}`);
  }, [hour12, minute, ampm]);

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
          
          {/* Presets */}
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

          {/* Custom 12‑hour picker */}
          <div className="custom-time-picker" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={hour12}
              onChange={(e) => setHour12(parseInt(e.target.value, 10))}
              className="option-select"
              style={{ width: '70px' }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
              ))}
            </select>

            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>:</span>

            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="option-select"
              style={{ width: '70px' }}
            >
              {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setAmPm('AM')}
                className={`preset-btn ${ampm === 'AM' ? 'active' : ''}`}
                style={{ padding: '4px 8px' }}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setAmPm('PM')}
                className={`preset-btn ${ampm === 'PM' ? 'active' : ''}`}
                style={{ padding: '4px 8px' }}
              >
                PM
              </button>
            </div>

            <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: 'auto' }}>
              {formatTo12Hour(dueTime)}
            </span>
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

      {/* Add some basic styling for the new picker */}
      <style jsx>{`
        .custom-time-picker select {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          padding: 0.5rem;
          border-radius: 8px;
          outline: none;
        }
        .custom-time-picker button {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
        }
        .custom-time-picker button.active {
          background: var(--primary, #0da6f2);
          border-color: var(--primary, #0da6f2);
        }
      `}</style>
    </form>
  );
};

export default TaskForm;