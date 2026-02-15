import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';

const AddTaskSidebar = ({ isMobile }) => {
    const { state, dispatch } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState(state.categoryFilter || 'work');
    const [dueTime, setDueTime] = useState('09:00');
    const [dueDate, setDueDate] = useState('');

    const timePresets = [
        { label: 'Morning', value: '09:00', icon: 'wb_sunny' },
        { label: 'Afternoon', value: '14:00', icon: 'wb_cloudy' },
        { label: 'Evening', value: '19:00', icon: 'nights_stay' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            dispatch({
                type: 'ADD_TOAST',
                payload: { message: 'Task name is required', type: 'error' }
            });
            return;
        }

        const newTask = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            priority,
            category,
            dueTime,
            time: dueTime,
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            completed: false,
            pinned: false,
        };

        dispatch({ type: 'ADD_TASK', payload: newTask });
        dispatch({
            type: 'ADD_TOAST',
            payload: { message: 'Task Created Successfully', type: 'success' }
        });

        // Reset form
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueTime('09:00');
        setDueDate('');
    };

    // Sync category with sidebar filter
    React.useEffect(() => {
        if (state.categoryFilter) {
            setCategory(state.categoryFilter);
        }
    }, [state.categoryFilter]);

    // For mobile, render just the form content without the aside wrapper
    if (isMobile) {
        return (
            <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Task Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-slate-900 outline-none transition-all"
                            placeholder="e.g. Design homepage"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none text-slate-900 outline-none transition-all"
                            placeholder="Write some details..."
                            rows="3"
                        ></textarea>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setCategory('work')}
                                className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${category === 'work' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-200 text-slate-400 hover:border-blue-500/50'}`}
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Work
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory('personal')}
                                className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${category === 'personal' ? 'border-purple-500 bg-purple-500/10 text-purple-500' : 'border-slate-200 text-slate-400 hover:border-purple-500/50'}`}
                            >
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Personal
                            </button>
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Priority</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setPriority('high')}
                                className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${priority === 'high' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-500/50'}`}
                            >High</button>
                            <button
                                type="button"
                                onClick={() => setPriority('medium')}
                                className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${priority === 'medium' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-slate-200 text-slate-400 hover:border-green-500/50'}`}
                            >Med</button>
                            <button
                                type="button"
                                onClick={() => setPriority('low')}
                                className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${priority === 'low' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-200 text-slate-400 hover:border-blue-500/50'}`}
                            >Low</button>
                        </div>
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Time Setting</label>
                        <div className="flex gap-2 mb-3">
                            {timePresets.map(preset => (
                                <button
                                    key={preset.label}
                                    type="button"
                                    onClick={() => setDueTime(preset.value)}
                                    className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 text-xs border rounded-xl font-medium transition-all ${dueTime === preset.value ? 'bg-primary/10 text-primary border-primary/30' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-primary/30'}`}
                                >
                                    <span className="material-icons text-sm">{preset.icon}</span>
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
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">schedule</span>
                            <input
                                type="time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <aside className="add-task-sidebar hidden lg:flex w-80 border-l border-slate-200 flex-col bg-white p-6 overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-bold mb-6 text-slate-800">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Task Name</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-slate-900 outline-none transition-all"
                        placeholder="e.g. Design homepage"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none text-slate-900 outline-none transition-all"
                        placeholder="Write some details..."
                        rows="3"
                    ></textarea>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Category</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setCategory('work')}
                            className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${category === 'work' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-200 text-slate-400 hover:border-blue-500/50'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Work
                        </button>
                        <button
                            type="button"
                            onClick={() => setCategory('personal')}
                            className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${category === 'personal' ? 'border-purple-500 bg-purple-500/10 text-purple-500' : 'border-slate-200 text-slate-400 hover:border-purple-500/50'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Personal
                        </button>
                    </div>
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Priority</label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setPriority('high')}
                            className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${priority === 'high' ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-500/50'}`}
                        >High</button>
                        <button
                            type="button"
                            onClick={() => setPriority('medium')}
                            className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${priority === 'medium' ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-slate-200 text-slate-400 hover:border-green-500/50'}`}
                        >Med</button>
                        <button
                            type="button"
                            onClick={() => setPriority('low')}
                            className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${priority === 'low' ? 'border-blue-500 bg-blue-500/10 text-blue-500' : 'border-slate-200 text-slate-400 hover:border-blue-500/50'}`}
                        >Low</button>
                    </div>
                </div>

                {/* Time */}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Time Setting</label>
                    <div className="flex gap-2 mb-3">
                        {timePresets.map(preset => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => setDueTime(preset.value)}
                                className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 text-xs border rounded-xl font-medium transition-all ${dueTime === preset.value ? 'bg-primary/10 text-primary border-primary/30' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-primary/30'}`}
                            >
                                <span className="material-icons text-sm">{preset.icon}</span>
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
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 outline-none transition-all"
                        />
                    </div>
                    <div className="relative">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">schedule</span>
                        <input
                            type="time"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-slate-900 outline-none transition-all"
                        />
                    </div>
                </div>
                <div className="pt-2">
                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                        Save Task
                    </button>
                </div>
            </form>

            {/* Upcoming Reminders */}
            <div className="mt-8 border-t border-slate-200 pt-6">
                <h3 className="text-sm font-bold mb-4 flex items-center justify-between text-slate-900">
                    Upcoming Reminders
                    <span className="material-icons text-slate-400 text-sm">more_horiz</span>
                </h3>
                <div className="space-y-3">
                    {state.tasks
                        .filter(t => !t.completed && t.dueDate)
                        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                        .slice(0, 3)
                        .map(task => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className={`p-2 rounded-xl ${task.priority === 'high' ? 'bg-red-500/10 text-red-500' : task.priority === 'medium' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    <span className="material-icons text-sm">notifications_active</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 truncate">{task.title}</p>
                                    <p className="text-[10px] text-slate-400">{task.dueDate} • {task.dueTime || task.time || 'Anytime'}</p>
                                </div>
                            </div>
                        ))
                    }
                    {state.tasks.filter(t => !t.completed && t.dueDate).length === 0 && (
                        <p className="text-xs text-slate-400 text-center py-4">No upcoming reminders</p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default AddTaskSidebar;
