import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskForm from './TaskForm';

const AddTask = () => {
  const { dispatch } = useTasks();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      completed: false,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    dispatch({
      type: 'ADD_TOAST',
      payload: { message: 'Mission Initialized Successfully', type: 'success' }
    });
    setShowForm(false);
  };

  return (
    <div className="add-task-section">
      <button className="btn-fab" onClick={() => setShowForm(true)} title="Add New Task">
        +
      </button>

      {showForm && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') setShowForm(false);
        }}>
          <TaskForm
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default AddTask;