import { useState, useCallback, useEffect, useRef } from "react";
import { usePreferences } from "../contexts/PreferencesContext";
import SaleForm from "./SaleForm";

export default function SalesView({
  salesState,
  salesDispatch,
  processedSales,
  products,
  clients,
  onRegisterSale,
  onRemoveSale,
  searchSales,
  onSearchSalesChange,
  dashboardStats,
}) {
  const { formatPrice } = usePreferences();
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const formRef = useRef(null);
  const itemsPerPage = 8;

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.focus();
    }
  }, [showForm]);

  // Patrón "adjust state during render"
  const resetKey = `${salesState.filterStatus}|${salesState.sortBy}|${searchSales}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setCurrentPage(1);
  }

  const paginatedSales = processedSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(processedSales.length / itemsPerPage),
  );

  const handleSearch = useCallback(
    (e) => {
      onSearchSalesChange(e.target.value);
    },
    [onSearchSalesChange],
  );

  const handleRegister = useCallback(
    (sale) => {
      onRegisterSale(sale);
      setShowForm(false);
    },
    [onRegisterSale],
  );

  return (
    <div className="view-container">
      <section className="kpi-grid kpi-grid-small">
        <div className="kpi-mini">
          <span className="kpi-mini-label">Ventas hoy</span>
          <span className="kpi-mini-value">
            {formatPrice(dashboardStats.salesTodayTotal)}
          </span>
          <span className="kpi-mini-sub">
            {dashboardStats.salesTodayCount} transacciones
          </span>
        </div>
        <div className="kpi-mini">
          <span className="kpi-mini-label">Ventas totales</span>
          <span className="kpi-mini-value">
            {formatPrice(dashboardStats.totalSales)}
          </span>
          <span className="kpi-mini-sub">
            {salesState.items.length} registradas
          </span>
        </div>
        <div className="kpi-mini">
          <span className="kpi-mini-label">Ticket promedio</span>
          <span className="kpi-mini-value">
            {formatPrice(
              salesState.items.length > 0
                ? dashboardStats.totalSales / salesState.items.length
                : 0,
            )}
          </span>
          <span className="kpi-mini-sub">por venta</span>
        </div>
      </section>

      <div className="view-toolbar">
        <div className="toolbar-left">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? "✕ Cancelar" : "+ Registrar Venta"}
          </button>
        </div>

        <div className="toolbar-right">
          <div className="filter-item filter-search">
            <span className="filter-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por cliente o ID..."
              value={searchSales}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="sales-sort">Ordenar:</label>
            <select
              id="sales-sort"
              value={salesState.sortBy}
              onChange={(e) =>
                salesDispatch({ type: "SET_SORT", payload: e.target.value })
              }
            >
              <option value="date-desc">Más recientes</option>
              <option value="date-asc">Más antiguas</option>
              <option value="total-desc">Mayor monto</option>
              <option value="total-asc">Menor monto</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <SaleForm
          ref={formRef}
          products={products}
          clients={clients}
          onSubmit={handleRegister}
          onCancel={() => setShowForm(false)}
        />
      )}

      {processedSales.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No hay ventas registradas</h3>
          <p>Registra la primera venta usando el botón superior.</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Fecha</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="mono">{sale.id.slice(0, 8)}</td>
                    <td>
                      <strong>{sale.clientName}</strong>
                    </td>
                    <td>
                      <ul className="sale-items">
                        {sale.items.map((it, idx) => (
                          <li key={idx}>
                            {it.qty}× {it.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="text-muted">
                      {new Date(sale.date).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="text-right mono">
                      <strong>{formatPrice(sale.total)}</strong>
                    </td>
                    <td className="text-center">
                      <span className={`status-pill ${sale.status}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onRemoveSale(sale.id)}
                        title="Eliminar venta"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ← Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
