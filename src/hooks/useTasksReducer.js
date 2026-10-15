import { useReducer, useMemo, useCallback } from 'react'
import tasksReducer, { initialState } from '../reducers/tasksReducer'

export default function useTasksReducer() {
  const [state, dispatch] = useReducer(tasksReducer, initialState)

  const addTask = useCallback((taskData) => {
    dispatch({ type: 'ADD', payload: taskData })
  }, [])

  const removeTask = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id })
  }, [])

  const toggleTask = useCallback((id) => {
    dispatch({ type: 'TOGGLE', payload: id })
  }, [])

  const updateTask = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE', payload: { id, updates } })
  }, [])

  const setFilter = useCallback((filter) => {
    dispatch({ type: 'FILTER', payload: filter })
  }, [])

  const setSort = useCallback((sortBy) => {
    dispatch({ type: 'SORT', payload: sortBy })
  }, [])

  const stats = useMemo(() => {
    const total = state.items.length
    const completed = state.items.filter((t) => t.completed).length
    const pending = total - completed
    const highPriority = state.items.filter(
      (t) => t.priority === 'alta' && !t.completed
    ).length
    return { total, completed, pending, highPriority }
  }, [state.items])

  return {
    state,
    dispatch,
    addTask,
    removeTask,
    toggleTask,
    updateTask,
    setFilter,
    setSort,
    stats,
  }
}