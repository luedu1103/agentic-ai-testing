/**
 * Utility functions for managing TODO data in localStorage
 * Provides a simple API for CRUD operations with automatic JSON serialization
 */

const STORAGE_KEY = 'todo-app-tasks';

/**
 * Retrieves all tasks from localStorage
 * @returns {Array} Array of task objects
 */
export const getTasks = () => {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error retrieving tasks from localStorage:', error);
    return [];
  }
};

/**
 * Saves tasks array to localStorage
 * @param {Array} tasks - Array of task objects to save
 * @returns {boolean} Success status
 */
export const saveTasks = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
    return false;
  }
};

/**
 * Adds a new task to localStorage
 * @param {Object} task - Task object to add
 * @returns {boolean} Success status
 */
export const addTask = (task) => {
  try {
    const tasks = getTasks();
    const newTask = {
      ...task,
      id: task.id || Date.now().toString(),
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasks.push(newTask);
    return saveTasks(tasks);
  } catch (error) {
    console.error('Error adding task:', error);
    return false;
  }
};

/**
 * Updates an existing task in localStorage
 * @param {string} id - Task ID to update
 * @param {Object} updates - Object containing fields to update
 * @returns {boolean} Success status
 */
export const updateTask = (id, updates) => {
  try {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      console.warn(`Task with id ${id} not found`);
      return false;
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return saveTasks(tasks);
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

/**
 * Deletes a task from localStorage
 * @param {string} id - Task ID to delete
 * @returns {boolean} Success status
 */
export const deleteTask = (id) => {
  try {
    const tasks = getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) {
      console.warn(`Task with id ${id} not found`);
      return false;
    }
    
    return saveTasks(filteredTasks);
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};

/**
 * Toggles the completed status of a task
 * @param {string} id - Task ID to toggle
 * @returns {boolean} Success status
 */
export const toggleTaskCompletion = (id) => {
  try {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === id);
    
    if (!task) {
      console.warn(`Task with id ${id} not found`);
      return false;
    }
    
    return updateTask(id, { completed: !task.completed });
  } catch (error) {
    console.error('Error toggling task completion:', error);
    return false;
  }
};

/**
 * Clears all tasks from localStorage
 * @returns {boolean} Success status
 */
export const clearAllTasks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing all tasks:', error);
    return false;
  }
};