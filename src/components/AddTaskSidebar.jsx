import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const AddTaskSidebar = () => {
    const { dispatch } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueTime, setDueTime] = useState('09:00');
    const [dueDate, setDueDate] = useState('');

    const timePresets = [
        { label: 'Morning', value: '09:00' },
        { label: 'Afternoon', value: '14:00' },
        { label: 'Evening', value: '19:00' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newTask = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            priority,
            dueTime,
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            completed: false,
            pinned: false,
        };

        dispatch({ type: 'ADD_TASK', payload: newTask });
        dispatch({
            type: 'ADD_TOAST',
            payload: { message: 'Task Created Successfully', type: 'success' }
        });

        // Reseting   form
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueTime('09:00');
        setDueDate('');
    };

    return (
        <aside className="hidden lg:flex w-80 border-l border-slate-200 dark:border-slate-800 flex-col bg-white dark:bg-background-dark p-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold mb-6">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Task Name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                        placeholder="e.g. Design homepage"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 resize-none text-slate-900 dark:text-slate-100"
                        placeholder="Write some details..."
                        rows="3"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Priority</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setPriority('high')}
                            className={`flex-1 py-2 text-xs font-bold border-2 rounded-lg transition-all ${priority === 'high' ? 'border-high bg-high/10 text-high' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-high/50'}`}
                        >High</button>
                        <button
                            type="button"
                            onClick={() => setPriority('medium')}
                            className={`flex-1 py-2 text-xs font-bold border-2 rounded-lg transition-all ${priority === 'medium' ? 'border-medium bg-medium/10 text-medium' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-medium/50'}`}
                        >Med</button>
                        <button
                            type="button"
                            onClick={() => setPriority('low')}
                            className={`flex-1 py-2 text-xs font-bold border-2 rounded-lg transition-all ${priority === 'low' ? 'border-low bg-low/10 text-low' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:border-low/50'}`}
                        >Low</button>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Time Setting</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                        {timePresets.map(preset => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => setDueTime(preset.value)}
                                className={`px-3 py-1.5 text-xs border rounded-full font-medium transition-all ${dueTime === preset.value ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent hover:border-slate-300'}`}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative mb-3">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                        />
                    </div>
                    <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">schedule</span>
                        <input
                            type="time"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-slate-100"
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                        Save Task
                    </button>
                </div>
            </form>
            <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-8">
                <h3 className="text-sm font-bold mb-4 flex items-center justify-between text-slate-900 dark:text-slate-100">
                    Upcoming Reminders
                    <span className="material-icons text-slate-400 text-sm">more_horiz</span>
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                            <span className="material-icons text-sm">notifications_active</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Zoom Meeting</p>
                            <p className="text-[10px] text-slate-400">Starts in 15 minutes</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                            <span className="material-icons text-sm">event</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Lunch with Team</p>
                            <p className="text-[10px] text-slate-400">At 1:00 PM today</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AddTaskSidebar;

