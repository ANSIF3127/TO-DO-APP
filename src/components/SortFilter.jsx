import React from 'react';
import { useTasks } from '../hooks/useTasks';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const SortFilter = () => {
  const { state, dispatch } = useTasks();
  const { filter, sortBy, sortOrder } = state;

  const handleFilterChange = (e) => {
    dispatch({ type: 'SET_FILTER', payload: e.target.value });
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    dispatch({ type: 'SET_SORT', payload: { sortBy: newSortBy, sortOrder } });
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch({ type: 'SET_SORT', payload: { sortBy, sortOrder: newOrder } });
  };

  return (
    <div className="sort-filter-bar">
      <div className="filter-group">
        <label>Filter Status</label>
        <select value={filter} onChange={handleFilterChange} className="option-select">
          <option value="all">Total Intel</option>
          <option value="active">Active Missions</option>
          <option value="completed">Completed Missions</option>
        </select>
      </div>

      <div className="sort-group">
        <label>Sort Intel</label>
        <select value={sortBy} onChange={handleSortChange} className="option-select">
          <option value="date">Mission Date</option>
          <option value="priority">Priority Clearance</option>
        </select>
        <button onClick={toggleSortOrder} className="theme-toggle" style={{ width: '40px', height: '40px' }} title="Toggle Sort Flow">
          {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
        </button>
      </div>
    </div>
  );
};

export default SortFilter;