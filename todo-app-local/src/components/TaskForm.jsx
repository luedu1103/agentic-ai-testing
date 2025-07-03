/**
 * TaskForm Component
 * Handles creation and editing of tasks with form validation
 */

import { useState, useEffect } from 'react';
import { Plus, Edit3, X } from 'lucide-react';
import './TaskForm.css';

const TaskForm = ({ 
  onSubmit, 
  onCancel, 
  editingTask = null, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'medium'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium'
      });
    }
    setErrors({});
  }, [editingTask]);

  /**
   * Validates form data
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority
    };

    try {
      await onSubmit(taskData);
      
      // Reset form if not editing (creating new task)
      if (!editingTask) {
        setFormData({
          title: '',
          description: '',
          priority: 'medium'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  /**
   * Handles input changes with validation
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium'
    });
    setErrors({});
    onCancel?.();
  };

  const isEditing = !!editingTask;

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-header">
          <h2 className="form-title">
            {isEditing ? (
              <>
                <Edit3 size={20} />
                Edit Task
              </>
            ) : (
              <>
                <Plus size={20} />
                Add New Task
              </>
            )}
          </h2>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
              aria-label="Cancel editing"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter task title..."
            maxLength={100}
            disabled={isLoading}
            autoComplete="off"
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}
          <div className="character-count">
            {formData.title.length}/100
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Enter task description (optional)..."
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
          <div className="character-count">
            {formData.description.length}/500
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="form-select"
            disabled={isLoading}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isLoading || !formData.title.trim()}
          >
            {isLoading ? (
              <span className="loading-spinner">⏳</span>
            ) : isEditing ? (
              'Update Task'
            ) : (
              'Add Task'
            )}
          </button>
          
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;