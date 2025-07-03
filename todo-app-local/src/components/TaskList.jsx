/**
 * TaskList Component
 * Displays a list of tasks with filtering and sorting capabilities
 */

import { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc, CheckCircle, Circle, List } from 'lucide-react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ 
  tasks, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isLoading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt', 'title', 'priority'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  /**
   * Filters and sorts tasks based on current settings
   */
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    switch (filter) {
      case 'pending':
        result = result.filter(task => !task.completed);
        break;
      case 'completed':
        result = result.filter(task => task.completed);
        break;
      case 'all':
      default:
        // No filtering needed
        break;
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Sort by completion status (pending tasks first) if not sorting by other criteria
    if (sortBy === 'createdAt') {
      result.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });
    }

    return result;
  }, [tasks, searchTerm, filter, sortBy, sortOrder]);

  /**
   * Handles search input change
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Handles filter change
   */
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  /**
   * Handles sort change
   */
  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  /**
   * Gets task statistics
   */
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="task-list-container">
        <div className="loading-state">
          <div className="loading-spinner">⏳</div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-item">
          <List size={20} />
          <span>{taskStats.total} Total</span>
        </div>
        <div className="stat-item">
          <Circle size={20} />
          <span>{taskStats.pending} Pending</span>
        </div>
        <div className="stat-item">
          <CheckCircle size={20} />
          <span>{taskStats.completed} Completed</span>
        </div>
        <div className="stat-item completion-rate">
          <span>{taskStats.completionRate}% Complete</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="task-controls">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={16} />
            <button
              onClick={() => handleFilterChange('all')}
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('pending')}
              className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
            >
              Completed
            </button>
          </div>

          <div className="sort-group">
            {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`sort-button ${sortBy === 'createdAt' ? 'active' : ''}`}
            >
              Date
            </button>
            <button
              onClick={() => handleSortChange('title')}
              className={`sort-button ${sortBy === 'title' ? 'active' : ''}`}
            >
              Title
            </button>
            <button
              onClick={() => handleSortChange('priority')}
              className={`sort-button ${sortBy === 'priority' ? 'active' : ''}`}
            >
              Priority
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-state">
            {searchTerm || filter !== 'all' ? (
              <div>
                <p>No tasks match your current filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="clear-filters-button"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div>
                <List size={48} className="empty-icon" />
                <p>No tasks yet. Create your first task to get started!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="tasks">
            {filteredAndSortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {(searchTerm || filter !== 'all') && filteredAndSortedTasks.length > 0 && (
        <div className="results-summary">
          Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        </div>
      )}
    </div>
  );
};

export default TaskList;