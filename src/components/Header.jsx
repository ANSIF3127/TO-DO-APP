import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';

const Header = () => {
    const { state, dispatch } = useTasks();
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const notifRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Build notification items from tasks
    const notifications = useMemo(() => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        const items = [];
        state.tasks.forEach((task) => {
            if (task.completed || !task.dueDate) return;
            if (task.dueDate < todayStr) {
                items.push({ id: task.id, title: task.title, type: 'overdue', label: 'Overdue', icon: 'warning', color: 'text-red-500 bg-red-500/10' });
            } else if (task.dueDate === todayStr) {
                items.push({ id: task.id, title: task.title, type: 'today', label: 'Due Today', icon: 'schedule', color: 'text-amber-500 bg-amber-500/10' });
            } else if (task.dueDate === tomorrowStr) {
                items.push({ id: task.id, title: task.title, type: 'tomorrow', label: 'Due Tomorrow', icon: 'event', color: 'text-blue-500 bg-blue-500/10' });
            }
        });
        items.sort((a, b) => {
            const order = { overdue: 0, today: 1, tomorrow: 2 };
            return order[a.type] - order[b.type];
        });
        return items;
    }, [state.tasks]);

    const initials = state.userName
        ? state.userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <header className="h-14 md:h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10">
            {/* Search — full on desktop, toggle on mobile */}
            <div className={`flex items-center flex-1 max-w-md ${mobileSearchOpen ? '' : 'hidden md:flex'}`}>
                <div className="relative w-full">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 placeholder-slate-400"
                        placeholder="Search tasks..."
                        type="text"
                        value={state.searchTerm}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                    />
                </div>
                {/* Close search on mobile */}
                <button className="md:hidden ml-2 p-1 text-slate-400" onClick={() => setMobileSearchOpen(false)}>
                    <span className="material-icons text-xl">close</span>
                </button>
            </div>

            {/* Mobile search toggle */}
            {!mobileSearchOpen && (
                <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full" onClick={() => setMobileSearchOpen(true)}>
                    <span className="material-icons">search</span>
                </button>
            )}

            <div className={`flex items-center gap-2 md:gap-3 ${mobileSearchOpen ? 'hidden md:flex' : ''}`}>
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
                    >
                        <span className="material-icons">notifications</span>
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-12 w-72 md:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50"
                            style={{ animation: 'notifSlideDown 0.25s ease-out forwards' }}>
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
                            </div>
                            <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <span className="material-icons text-3xl text-slate-300 mb-2 block">notifications_off</span>
                                        <p className="text-sm text-slate-400">No pending notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div key={n.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0">
                                            <div className={`p-2 rounded-xl ${n.color}`}>
                                                <span className="material-icons text-sm">{n.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                                                <p className="text-[10px] text-slate-400 font-medium">{n.label}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {initials}
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-800">{state.userName}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                </div>
            </div>
        </header>
    );
};

export default Header;
