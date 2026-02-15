import React from 'react';
import { useTasks } from '../hooks/useTasks';

const StatsDashboard = () => {
    const { state } = useTasks();
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Storage usage calculationssssssss
    const dataString = JSON.stringify(state.tasks);
    const sizeInBytes = new Blob([dataString]).size;
    const storageLimit = 4 * 1024 * 1024; // 4MB
    const storagePercent = Math.min((sizeInBytes / storageLimit) * 100, 100);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Task Statistics</p>
                        <h3 className="text-2xl font-bold mt-1">{completedTasks} / {totalTasks}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <span className="material-icons">analytics</span>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-400">Completion Rate</span>
                        <span className="text-primary">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                        <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
                    </div>
                </div>
            </div>

           
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg shadow-primary/20 flex flex-col justify-center">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <span className="material-icons text-3xl">add_task</span>
                    </div>
                    <div>
                        <p className="text-white/80 text-sm">Need to do more?</p>
                        <button className="text-lg font-bold hover:underline">Create New Task</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;

