import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';

const Header = () => {
    const { state, dispatch } = useTasks();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [newName, setNewName] = useState('');
    const [renameError, setRenameError] = useState('');
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const openRenameModal = () => {
        setNewName(state.userName || '');
        setRenameError('');
        setShowRenameModal(true);
        setShowProfileMenu(false);
    };

    const handleRenameSubmit = (e) => {
        e.preventDefault();
        const trimmed = newName.trim();
        if (!trimmed) {
            setRenameError('Name cannot be empty');
            return;
        }
        // Validation: no numbers allowed
        if (/\d/.test(trimmed)) {
            setRenameError('Name should not contain numbers');
            return;
        }
        dispatch({ type: 'SET_USERNAME', payload: trimmed });
        setShowRenameModal(false);
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        setShowLogoutConfirm(false);
        setShowProfileMenu(false);
    };

    return (
        <>
            <header className="h-14 md:h-16 border-b border-[#3A4A5A] bg-[#2C3E50]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 z-10">
                {/* Search */}
                <div className={`flex items-center flex-1 max-w-md ${mobileSearchOpen ? '' : 'hidden md:flex'}`}>
                    <div className="relative w-full">
                        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-[#1E2A36] border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all text-[#E0E0E0] placeholder-[#94A3B8]"
                            placeholder="Search tasks..."
                            type="text"
                            value={state.searchTerm}
                            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                        />
                    </div>
                    <button className="md:hidden ml-2 p-1 text-[#94A3B8]" onClick={() => setMobileSearchOpen(false)}>
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>

                {!mobileSearchOpen && (
                    <button className="md:hidden p-2 text-[#94A3B8] hover:bg-[#3A4A5A] rounded-full" onClick={() => setMobileSearchOpen(true)}>
                        <span className="material-icons">search</span>
                    </button>
                )}

                <div className={`flex items-center gap-2 md:gap-3 ${mobileSearchOpen ? 'hidden md:flex' : ''}`}>
                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 text-[#94A3B8] hover:bg-[#3A4A5A] rounded-full transition-colors relative"
                        >
                            <span className="material-icons">notifications</span>
                            {notifications.length > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#2C3E50] animate-pulse"></span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-72 md:w-80 bg-[#2C3E50] border border-[#3A4A5A] rounded-2xl shadow-xl overflow-hidden z-50"
                                style={{ animation: 'notifSlideDown 0.25s ease-out forwards' }}>
                                <div className="px-4 py-3 border-b border-[#3A4A5A] flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-[#E0E0E0]">Notifications</h3>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{notifications.length}</span>
                                </div>
                                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <span className="material-icons text-3xl text-[#4A5568] mb-2 block">notifications_off</span>
                                            <p className="text-sm text-[#94A3B8]">No pending notifications</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1E2A36] transition-colors border-b border-[#3A4A5A] last:border-b-0">
                                                <div className={`p-2 rounded-xl ${n.color}`}>
                                                    <span className="material-icons text-sm">{n.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-[#E0E0E0] truncate">{n.title}</p>
                                                    <p className="text-[10px] text-[#94A3B8] font-medium">{n.label}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile with Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 md:gap-3 focus:outline-none"
                        >
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold hover:bg-primary/20 transition-colors">
                                {initials}
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-[#E0E0E0]">{state.userName}</p>
                            </div>
                            <span className="material-icons text-[#94A3B8] text-sm">arrow_drop_down</span>
                        </button>

                        {/* Profile Dropdown Menu */}
                        {showProfileMenu && (
                            <div className="absolute right-0 top-12 w-48 bg-[#2C3E50] border border-[#3A4A5A] rounded-xl shadow-xl overflow-hidden z-50"
                                style={{ animation: 'notifSlideDown 0.2s ease-out forwards' }}>
                                <button
                                    onClick={openRenameModal}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#E0E0E0] hover:bg-[#1E2A36] transition-colors"
                                >
                                    <span className="material-icons text-[#94A3B8] text-lg">edit</span>
                                    Rename
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-[#1E2A36] transition-colors border-t border-[#3A4A5A]"
                                >
                                    <span className="material-icons text-lg">logout</span>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Rename Modal */}
            {showRenameModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-[#2C3E50] rounded-2xl p-6 w-full max-w-md border border-[#3A4A5A] shadow-2xl">
                        <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">Rename Profile</h3>
                        <form onSubmit={handleRenameSubmit}>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => { setNewName(e.target.value); setRenameError(''); }}
                                className="w-full px-4 py-3 bg-[#1E2A36] border border-[#3A4A5A] rounded-xl text-[#E0E0E0] placeholder-[#94A3B8] focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Enter new name"
                                autoFocus
                            />
                            {renameError && (
                                <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                                    <span className="material-icons text-xs">error</span>
                                    {renameError}
                                </p>
                            )}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRenameModal(false)}
                                    className="px-4 py-2 text-[#94A3B8] hover:text-[#E0E0E0] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-[#2C3E50] rounded-2xl p-6 w-full max-w-md border border-[#3A4A5A] shadow-2xl">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <span className="material-icons text-3xl">warning</span>
                            <h3 className="text-xl font-bold text-[#E0E0E0]">Confirm Logout</h3>
                        </div>
                        <p className="text-[#94A3B8] mb-6">
                            Are you sure you want to log out? All your tasks will be permanently deleted.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 text-[#94A3B8] hover:text-[#E0E0E0] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;