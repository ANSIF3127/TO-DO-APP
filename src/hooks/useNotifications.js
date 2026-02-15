import { useEffect, useRef } from 'react';
import { formatTo12Hour } from '../utils/formatTime';

export const useNotifications = (tasks, dispatch) => {
  const notifiedEvents = useRef(new Set());

  useEffect(() => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = now.toLocaleDateString('en-CA'); // local date
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      tasks.forEach((task) => {
        if (task.completed || !task.dueDate || !task.dueTime) return;
        if (task.dueDate !== todayStr) return;

        const [hour, minute] = task.dueTime.split(':').map(Number);
        const dueMinutes = hour * 60 + minute;
        const diff = dueMinutes - currentMinutes;
        const eventKey = `${task.id}-${task.dueDate}-${task.dueTime}`;
        const formattedTime = formatTo12Hour(task.dueTime);

        // 1 minute before due
        if (diff <= 1 && diff > 0 && !notifiedEvents.current.has(eventKey + '-soon')) {
          if (Notification.permission === 'granted') {
            new Notification('⏰ Task Due Soon', {
              body: `"${task.title}" is due at ${formattedTime} (in 1 minute)`,
              icon: '/favicon.ico',
            });
          }
          dispatch({
            type: 'ADD_TOAST',
            payload: {
              message: `⏳ "${task.title}" due in 1 minute`,
              type: 'warning',
              id: task.id,
              actionLabel: 'OK',
              action: () => {},
            },
          });
          notifiedEvents.current.add(eventKey + '-soon');
        }

        // Exactly at due time (0‑1 min after)
        if (diff <= 0 && diff > -1 && !notifiedEvents.current.has(eventKey + '-due')) {
          if (Notification.permission === 'granted') {
            new Notification('⌛ Time Up!', {
              body: `"${task.title}" was due at ${formattedTime}.`,
              icon: '/favicon.ico',
            });
          }
          dispatch({
            type: 'ADD_TOAST',
            payload: {
              message: `⌛ "${task.title}" time is up!`,
              type: 'error',
              id: task.id,
              actionLabel: '✕ Delete',
              action: () => dispatch({ type: 'DELETE_TASK', payload: task.id }),
            },
          });
          notifiedEvents.current.add(eventKey + '-due');
        }

        // Overdue by 1 minute (1‑2 min after)
        if (diff <= -1 && diff > -2 && !notifiedEvents.current.has(eventKey + '-overdue')) {
          if (Notification.permission === 'granted') {
            new Notification('⏱️ Overdue', {
              body: `"${task.title}" is 1 minute overdue (was due at ${formattedTime}).`,
              icon: '/favicon.ico',
            });
          }
          dispatch({
            type: 'ADD_TOAST',
            payload: {
              message: `⚠️ "${task.title}" expired`,
              type: 'error',
              id: task.id,
              actionLabel: '✕ Delete',
              action: () => dispatch({ type: 'DELETE_TASK', payload: task.id }),
            },
          });
          notifiedEvents.current.add(eventKey + '-overdue');
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks, dispatch]);
};