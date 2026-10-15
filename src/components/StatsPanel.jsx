import { useMemo } from 'react'

export default function StatsPanel({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.completed).length
    const pending = total - completed
    const highPriority = tasks.filter(
      (t) => t.priority === 'alta' && !t.completed
    ).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, pending, highPriority, completionRate }
  }, [tasks])

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card stat-completed">
        <span className="stat-value">{stats.completed}</span>
        <span className="stat-label">Completadas</span>
      </div>
      <div className="stat-card stat-pending">
        <span className="stat-value">{stats.pending}</span>
        <span className="stat-label">Pendientes</span>
      </div>
      <div className="stat-card stat-high">
        <span className="stat-value">{stats.highPriority}</span>
        <span className="stat-label">Alta prioridad</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{stats.completionRate}%</span>
        <span className="stat-label">Progreso</span>
      </div>
    </div>
  )
}