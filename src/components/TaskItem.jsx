import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskItem = ({ task }) => {
    const { dispatch } = useTasks();
    const [showActions, setShowActions] = useState(false);

    const handleToggle = () => {
        dispatch({ type: 'TOGGLE_COMPLETE', payload: task.id });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        dispatch({ type: 'DELETE_TASK', payload: task.id });
        dispatch({
            type: 'ADD_TOAST',
            payload: { message: 'Task deleted', type: 'error' }
        });
    };

    const handlePin = (e) => {
        e.stopPropagation();
        dispatch({ type: 'TOGGLE_PIN', payload: task.id });
    };

    const priorityConfig = {
        high: {
            border: 'border-l-red-500',
            bg: 'bg-red-500/10',
            text: 'text-red-500',
            label: 'High'
        },
        medium: {
            border: 'border-l-green-500',
            bg: 'bg-green-500/10',
            text: 'text-green-500',
            label: 'Medium'
        },
        low: {
            border: 'border-l-blue-500',
            bg: 'bg-blue-500/10',
            text: 'text-blue-500',
            label: 'Low'
        }
    };

    const p = priorityConfig[task.priority] || priorityConfig.low;

    const categoryColors = {
        work: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
        personal: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
    };

    const cat = task.category ? categoryColors[task.category] : null;

    if (task.completed) {
        return (
            <div
                onClick={handleToggle}
                className="group bg-[#1E2A36] p-4 md:p-5 rounded-xl border border-[#3A4A5A] opacity-70 grayscale-[0.5] transition-all cursor-pointer hover:opacity-80 overflow-hidden"
            >
                <div className="flex gap-3 md:gap-4">
                    <div className="mt-1 shrink-0">
                        <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center">
                            <span className="material-icons text-white text-[14px]">check</span>
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="font-bold text-[#94A3B8] line-through truncate">{task.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3A4A5A] text-[#94A3B8] font-bold uppercase tracking-wider shrink-0">Done</span>
                        </div>
                        {task.description && (
                            <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2 italic">{task.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-medium">
                                <div className="flex items-center gap-1">
                                    <span className="material-icons text-sm">done_all</span>
                                    Completed
                                </div>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="text-[#94A3B8] hover:text-red-500 transition-colors p-1"
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
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className={`group bg-[#2C3E50] p-4 md:p-5 rounded-xl border-l-4 ${p.border} border-y border-r border-[#3A4A5A] shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden relative`}
        >
            <div className="flex gap-3 md:gap-4">
                <div className="mt-1 shrink-0">
                    <div className="w-5 h-5 border-2 border-[#94A3B8] rounded-md flex items-center justify-center group-hover:border-primary transition-colors"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between gap-2 mb-1 flex-col sm:flex-row">
                        <h4 className="font-bold text-[#E0E0E0] truncate">{task.title}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {cat && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} font-bold uppercase tracking-wider`}>
                                    {task.category}
                                </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.bg} ${p.text} font-bold uppercase tracking-wider`}>{p.label}</span>
                        </div>
                    </div>
                    {task.description && (
                        <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3 text-xs text-[#94A3B8] font-medium">
                            <div className="flex items-center gap-1">
                                <span className="material-icons text-sm">schedule</span>
                                {task.time || task.dueTime || 'Anytime'}
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="material-icons text-sm">calendar_month</span>
                                {task.dueDate || 'No date'}
                            </div>
                        </div>
                        <div className={`flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'}`}>
                            <button
                                onClick={handlePin}
                                className={`p-1 rounded-lg transition-colors ${task.pinned ? 'text-amber-500 bg-amber-500/10' : 'text-[#94A3B8] hover:text-amber-500 hover:bg-amber-500/10'}`}
                                title={task.pinned ? 'Unpin task' : 'Pin task'}
                            >
                                <span className="material-icons text-sm">push_pin</span>
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Delete task"
                            >
                                <span className="material-icons text-sm">delete</span>
                            </button>
                        </div>
                    </div>
                    {task.pinned && (
                        <div className="absolute top-2 right-2">
                            <span className="material-icons text-amber-500 text-xs">push_pin</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskItem;