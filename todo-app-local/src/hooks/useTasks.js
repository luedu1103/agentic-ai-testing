/**
 * Custom hook for managing TODO tasks with localStorage persistence
 * Provides state management and CRUD operations for tasks
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTasks,
  addTask as addTaskToStorage,
  updateTask as updateTaskInStorage,
  deleteTask as deleteTaskFromStorage,
  toggleTaskCompletion as toggleTaskInStorage,
  clearAllTasks as clearAllTasksFromStorage
} from '../utils/localStorage';

/**
 * Custom hook for task management
 * @returns {Object} Object containing tasks state and management functions
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const storedTasks = getTasks();
      setTasks(storedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adds a new task
   * @param {Object} taskData - Task data (title, description, etc.)
   * @returns {Promise<boolean>} Success status
   */
  const addTask = useCallback(async (taskData) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description || '',
        completed: false,
        priority: taskData.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const success = addTaskToStorage(newTask);
      if (success) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to save task');
      }
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
      return false;
    }
  }, []);

  /**
   * Updates an existing task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<boolean>} Success status
   */
  const updateTask = useCallback(async (id, updates) => {
    try {
      const success = updateTaskInStorage(id, updates);
      if (success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        );
        setError(null);
        return true;
      } else {
        throw new Error('Failed to update task');
      }
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      return false;
    }
  }, []);

  /**
   * Deletes a task
   * @param {string} id - Task ID to delete
   * @returns {Promise<boolean>} Success status
   */
  const deleteTask = useCallback(async (id) => {
    try {
      const success = deleteTaskFromStorage(id);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        setError(null);
        return true;
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      return false;
    }
  }, []);

  /**
   * Toggles task completion status
   * @param {string} id - Task ID to toggle
   * @returns {Promise<boolean>} Success status
   */
  const toggleTaskCompletion = useCallback(async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) {
        throw new Error('Task not found');
      }

      const success = toggleTaskInStorage(id);
      if (success) {
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
              : task
          )
        );
        setError(null);
        return true;
      } else {
        throw new Error('Failed to toggle task completion');
      }
    } catch (err) {
      setError('Failed to toggle task completion');
      console.error('Error toggling task completion:', err);
      return false;
    }
  }, [tasks]);

  /**
   * Clears all tasks
   * @returns {Promise<boolean>} Success status
   */
  const clearAllTasks = useCallback(async () => {
    try {
      const success = clearAllTasksFromStorage();
      if (success) {
        setTasks([]);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to clear tasks');
      }
    } catch (err) {
      setError('Failed to clear tasks');
      console.error('Error clearing tasks:', err);
      return false;
    }
  }, []);

  /**
   * Gets filtered and sorted tasks
   * @param {Object} options - Filter and sort options
   * @returns {Array} Filtered and sorted tasks
   */
  const getFilteredTasks = useCallback((options = {}) => {
    const { filter = 'all', sortBy = 'createdAt', sortOrder = 'desc' } = options;
    
    let filteredTasks = [...tasks];

    // Apply filter
    switch (filter) {
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      case 'pending':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'all':
      default:
        // No filtering needed
        break;
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle date strings
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filteredTasks;
  }, [tasks]);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    completionRate: tasks.length > 0 ? (tasks.filter(task => task.completed).length / tasks.length) * 100 : 0
  };

  return {
    tasks,
    loading,
    error,
    taskStats,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearAllTasks,
    getFilteredTasks,
    setError
  };
};