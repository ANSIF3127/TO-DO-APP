import { useEffect, useRef } from 'react';

export const useNotifications = (tasks) => {
  const notifiedEvents = useRef(new Set()); // Store strings like 'taskid-remind-tomorrow' or 'taskid-remind-today'

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    if (Notification.permission !== 'granted') return;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    tasks.forEach((task) => {
      if (task.completed || !task.dueDate) return;

      const todayKey = `${task.id}-today`;
      const tomorrowKey = `${task.id}-tomorrow`;

      // Morning of due date
      if (task.dueDate === todayStr && !notifiedEvents.current.has(todayKey)) {
        new Notification('📅 Task Due Today', {
          body: `Reminder: "${task.title}" is due today!`,
          icon: '/favicon.ico',
        });
        notifiedEvents.current.add(todayKey);
      }

      // One day prior
      if (task.dueDate === tomorrowStr && !notifiedEvents.current.has(tomorrowKey)) {
        new Notification('⏰ Task Due Tomorrow', {
          body: `"${task.title}" is due tomorrow. Don't forget!`,
          icon: '/favicon.ico',
        });
        notifiedEvents.current.add(tomorrowKey);
      }
    });
  }, [tasks]);
};