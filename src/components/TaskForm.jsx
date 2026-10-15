import { useState, forwardRef } from 'react'

const TaskForm = forwardRef(function TaskForm(
  { task, onSubmit, onCancel },
  ref
) {
  const [title, setTitle] = useState(task?.title || '')
  const [priority, setPriority] = useState(task?.priority || 'media')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    if (task) {
      onSubmit({ id: task.id, updates: { title: title.trim(), priority } })
    } else {
      onSubmit({ title: title.trim(), priority })
    }

    setTitle('')
    setPriority('media')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h3>{task ? 'Editar Tarea' : 'Nueva Tarea'}</h3>
      <div className="form-group">
        <label htmlFor="task-title">Título</label>
        <input
          id="task-title"
          ref={ref}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Escribe el título de la tarea..."
          autoComplete="off"
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-priority">Prioridad</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {task ? 'Actualizar' : 'Agregar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
})

export default TaskForm