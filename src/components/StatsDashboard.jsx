import React, { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';

const StatsDashboard = () => {
    const { state } = useTasks();

    const stats = useMemo(() => {
        const totalTasks = state.tasks.length;
        const completedTasks = state.tasks.filter(t => t.completed).length;
        const activeTasks = totalTasks - completedTasks;
        const highPriorityTasks = state.tasks.filter(t => t.priority === 'high' && !t.completed).length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        return { totalTasks, completedTasks, activeTasks, highPriorityTasks, completionRate };
    }, [state.tasks]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
            {/* Task Statistics */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Task Progress</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1 text-slate-800">{stats.completedTasks} <span className="text-base font-medium text-slate-400">/ {stats.totalTasks}</span></h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <span className="material-icons">analytics</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Completion Rate</span>
                        <span className="text-primary font-bold">{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${stats.completionRate}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Active Tasks */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Active Tasks</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1 text-slate-800">{stats.activeTasks}</h3>
                    </div>
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                        <span className="material-icons">pending_actions</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-lg">
                        <span className="material-icons text-xs">flag</span>
                        {stats.highPriorityTasks} high priority
                    </div>
                </div>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white p-4 md:p-5 rounded-xl border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Completed</p>
                        <h3 className="text-xl md:text-2xl font-bold mt-1 text-slate-800">{stats.completedTasks}</h3>
                    </div>
                    <div className="p-2 bg-green-500/10 rounded-xl text-green-500">
                        <span className="material-icons">task_alt</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span className="material-icons text-sm text-green-500">trending_up</span>
                    {stats.completionRate}% of all tasks completed
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
