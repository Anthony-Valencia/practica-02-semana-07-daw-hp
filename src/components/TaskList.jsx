import { useMemo, useCallback, useRef, useEffect } from 'react'

const priorityLabels = {
  alta: { label: 'Alta', color: '#ef4444', icon: '🔴' },
  media: { label: 'Media', color: '#f59e0b', icon: '🟡' },
  baja: { label: 'Baja', color: '#22c55e', icon: '🟢' },
}

export default function TaskList({
  tasks,
  filter,
  sortBy,
  searchTerm,
  onRemove,
  onToggle,
  onEdit,
  onPriorityChange,
  inputRef,
}) {
  const listRef = useRef(null)
  const prevCountRef = useRef(tasks.length)

  useEffect(() => {
    if (tasks.length > prevCountRef.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
    prevCountRef.current = tasks.length
  }, [tasks.length])

  const processedTasks = useMemo(() => {
    let result = [...tasks]

    if (filter === 'active') {
      result = result.filter((t) => !t.completed)
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(term))
    }

    switch (sortBy) {
      case 'fecha-desc':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'fecha-asc':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case 'titulo-asc':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'titulo-desc':
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'prioridad':
        const order = { alta: 0, media: 1, baja: 2 }
        result.sort((a, b) => order[a.priority] - order[b.priority])
        break
      default:
        break
    }

    return result
  }, [tasks, filter, sortBy, searchTerm])

  const handleRemove = useCallback(
    (id) => {
      onRemove(id)
    },
    [onRemove]
  )

  const handleToggle = useCallback(
    (id) => {
      onToggle(id)
    },
    [onToggle]
  )

  const handleEdit = useCallback(
    (task) => {
      onEdit(task)
    },
    [onEdit]
  )

  const handlePriority = useCallback(
    (id, priority) => {
      onPriorityChange(id, priority)
    },
    [onPriorityChange]
  )

  if (processedTasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>No hay tareas que coincidan con los filtros seleccionados.</p>
      </div>
    )
  }

  return (
    <ul ref={listRef} className="task-list">
      {processedTasks.map((task) => (
        <li
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <div className="task-item-left">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task.id)}
              aria-label={`Marcar "${task.title}" como completada`}
            />
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span
                className="task-priority"
                style={{ color: priorityLabels[task.priority]?.color }}
              >
                {priorityLabels[task.priority]?.icon}{' '}
                {priorityLabels[task.priority]?.label}
              </span>
            </div>
          </div>
          <div className="task-actions">
            <select
              value={task.priority}
              onChange={(e) => handlePriority(task.id, e.target.value)}
              aria-label="Cambiar prioridad"
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
            <button
              className="btn btn-sm btn-edit"
              onClick={() => handleEdit(task)}
            >
              ✏️
            </button>
            <button
              className="btn btn-sm btn-delete"
              onClick={() => handleRemove(task.id)}
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}