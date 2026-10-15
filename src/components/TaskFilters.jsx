export default function TaskFilters({
  filter,
  sortBy,
  searchTerm,
  onFilterChange,
  onSortChange,
  onSearchChange,
}) {
  return (
    <div className="task-filters">
      <div className="filter-group">
        <label>Estado:</label>
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={`btn btn-filter ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
          >
            {f === 'all' ? 'Todas' : f === 'active' ? 'Pendientes' : 'Completadas'}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <label htmlFor="sort-select">Ordenar:</label>
        <select
          id="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="fecha-desc">Más recientes</option>
          <option value="fecha-asc">Más antiguas</option>
          <option value="titulo-asc">Título A-Z</option>
          <option value="titulo-desc">Título Z-A</option>
          <option value="prioridad">Prioridad</option>
        </select>
      </div>

      <div className="filter-group search-group">
        <label htmlFor="search-input">Buscar:</label>
        <input
          id="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tareas..."
        />
      </div>
    </div>
  )
}