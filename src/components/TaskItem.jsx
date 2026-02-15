import React from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskItem = ({ task }) => {
  const { dispatch } = useTasks();

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_COMPLETE', payload: task.id });
  };

  const priorityColors = {
    high: {
      border: 'border-high',
      bg: 'bg-high/10',
      text: 'text-high',
      hover: 'hover:border-high/50'
    },
    medium: {
      border: 'border-medium',
      bg: 'bg-medium/10',
      text: 'text-medium',
      hover: 'hover:border-medium/50'
    },
    low: {
      border: 'border-low',
      bg: 'bg-low/10',
      text: 'text-low',
      hover: 'hover:border-low/50'
    }
  };

  const pColor = priorityColors[task.priority] || priorityColors.low;

  if (task.completed) {
    return (
      <div
        onClick={handleToggle}
        className="group bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-xl border border-slate-200 dark:border-slate-800 opacity-60 grayscale-[0.5] transition-all cursor-pointer"
      >
        <div className="flex gap-4">
          <div className="mt-1">
            <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center">
              <span className="material-icons text-white text-[14px]">check</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 line-through truncate">{task.title}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 font-bold uppercase tracking-wider">Done</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 italic">{task.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <span className="material-icons text-sm">done_all</span>
                  Completed
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'DELETE_TASK', payload: task.id });
                }}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Delete task"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleToggle}
      className={`group bg-white dark:bg-card-dark p-5 rounded-xl border-l-4 ${pColor.border} border-y border-r border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md ${pColor.hover} transition-all cursor-pointer`}
    >
      <div className="flex gap-4">
        <div className="mt-1">
          <div className={`w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md flex items-center justify-center group-hover:${pColor.border} transition-colors`}></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">{task.title}</h4>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${pColor.bg} ${pColor.text} font-bold uppercase tracking-wider`}>{task.priority}</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{task.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <span className="material-icons text-sm">schedule</span>
                {task.time || 'Anytime'}
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons text-sm">calendar_month</span>
                {task.dueDate || 'No date'}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'TOGGLE_PIN', payload: task.id });
                }}
                className={`${task.pinned ? 'text-amber-500' : 'text-slate-400'} hover:text-amber-500 transition-colors`}
              >
                <span className="material-icons text-sm">{task.pinned ? 'push_pin' : 'push_pin_outlined'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'DELETE_TASK', payload: task.id });
                }}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <span className="material-icons text-sm">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
