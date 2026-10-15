import { useReducer, useState, useCallback, useRef, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { PreferencesProvider } from './contexts/PreferencesContext'
import tasksReducer, { initialState } from './reducers/tasksReducer'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import TaskFilters from './components/TaskFilters'
import StatsPanel from './components/StatsPanel'
import ThemeToggle from './components/ThemeToggle'
import useLocalStorage from './hooks/useLocalStorage'
import useDebounce from './hooks/useDebounce'

function Dashboard() {
  const [state, dispatch] = useReducer(tasksReducer, initialState)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const titleInputRef = useRef(null)
  const containerRef = useRef(null)

  const [, setLastVisit] = useLocalStorage('dashboard-last-visit', '')

  useEffect(() => {
    setLastVisit(new Date().toISOString())
  }, [setLastVisit])

  useEffect(() => {
    if (showForm && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [showForm])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowForm(false)
        setEditingTask(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleAddTask = useCallback((taskData) => {
    dispatch({ type: 'ADD', payload: taskData })
    setShowForm(false)
  }, [])

  const handleRemoveTask = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id })
  }, [])

  const handleToggleTask = useCallback((id) => {
    dispatch({ type: 'TOGGLE', payload: id })
  }, [])

  const handleEditTask = useCallback((task) => {
    setEditingTask(task)
    setShowForm(true)
  }, [])

  const handleUpdateTask = useCallback((taskData) => {
    dispatch({ type: 'UPDATE', payload: taskData })
    setEditingTask(null)
    setShowForm(false)
  }, [])

  const handleFilterChange = useCallback((filter) => {
    dispatch({ type: 'FILTER', payload: filter })
  }, [])

  const handleSortChange = useCallback((sortBy) => {
    dispatch({ type: 'SORT', payload: sortBy })
  }, [])

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const handlePriorityChange = useCallback((id, priority) => {
    dispatch({ type: 'SET_PRIORITY', payload: { id, priority } })
  }, [])

  const processedTasks = {
    ...state,
    searchTerm: debouncedSearch,
  }

  return (
    <div ref={containerRef} className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📋 Dashboard de Tareas</h1>
          <p className="subtitle">IS093A - Desarrollo de Aplicaciones Web</p>
        </div>
        <ThemeToggle />
      </header>

      <StatsPanel tasks={state.items} />

      <div className="dashboard-toolbar">
        <TaskFilters
          filter={state.filter}
          sortBy={state.sortBy}
          searchTerm={searchTerm}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onSearchChange={handleSearchChange}
        />
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null)
            setShowForm(!showForm)
          }}
        >
          {showForm ? '✕ Cancelar' : '+ Nueva Tarea'}
        </button>
      </div>

      {showForm && (
        <TaskForm
          ref={titleInputRef}
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}

      <TaskList
        tasks={state.items}
        filter={state.filter}
        sortBy={state.sortBy}
        searchTerm={debouncedSearch}
        onRemove={handleRemoveTask}
        onToggle={handleToggleTask}
        onEdit={handleEditTask}
        onPriorityChange={handlePriorityChange}
        inputRef={titleInputRef}
      />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <Dashboard />
      </PreferencesProvider>
    </ThemeProvider>
  )
}

export default App