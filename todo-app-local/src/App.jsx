/**
 * Main App Component
 * Manages the overall application state and coordinates between components
 */

import { useState, useEffect } from 'react';
import { CheckSquare, Trash2, RotateCcw } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import './App.css';

function App() {
  const {
    tasks,
    loading,
    error,
    taskStats,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearAllTasks,
    setError
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  /**
   * Handles adding a new task
   * @param {Object} taskData - Task data from form
   */
  const handleAddTask = async (taskData) => {
    const success = await addTask(taskData);
    if (success) {
      // Task added successfully
      console.log('Task added successfully');
    }
  };

  /**
   * Handles updating an existing task
   * @param {Object} taskData - Updated task data from form
   */
  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    const success = await updateTask(editingTask.id, taskData);
    if (success) {
      setEditingTask(null);
      console.log('Task updated successfully');
    }
  };

  /**
   * Handles form submission (add or update)
   * @param {Object} taskData - Task data from form
   */
  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      await handleUpdateTask(taskData);
    } else {
      await handleAddTask(taskData);
    }
  };

  /**
   * Handles editing a task
   * @param {Object} task - Task to edit
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Handles canceling edit mode
   */
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  /**
   * Handles clearing all tasks with confirmation
   */
  const handleClearAllTasks = async () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }

    const success = await clearAllTasks();
    if (success) {
      setShowClearConfirm(false);
      setEditingTask(null);
      console.log('All tasks cleared successfully');
    }
  };

  /**
   * Handles canceling clear all confirmation
   */
  const handleCancelClear = () => {
    setShowClearConfirm(false);
  };

  /**
   * Dismisses error messages
   */
  const handleDismissError = () => {
    setError(null);
  };

  // Auto-dismiss errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  return (
    <div className="app">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">
              <CheckSquare size={32} />
              TODO App
            </h1>
            <p className="app-subtitle">
              Organize your tasks with local storage persistence
            </p>
          </div>
          
          {/* Clear All Button */}
          {tasks.length > 0 && (
            <div className="header-actions">
              {showClearConfirm ? (
                <div className="clear-confirmation">
                  <span className="confirm-text">Clear all tasks?</span>
                  <button
                    onClick={handleClearAllTasks}
                    className="confirm-clear-button"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleCancelClear}
                    className="cancel-clear-button"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleClearAllTasks}
                  className="clear-all-button"
                  title="Clear all tasks"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              )}
            </div>
          )}
        </header>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-message">{error}</span>
              <button
                onClick={handleDismissError}
                className="error-dismiss"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="app-main">
          {/* Task Form */}
          <section className="form-section">
            <TaskForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancelEdit}
              editingTask={editingTask}
              isLoading={loading}
            />
          </section>

          {/* Task List */}
          <section className="list-section">
            <TaskList
              tasks={tasks}
              onToggleComplete={toggleTaskCompletion}
              onEdit={handleEditTask}
              onDelete={deleteTask}
              isLoading={loading}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p>
              Built with React and localStorage • 
              {taskStats.total > 0 && (
                <span className="footer-stats">
                  {taskStats.completed}/{taskStats.total} tasks completed
                </span>
              )}
            </p>
            {taskStats.total > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${taskStats.completionRate}%` }}
                />
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
