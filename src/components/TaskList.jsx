import React, { useMemo } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';

const TaskList = () => {
    const { state } = useTasks();
    const { tasks, filter, categoryFilter, sortBy, sortOrder } = state;

    const filteredAndSortedTasks = useMemo(() => {
        let filtered = tasks;
        if (filter === 'active') {
            filtered = tasks.filter((task) => !task.completed);
        } else if (filter === 'completed') {
            filtered = tasks.filter((task) => task.completed);
        } else if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = tasks.filter((task) => task.dueDate === today);
        }

        if (categoryFilter) {
            filtered = filtered.filter((task) => task.category === categoryFilter);
        }

        if (state.searchTerm) {
            const search = state.searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.title?.toLowerCase().includes(search) ||
                task.description?.toLowerCase().includes(search)
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;

            let comparison = 0;
            if (sortBy === 'date') {
                const dateA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
                const dateB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
                comparison = dateA - dateB;
            } else if (sortBy === 'priority') {
                const priorityWeight = { high: 3, medium: 2, low: 1 };
                comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [tasks, filter, categoryFilter, sortBy, sortOrder, state.searchTerm]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
            {categoryFilter && (
                <button
                    onClick={() => {
                        const sidebar = document.querySelector('.add-task-sidebar');
                        if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group bg-[#2C3E50]/50 p-6 rounded-xl border-2 border-dashed border-[#3A4A5A] flex flex-col items-center justify-center gap-3 min-h-[140px] md:min-h-[180px] hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-icons text-2xl">add</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-[#E0E0E0]">Create New Task</p>
                        <p className="text-xs text-[#94A3B8] mt-0.5">Add to {categoryFilter === 'work' ? 'Work' : 'Personal'}</p>
                    </div>
                </button>
            )}

            {filteredAndSortedTasks.length === 0 && !categoryFilter ? (
                <div className="col-span-full py-12 md:py-20 text-center flex flex-col items-center justify-center opacity-70">
                    <span className="material-icons text-5xl md:text-6xl mb-4 text-[#94A3B8]">task_alt</span>
                    <p className="text-base md:text-lg font-medium text-[#94A3B8]">✨ No tasks found in this category</p>
                </div>
            ) : (
                filteredAndSortedTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                ))
            )}
        </div>
    );
};

export default TaskList;