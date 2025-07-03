/**
 * TaskItem Component
 * Displays individual task with actions (edit, delete, toggle completion)
 */

import { useState } from 'react';
import { Edit3, Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import './TaskItem.css';

const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isLoading = false 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Handles task completion toggle
   */
  const handleToggleComplete = async () => {
    try {
      await onToggleComplete(task.id);
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  /**
   * Handles task editing
   */
  const handleEdit = () => {
    onEdit(task);
  };

  /**
   * Handles task deletion with confirmation
   */
  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  /**
   * Cancels delete confirmation
   */
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  /**
   * Gets priority icon based on task priority
   */
  const getPriorityIcon = () => {
    switch (task.priority) {
      case 'high':
        return <AlertCircle size={16} className="priority-icon high" />;
      case 'medium':
        return <Clock size={16} className="priority-icon medium" />;
      case 'low':
        return <Clock size={16} className="priority-icon low" />;
      default:
        return null;
    }
  };

  /**
   * Formats date for display
   */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  /**
   * Gets time ago string
   */
  const getTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    } catch (error) {
      return '';
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : 'pending'} ${isLoading ? 'loading' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <button
            onClick={handleToggleComplete}
            className={`completion-button ${task.completed ? 'completed' : ''}`}
            disabled={isLoading}
            aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.completed && <Check size={16} />}
          </button>
          
          <div className="task-info">
            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </h3>
            
            <div className="task-meta">
              {getPriorityIcon()}
              <span className="task-priority">{task.priority}</span>
              <span className="task-date">
                Created {formatDate(task.createdAt)}
              </span>
              {task.updatedAt !== task.createdAt && (
                <span className="task-updated">
                  • Updated {getTimeAgo(task.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </div>

        {task.description && (
          <div className="task-description">
            <p>{task.description}</p>
          </div>
        )}
      </div>

      <div className="task-actions">
        {showDeleteConfirm ? (
          <div className="delete-confirmation">
            <span className="confirm-text">Delete?</span>
            <button
              onClick={handleDelete}
              className="confirm-delete-button"
              disabled={isDeleting}
              aria-label="Confirm delete"
            >
              {isDeleting ? '⏳' : 'Yes'}
            </button>
            <button
              onClick={handleCancelDelete}
              className="cancel-delete-button"
              disabled={isDeleting}
              aria-label="Cancel delete"
            >
              No
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="action-button edit-button"
              disabled={isLoading}
              aria-label="Edit task"
              title="Edit task"
            >
              <Edit3 size={16} />
            </button>
            
            <button
              onClick={handleDelete}
              className="action-button delete-button"
              disabled={isLoading}
              aria-label="Delete task"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;