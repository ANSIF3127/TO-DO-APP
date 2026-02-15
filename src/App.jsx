import React from 'react';
import { useTasks } from './hooks/useTasks';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import StatsDashboard from './components/StatsDashboard.jsx';
import TaskList from './components/TaskList.jsx';
import AddTaskSidebar from './components/AddTaskSidebar.jsx';
import Toast from './components/Toast.jsx';

function App() {
  const { state, dispatch } = useTasks();

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const getFilterTitle = () => {
    switch (state.filter) {
      case 'completed': return 'Completed Tasks';
      case 'today': return 'Tasks for Today';
      case 'active': return 'Active Tasks';
      default: return 'All Tasks';
    }
  };

  const getFilteredCount = () => {
    const search = state.searchTerm.toLowerCase();
    return state.tasks.filter(t => {
      // Filter logic (mirroring TaskList)
      let matchesFilter = true;
      if (state.filter === 'active') matchesFilter = !t.completed;
      else if (state.filter === 'completed') matchesFilter = t.completed;
      else if (state.filter === 'today') matchesFilter = t.dueDate === new Date().toISOString().split('T')[0];

      // Search logic
      const matchesSearch = !search ||
        t.title?.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    }).length;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 selection:bg-primary/30">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {state.toasts.map(t => (
          <Toast key={t.id} t={t} onRemove={removeToast} />
        ))}
      </div>

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Stats Section */}
          <StatsDashboard />

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {getFilterTitle()}
              <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-lg">
                {getFilteredCount()}
              </span>
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch({ type: 'SET_SORT', payload: { sortBy: 'priority', sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' } })}
                className="p-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Sort by Priority"
              >
                <span className="material-icons text-sm">sort</span>
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_SORT', payload: { sortBy: 'date', sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' } })}
                className="p-2 bg-white dark:bg-card-dark border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Sort by Date"
              >
                <span className="material-icons text-sm">filter_list</span>
              </button>
            </div>
          </div>

          {/* Tasks Grid */}
          <TaskList />
        </div>
      </main>

      {/* Right Sidebar - Create Task */}
      <AddTaskSidebar />
    </div>
  );
}

export default App;