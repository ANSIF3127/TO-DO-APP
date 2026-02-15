import React from 'react';
import { useTasks } from '../hooks/useTasks';

const Sidebar = () => {
    const { state, dispatch } = useTasks();
    const todayCount = state.tasks.filter(t => {
        const today = new Date().toISOString().split('T')[0];
        return t.dueDate === today && !t.completed;
    }).length;

    return (
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-background-dark">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="material-icons text-white text-sm">check_circle</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
                <button
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'all' })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium group transition-colors ${state.filter === 'all' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <span className="material-icons text-xl">grid_view</span>
                    All Tasks
                </button>
                <button
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'today' })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium group transition-colors ${state.filter === 'today' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <span className="material-icons text-xl">today</span>
                    Today
                    {todayCount > 0 && (
                        <span className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{todayCount}</span>
                    )}
                </button>
              
                <button
                    onClick={() => dispatch({ type: 'SET_FILTER', payload: 'completed' })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium group transition-colors ${state.filter === 'completed' ? 'bg-primary/10 text-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    <span className="material-icons text-xl">verified</span>
                    Completed
                </button>

                <div className="pt-8 pb-4">
                    <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Categories</p>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Work
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Personal
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Design
                    </button>
                </div>
            </nav>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Storage Usage</p>
                        <h3 className="text-2xl font-bold mt-1"> MB</h3>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <span className="material-icons">cloud_queue</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Total 4MB available</span>
                        <span className="text-amber-500">%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                        <div className="bg-amber-500 h-2 rounded-full transition-all duration-500" ></div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

