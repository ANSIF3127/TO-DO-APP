import React, { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';

const Sidebar = ({ onClose }) => {
    const { state, dispatch } = useTasks();

    const todayCount = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return state.tasks.filter(t => t.dueDate === today && !t.completed).length;
    }, [state.tasks]);

    const completedCount = useMemo(() => {
        return state.tasks.filter(t => t.completed).length;
    }, [state.tasks]);

    const workPendingCount = useMemo(() => {
        return state.tasks.filter(t => t.category === 'work' && !t.completed).length;
    }, [state.tasks]);

    const personalPendingCount = useMemo(() => {
        return state.tasks.filter(t => t.category === 'personal' && !t.completed).length;
    }, [state.tasks]);

    const allTasksCount = useMemo(() => {
        return state.tasks.filter(t => !t.completed).length;
    }, [state.tasks]);

    const storageInfo = useMemo(() => {
        const dataString = JSON.stringify(state.tasks);
        const sizeInBytes = new Blob([dataString]).size;
        const limitBytes = 4 * 1024 * 1024;
        const usedKB = (sizeInBytes / 1024).toFixed(1);
        const percent = Math.min((sizeInBytes / limitBytes) * 100, 100).toFixed(1);
        return { usedKB, percent };
    }, [state.tasks]);

    const isNavActive = (filterVal) => state.filter === filterVal && !state.categoryFilter;
    const isCatActive = (cat) => state.categoryFilter === cat;

    const handleNavClick = (type, payload) => {
        dispatch({ type, payload });
        if (onClose) onClose();
    };

    return (
        <aside className="w-64 h-full border-r border-[#3A4A5A] flex flex-col bg-[#2C3E50]">
            <div className="p-4 md:p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="material-icons text-white text-sm">check_circle</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight text-[#E0E0E0]">TaskFlow</h1>
                <button className="ml-auto p-1 text-[#94A3B8] hover:text-[#E0E0E0] lg:hidden" onClick={onClose}>
                    <span className="material-icons">close</span>
                </button>
            </div>
            <nav className="flex-1 px-3 md:px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="px-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Navigation</p>

                <button
                    onClick={() => handleNavClick('SET_FILTER', 'all')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                        isNavActive('all')
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-[#94A3B8] hover:bg-[#1E2A36]'
                    }`}
                >
                    <span className="material-icons text-xl">grid_view</span>
                    All Tasks
                    {allTasksCount > 0 && (
                        <span className="ml-auto text-xs bg-[#3A4A5A] text-[#94A3B8] px-2 py-0.5 rounded-full font-bold">{allTasksCount}</span>
                    )}
                </button>

                <button
                    onClick={() => handleNavClick('SET_FILTER', 'today')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                        isNavActive('today')
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-[#94A3B8] hover:bg-[#1E2A36]'
                    }`}
                >
                    <span className="material-icons text-xl">today</span>
                    Today
                    {todayCount > 0 && (
                        <span className="ml-auto text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">{todayCount}</span>
                    )}
                </button>

                <button
                    onClick={() => handleNavClick('SET_FILTER', 'completed')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                        isNavActive('completed')
                            ? 'bg-primary/10 text-primary shadow-sm'
                            : 'text-[#94A3B8] hover:bg-[#1E2A36]'
                    }`}
                >
                    <span className="material-icons text-xl">verified</span>
                    Completed
                    {completedCount > 0 && (
                        <span className="ml-auto text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full font-bold">{completedCount}</span>
                    )}
                </button>

                <div className="pt-6 pb-4">
                    <p className="px-3 text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Categories</p>

                    <button
                        onClick={() => handleNavClick('SET_CATEGORY_FILTER', 'work')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                            isCatActive('work')
                                ? 'bg-blue-500/10 text-blue-500 shadow-sm'
                                : 'text-[#94A3B8] hover:bg-[#1E2A36]'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        Work
                        {workPendingCount > 0 && (
                            <span className="ml-auto text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full font-bold">{workPendingCount}</span>
                        )}
                    </button>

                    <button
                        onClick={() => handleNavClick('SET_CATEGORY_FILTER', 'personal')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all ${
                            isCatActive('personal')
                                ? 'bg-purple-500/10 text-purple-500 shadow-sm'
                                : 'text-[#94A3B8] hover:bg-[#1E2A36]'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        Personal
                        {personalPendingCount > 0 && (
                            <span className="ml-auto text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded-full font-bold">{personalPendingCount}</span>
                        )}
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-[#3A4A5A]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[#94A3B8] text-sm font-medium">Storage Usage</p>
                        <h3 className="text-2xl font-bold mt-1 text-[#E0E0E0]">{storageInfo.usedKB} <span className="text-sm font-medium text-[#94A3B8]">KB</span></h3>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <span className="material-icons">cloud_queue</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-[#94A3B8]">Total 4MB available</span>
                        <span className="text-amber-500">{storageInfo.percent}%</span>
                    </div>
                    <div className="w-full bg-[#1E2A36] h-2 rounded-full">
                        <div
                            className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${storageInfo.percent}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;