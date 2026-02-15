import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTasks } from '../hooks/useTasks';

const Header = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    const { state, dispatch } = useTasks();

    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
            <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                    <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
                        placeholder="Search tasks, tags, or categories..."
                        type="text"
                        value={state.searchTerm}
                        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                    <span className="material-icons">notifications</span>
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                </button>
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <span className="material-icons">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                </button>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold">Alex Johnson</p>
                       
                    </div>
                    
                </div>
            </div>
        </header>
    );
};

export default Header;

