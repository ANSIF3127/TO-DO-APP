import React, { useReducer, useEffect } from 'react';
import { TaskContext } from './TaskContextObject';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';

const initialState = {
  tasks: [],
  filter: 'all',
  categoryFilter: null,
  sortBy: 'date',
  sortOrder: 'asc',
  toasts: [],
  searchTerm: '',
  userName: '',
};

const MAX_STORAGE_BYTES = 4 * 1024 * 1024; // 4MB Limit

function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, userName: action.payload };
    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.payload, filter: 'all' };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, { id: Date.now(), ...action.payload }] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case 'TOGGLE_PIN':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, pinned: !task.pinned }
            : task
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload, categoryFilter: null };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy, sortOrder: action.payload.sortOrder };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'LOGOUT':
      // Clear all data and return to initial state
      return { ...initialState };
    default:
      return state;
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { storedValue: storedTasks, setValue: setStoredTasks } = useLocalStorage('tasks', []);
  const { storedValue: storedUserName, setValue: setStoredUserName } = useLocalStorage('userName', '');

  // Load username from localStorage on mount
  useEffect(() => {
    if (storedUserName) {
      dispatch({ type: 'SET_USERNAME', payload: storedUserName });
    }
  }, [storedUserName]);

  // Persist userName changes (including empty string after logout)
  useEffect(() => {
    setStoredUserName(state.userName || '');
  }, [state.userName, setStoredUserName]);

  // Load tasks from localStorage
  useEffect(() => {
    if (storedTasks && storedTasks.length > 0) {
      dispatch({ type: 'SET_TASKS', payload: storedTasks });
    }
  }, [storedTasks]);

  // Storage Monitor & Pruning Logic + persist tasks
  useEffect(() => {
    const dataString = JSON.stringify(state.tasks);
    const sizeInBytes = new Blob([dataString]).size;

    if (sizeInBytes >= MAX_STORAGE_BYTES) {
      console.warn('Storage limit approaching. Pruning oldest tasks...');
      const sortedByAge = [...state.tasks].sort((a, b) => a.id - b.id);
      const toKeep = sortedByAge.slice(Math.floor(sortedByAge.length * 0.2));
      dispatch({ type: 'SET_TASKS', payload: toKeep });
    } else {
      setStoredTasks(state.tasks);
    }
  }, [state.tasks, setStoredTasks]);

  // Notifications for due tasks
  useNotifications(state.tasks);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};