import { CATEGORIES } from '../data/initialData'

export default function ProductFilters({
  state,
  onSetFilterCategory,
  onSetFilterStock,
  onSetFilterStatus,
  onSetSort,
  onSetSearch,
  onResetFilters,
}) {
  return (
    <div className="filters-bar">
      <div className="filter-item filter-search">
        <span className="filter-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar por nombre, SKU o proveedor..."
          value={state.searchTerm}
          onChange={(e) => onSetSearch(e.target.value)}
        />
      </div>

      <div className="filter-item">
        <label htmlFor="f-category">Categoría:</label>
        <select
          id="f-category"
          value={state.filterCategory}
          onChange={(e) => onSetFilterCategory(e.target.value)}
        >
          <option value="all">Todas</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="f-stock">Stock:</label>
        <select
          id="f-stock"
          value={state.filterStock}
          onChange={(e) => onSetFilterStock(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="ok">Stock OK</option>
          <option value="low">Stock bajo</option>
          <option value="out">Sin stock</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="f-status">Estado:</label>
        <select
          id="f-status"
          value={state.filterStatus}
          onChange={(e) => onSetFilterStatus(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
      </div>

      <div className="filter-item">
        <label htmlFor="f-sort">Ordenar:</label>
        <select
          id="f-sort"
          value={state.sortBy}
          onChange={(e) => onSetSort(e.target.value)}
        >
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="price-asc">Precio ↑</option>
          <option value="price-desc">Precio ↓</option>
          <option value="stock-asc">Stock ↑</option>
          <option value="stock-desc">Stock ↓</option>
        </select>
      </div>

      <button className="btn btn-ghost btn-sm" onClick={onResetFilters}>
        ✕ Limpiar
      </button>
    </div>
  )
}