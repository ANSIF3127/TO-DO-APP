import React, { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import StatsDashboard from './components/StatsDashboard.jsx';
import TaskList from './components/TaskList.jsx';
import AddTaskSidebar from './components/AddTaskSidebar.jsx';
import Toast from './components/Toast.jsx';

function App() {
  const { state, dispatch } = useTasks();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const removeToast = (id) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  const getFilterTitle = () => {
    if (state.categoryFilter === 'work') return 'Work Tasks';
    if (state.categoryFilter === 'personal') return 'Personal Tasks';
    switch (state.filter) {
      case 'completed': return 'Completed Tasks';
      case 'today': return "Today's Tasks";
      case 'active': return 'Active Tasks';
      default: return 'All Tasks';
    }
  };

  const getFilteredCount = () => {
    const search = state.searchTerm.toLowerCase();
    return state.tasks.filter(t => {
      let matchesFilter = true;
      if (state.filter === 'active') matchesFilter = !t.completed;
      else if (state.filter === 'completed') matchesFilter = t.completed;
      else if (state.filter === 'today') matchesFilter = t.dueDate === new Date().toISOString().split('T')[0];

      let matchesCategory = true;
      if (state.categoryFilter) {
        matchesCategory = t.category === state.categoryFilter;
      }

      const matchesSearch = !search ||
        t.title?.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search);

      return matchesFilter && matchesCategory && matchesSearch;
    }).length;
  };

  if (!state.userName) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#212529] text-[#E0E0E0] selection:bg-primary/30">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {state.toasts.map(t => (
          <Toast key={t.id} t={t} onRemove={removeToast} />
        ))}
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-b border-[#3A4A5A] bg-[#2C3E50]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[#94A3B8] hover:bg-[#3A4A5A] rounded-lg">
            <span className="material-icons">menu</span>
          </button>
          <h1 className="text-lg font-bold tracking-tight flex-1 text-[#E0E0E0]">TaskFlow</h1>
          <button onClick={() => setAddTaskOpen(true)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
            <span className="material-icons">add_circle</span>
          </button>
        </div>

        <Header />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <StatsDashboard />

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2 text-[#E0E0E0]">
              {getFilterTitle()}
              <span className="text-xs bg-[#3A4A5A] text-[#94A3B8] px-2.5 py-1 rounded-lg">
                {getFilteredCount()}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'SET_SORT', payload: { sortBy: 'priority', sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' } })}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${
                  state.sortBy === 'priority'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-[#2C3E50] border-[#3A4A5A] text-[#94A3B8] hover:bg-[#3A4A5A]'
                }`}
                title="Sort by Priority"
              >
                <span className="material-icons text-sm">flag</span>
                Priority
                {state.sortBy === 'priority' && (
                  <span className="material-icons text-xs">{state.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>
                )}
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_SORT', payload: { sortBy: 'date', sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' } })}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-semibold transition-all ${
                  state.sortBy === 'date'
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-[#2C3E50] border-[#3A4A5A] text-[#94A3B8] hover:bg-[#3A4A5A]'
                }`}
                title="Sort by Date"
              >
                <span className="material-icons text-sm">calendar_month</span>
                Date
                {state.sortBy === 'date' && (
                  <span className="material-icons text-xs">{state.sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}</span>
                )}
              </button>
            </div>
          </div>

          <TaskList />
        </div>
      </main>

      {/* Right Sidebar - Create Task (desktop) - with h-full to fix overflow */}
      <div className="hidden lg:block h-full">
        <AddTaskSidebar />
      </div>

      {/* Mobile Add Task Overlay */}
      {addTaskOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setAddTaskOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#2C3E50] shadow-2xl overflow-y-auto animate-in slide-in-from-right">
            <div className="flex items-center justify-between p-4 border-b border-[#3A4A5A]">
              <h2 className="text-lg font-bold text-[#E0E0E0]">Create New Task</h2>
              <button onClick={() => setAddTaskOpen(false)} className="p-2 text-[#94A3B8] hover:text-[#E0E0E0] rounded-lg">
                <span className="material-icons">close</span>
              </button>
            </div>
            <AddTaskSidebar isMobile />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;