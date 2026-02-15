import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { formatTo12Hour } from '../utils/formatTime'; // adjust path as needed

const TaskItem = ({ task }) => {
    const { dispatch } = useTasks();
    const [showActions, setShowActions] = useState(false);

    const handleToggle = (e) => {
        if (e.target.closest('button')) return;
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

    // Format time to 12‑hour AM/PM
    const displayTime = task.time || task.dueTime;
    const formattedTime = displayTime ? formatTo12Hour(displayTime) : 'Anytime';

    if (task.completed) {
        return (
            <div
                onClick={handleToggle}
                className="group bg-[#1E2A36] p-4 md:p-5 rounded-xl border border-[#3A4A5A] opacity-70 grayscale-[0.5] transition-all cursor-pointer hover:opacity-80 overflow-hidden"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                        <h4 className="font-bold text-[#94A3B8] line-through truncate flex-1">{task.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#3A4A5A] text-[#94A3B8] font-bold uppercase tracking-wider shrink-0 ml-2">Done</span>
                    </div>
                    {task.description && (
                        <p className="text-sm text-[#94A3B8] line-clamp-2 italic">{task.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-xs text-[#94A3B8]">
                            <span className="material-icons text-sm">done_all</span>
                            Completed
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
        );
    }

    return (
        <div
            onClick={handleToggle}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className={`group bg-[#2C3E50] p-4 md:p-5 rounded-xl border-l-4 ${p.border} border-y border-r border-[#3A4A5A] shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden relative`}
        >
            {/* Pin Icon - top left */}
            <button
                onClick={handlePin}
                className={`absolute top-3 left-3 p-1 rounded-lg transition-colors z-10 ${
                    task.pinned ? 'text-amber-500 bg-amber-500/10' : 'text-[#94A3B8] hover:text-amber-500 hover:bg-amber-500/10'
                }`}
                title={task.pinned ? 'Unpin task' : 'Pin task'}
            >
                <span className="material-icons text-sm">push_pin</span>
            </button>

            <div className="flex flex-col gap-2 pl-8">
                {/* Category and Priority Badges */}
                <div className="flex items-center gap-1.5">
                    {cat && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.bg} ${cat.text} font-bold uppercase tracking-wider`}>
                            {task.category}
                        </span>
                    )}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.bg} ${p.text} font-bold uppercase tracking-wider`}>{p.label}</span>
                </div>

                {/* Title */}
                <h4 className="font-bold text-[#E0E0E0] break-words">{task.title}</h4>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-[#94A3B8] line-clamp-2">{task.description}</p>
                )}

{/* Date/Time - 12‑hour format */}
<div className="flex justify-between items-center text-[11px] text-[#94A3B8] font-medium mt-1">
    <span className="flex items-center gap-0.5">
        <span className="material-icons text-xs">schedule</span>
        {formattedTime}
    </span>
    <span className="flex items-center gap-0.5">
        <span className="material-icons text-xs">calendar_month</span>
        {task.dueDate || 'No date'}
    </span>
</div>

                {/* Action Buttons - icons only */}
                <div className="flex items-center justify-between mt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch({ type: 'TOGGLE_COMPLETE', payload: task.id });
                        }}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Mark as complete"
                    >
                        <span className="material-icons text-lg">check_circle_outline</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Delete task"
                    >
                        <span className="material-icons text-lg">delete_outline</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;