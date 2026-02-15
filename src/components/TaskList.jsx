import React, { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';

const TaskList = () => {
  const { state } = useTasks();
  const { tasks, filter, sortBy, sortOrder } = state;

  const filteredAndSortedTasks = useMemo(() => {
    // Filter
    let filtered = tasks;
    if (filter === 'active') {
      filtered = tasks.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = tasks.filter((task) => task.completed);
    } else if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = tasks.filter((task) => task.dueDate === today);
    }

    // Search optionss..
    if (state.searchTerm) {
      const search = state.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      );
    }

    // Sortting
    const sorted = [...filtered].sort((a, b) => {
      // Pinned tasks ALWAYS showiing  first 
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      let comparison = 0;
      if (sortBy === 'date') {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000); 
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
        comparison = dateA - dateB;
      } else if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0); 
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [tasks, filter, sortBy, sortOrder, state.searchTerm]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {filteredAndSortedTasks.length === 0 ? (
        <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-50">
          <span className="material-icons text-6xl mb-4">task_alt</span>
          <p className="text-lg font-medium">✨ No tasks found in this category</p>
        </div>
      ) : (
        filteredAndSortedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))
      )}
    </div>
  );
};

export default TaskList;