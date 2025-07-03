import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Save } from 'lucide-react';
import './TodoApp.css';

/**
 * Aplicación TO-DO con React (Sin Tailwind)
 * Funcionalidades: Agregar, editar, eliminar y marcar tareas como completadas
 * Persistencia: localStorage
 */

const TodoApp = () => {
  // Estado para las tareas
  const [tasks, setTasks] = useState([]);
  
  // Estado para el formulario de nueva tarea
  const [newTask, setNewTask] = useState('');
  
  // Estado para el modo de edición
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  // Estado para filtros
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Cargar tareas desde localStorage al iniciar la aplicación
  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error al cargar tareas:', error);
        // Si hay error, usar tareas por defecto
        setTasks([
          { id: 1, text: 'Bienvenido a tu lista de tareas', completed: false, createdAt: new Date().toISOString() },
          { id: 2, text: 'Haz clic en el botón + para agregar una nueva tarea', completed: false, createdAt: new Date().toISOString() }
        ]);
      }
    } else {
      // Si no hay tareas guardadas, usar tareas por defecto
      setTasks([
        { id: 1, text: 'Bienvenido a tu lista de tareas', completed: false, createdAt: new Date().toISOString() },
        { id: 2, text: 'Haz clic en el botón + para agregar una nueva tarea', completed: false, createdAt: new Date().toISOString() }
      ]);
    }
  }, []);

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  /**
   * Agrega una nueva tarea
   */
  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask('');
  };

  /**
   * Elimina una tarea por ID
   */
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  /**
   * Marca/desmarca una tarea como completada
   */
  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  /**
   * Inicia el modo de edición para una tarea
   */
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  /**
   * Cancela el modo de edición
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  /**
   * Guarda los cambios de una tarea editada
   */
  const saveEdit = (id) => {
    if (editingText.trim() === '') return;
    
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, text: editingText.trim() } : task
    ));
    
    setEditingId(null);
    setEditingText('');
  };

  /**
   * Filtra las tareas según el filtro seleccionado
   */
  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  /**
   * Maneja Enter en el campo de edición
   */
  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  // Estadísticas de tareas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="todo-app">
      <div className="todo-container">
        
        {/* Header */}
        <div className="todo-header">
          <h1 className="todo-title">
            📝 Mi Lista de Tareas
          </h1>
          <p className="todo-subtitle">
            Organiza tu día de manera eficiente
          </p>
        </div>

        {/* Estadísticas */}
        <div className="todo-stats">
          <div className="stat-card">
            <div className="stat-number total">{totalTasks}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card">
            <div className="stat-number active">{activeTasks}</div>
            <div className="stat-label">Pendientes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number completed">{completedTasks}</div>
            <div className="stat-label">Completadas</div>
          </div>
        </div>

        {/* Formulario para agregar tareas */}
        <div className="todo-form-container">
          <div className="todo-form">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Escribe una nueva tarea..."
              className="todo-input"
            />
            <button
              onClick={addTask}
              className="todo-add-btn"
            >
              <Plus size={20} />
              Agregar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="todo-filters">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'active', label: 'Pendientes' },
            { key: 'completed', label: 'Completadas' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`filter-btn ${filter === key ? 'active' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Lista de tareas */}
        <div className="todo-list-container">
          {filteredTasks.length === 0 ? (
            <div className="todo-empty">
              {filter === 'all' ? '¡No hay tareas aún!' : 
               filter === 'active' ? '¡No hay tareas pendientes!' : 
               '¡No hay tareas completadas!'}
            </div>
          ) : (
            <div className="todo-list">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`todo-item ${task.completed ? 'completed' : ''}`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`todo-checkbox ${task.completed ? 'checked' : ''}`}
                  >
                    {task.completed && <Check size={12} />}
                  </button>

                  {/* Texto de la tarea */}
                  <div className="todo-text">
                    {editingId === task.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                        className="todo-edit-input"
                        autoFocus
                      />
                    ) : (
                      <span className={task.completed ? 'todo-text-completed' : 'todo-text-normal'}>
                        {task.text}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="todo-actions">
                    {editingId === task.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="todo-action-btn save"
                          title="Guardar"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="todo-action-btn cancel"
                          title="Cancelar"
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(task.id, task.text)}
                          className="todo-action-btn edit"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="todo-action-btn delete"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="todo-footer">
          <p>💡 Tip: Haz clic en el checkbox para marcar tareas como completadas</p>
          <p>✏️ Usa los botones de editar y eliminar para gestionar tus tareas</p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;