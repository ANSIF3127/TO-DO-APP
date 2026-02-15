import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { formatTo12Hour } from '../utils/formatTime';

const AddTaskSidebar = ({ isMobile }) => {
    const { state, dispatch } = useTasks();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState(state.categoryFilter || 'work');
    const [dueTime, setDueTime] = useState('09:00');
    const [dueDate, setDueDate] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date()); // for live reminders

    // Update current time every minute to re‑filter reminders
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // 12‑hour picker state
    const [hour12, setHour12] = useState(9);
    const [minute, setMinute] = useState('00');
    const [ampm, setAmPm] = useState('AM');

    // Update picker when dueTime changes (e.g., from presets)
    useEffect(() => {
        if (dueTime) {
            const [hour24, min] = dueTime.split(':');
            const h24 = parseInt(hour24, 10);
            setHour12(h24 % 12 || 12);
            setMinute(min);
            setAmPm(h24 >= 12 ? 'PM' : 'AM');
        }
    }, [dueTime]);

    // Update dueTime when picker changes
    useEffect(() => {
        let h24 = hour12;
        if (ampm === 'PM' && hour12 !== 12) h24 += 12;
        if (ampm === 'AM' && hour12 === 12) h24 = 0;
        const paddedHour = h24.toString().padStart(2, '0');
        setDueTime(`${paddedHour}:${minute}`);
    }, [hour12, minute, ampm]);

    const timePresets = [
        { label: 'Morning', value: '09:00' },
        { label: 'Afternoon', value: '14:00' },
        { label: 'Evening', value: '19:00' },
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
            dueDate: dueDate || new Date().toLocaleDateString('en-CA'), // local date
            completed: false,
            pinned: false,
        };

        dispatch({ type: 'ADD_TASK', payload: newTask });
        dispatch({
            type: 'ADD_TOAST',
            payload: { message: 'Task Created Successfully', type: 'success' }
        });

        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueTime('09:00');
        setDueDate('');
    };

    useEffect(() => {
        if (state.categoryFilter) {
            setCategory(state.categoryFilter);
        }
    }, [state.categoryFilter]);

    
    const formFields = (
        <>
            {/* Task Name */}
            <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Task Name</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1E2A36] border border-[#3A4A5A] rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-[#E0E0E0] placeholder-[#94A3B8] outline-none transition-all"
                    placeholder="....."
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#1E2A36] border border-[#3A4A5A] rounded-xl text-sm focus:ring-2 focus:ring-primary/50 text-[#E0E0E0] placeholder-[#94A3B8] resize-none outline-none transition-all"
                    placeholder="Write some details..."
                    rows="3"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Category</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setCategory('work')}
                        className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${
                            category === 'work'
                                ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                : 'border-[#3A4A5A] text-[#94A3B8] hover:border-blue-500/50'
                        }`}
                    >
                        Work
                    </button>
                    <button
                        type="button"
                        onClick={() => setCategory('personal')}
                        className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${
                            category === 'personal'
                                ? 'border-purple-500 bg-purple-500/10 text-purple-500'
                                : 'border-[#3A4A5A] text-[#94A3B8] hover:border-purple-500/50'
                        }`}
                    >
                        Personal
                    </button>
                </div>
            </div>

            {/* Priority */}
            <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Priority</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setPriority('high')}
                        className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${
                            priority === 'high'
                                ? 'border-red-500 bg-red-500/10 text-red-500'
                                : 'border-[#3A4A5A] text-[#94A3B8] hover:border-red-500/50'
                        }`}
                    >
                        High
                    </button>
                    <button
                        type="button"
                        onClick={() => setPriority('medium')}
                        className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${
                            priority === 'medium'
                                ? 'border-green-500 bg-green-500/10 text-green-500'
                                : 'border-[#3A4A5A] text-[#94A3B8] hover:border-green-500/50'
                        }`}
                    >
                        Med
                    </button>
                    <button
                        type="button"
                        onClick={() => setPriority('low')}
                        className={`flex-1 py-2.5 text-xs font-bold border-2 rounded-xl transition-all ${
                            priority === 'low'
                                ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                                : 'border-[#3A4A5A] text-[#94A3B8] hover:border-blue-500/50'
                        }`}
                    >
                        Low
                    </button>
                </div>
            </div>

            {/* Time */}
            <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-2">Time Setting</label>

                {/* Presets */}
                <div className="flex gap-2 mb-3">
                    {timePresets.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => setDueTime(preset.value)}
                            className={`flex-1 py-2 text-xs font-medium border rounded-lg transition-all ${
                                dueTime === preset.value
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-[#1E2A36] text-[#94A3B8] border-[#3A4A5A] hover:border-primary/50'
                            }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                {/* Custom Time Picker */}
                <div className="bg-[#1E2A36] border border-[#3A4A5A] rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        {/* Hour */}
                        <select
                            value={hour12}
                            onChange={(e) => setHour12(parseInt(e.target.value, 10))}
                            className="w-20 px-2 py-2 bg-[#2C3E50] text-[#E0E0E0] text-sm font-medium rounded-lg border border-[#3A4A5A] focus:ring-2 focus:ring-primary/50 outline-none"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                                <option key={h} value={h}>
                                    {h.toString().padStart(2, '0')}
                                </option>
                            ))}
                        </select>

                        <span className="text-xl font-bold text-primary">:</span>

                        {/* Minute */}
                        <select
                            value={minute}
                            onChange={(e) => setMinute(e.target.value)}
                            className="w-20 px-2 py-2 bg-[#2C3E50] text-[#E0E0E0] text-sm font-medium rounded-lg border border-[#3A4A5A] focus:ring-2 focus:ring-primary/50 outline-none"
                        >
                            {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>

                        {/* AM/PM Toggle */}
                        <div className="flex gap-1 ml-auto">
                            <button
                                type="button"
                                onClick={() => setAmPm('AM')}
                                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                                    ampm === 'AM'
                                        ? 'bg-primary text-white'
                                        : 'bg-[#2C3E50] text-[#94A3B8] border border-[#3A4A5A] hover:bg-[#3A4A5A]'
                                }`}
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                onClick={() => setAmPm('PM')}
                                className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                                    ampm === 'PM'
                                        ? 'bg-primary text-white'
                                        : 'bg-[#2C3E50] text-[#94A3B8] border border-[#3A4A5A] hover:bg-[#3A4A5A]'
                                }`}
                            >
                                PM
                            </button>
                        </div>
                    </div>

                    {/* Selected time indicator */}
                    <div className="mt-2 text-xs text-center text-primary/80">
                        Selected: {formatTo12Hour(dueTime)}
                    </div>
                </div>

                {/* Date Picker */}
                <div className="mt-3">
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#1E2A36] border border-[#3A4A5A] rounded-lg text-sm focus:ring-2 focus:ring-primary/50 text-[#E0E0E0] outline-none"
                    />
                </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    Save Task
                </button>
            </div>
        </>
    );

    if (isMobile) {
        return (
            <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {formFields}
                </form>
            </div>
        );
    }

    // Desktop version
    return (
        <aside className="add-task-sidebar hidden lg:flex w-80 border-l border-[#3A4A5A] flex-col bg-[#2C3E50] h-full overflow-y-auto custom-scrollbar">
            <div className="p-6 flex-1">
                <h2 className="text-lg font-bold mb-6 text-[#E0E0E0]">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {formFields}
                </form>

                {/* Upcoming Reminders – live update with local date/time */}
                <div className="mt-8 border-t border-[#3A4A5A] pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-sm font-bold text-[#E0E0E0]">Upcoming Reminders</h3>
                        <div className="flex gap-0.5">
                            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse delay-150"></span>
                            <span className="w-1 h-1 rounded-full bg-red-700 animate-pulse delay-300"></span>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                        {(() => {
                            const now = currentTime;
                            const todayStr = now.toLocaleDateString('en-CA'); // local YYYY-MM-DD
                            const currentMinutes = now.getHours() * 60 + now.getMinutes();

                            const upcomingTasks = state.tasks
                                .filter((t) => !t.completed && t.dueDate)
                                .filter((t) => {
                                    // Future date
                                    if (t.dueDate > todayStr) return true;
                                    // Today – check time if present
                                    if (t.dueDate === todayStr) {
                                        if (t.dueTime) {
                                            const [hour, minute] = t.dueTime.split(':').map(Number);
                                            const dueMinutes = hour * 60 + minute;
                                            return dueMinutes > currentMinutes;
                                        }
                                        return true; // no time – treat as all day
                                    }
                                    return false; // past date
                                })
                                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                                .slice(0, 3);

                            return upcomingTasks.length > 0 ? (
                                upcomingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center gap-3 p-3 bg-[#1E2A36] rounded-xl border border-[#3A4A5A]"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-[#E0E0E0] truncate">{task.title}</p>
                                            <p className="text-[10px] text-[#94A3B8]">
                                                {task.dueDate} • {formatTo12Hour(task.dueTime || task.time) || 'Anytime'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-[#94A3B8] text-center py-4">No upcoming reminders</p>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default AddTaskSidebar;