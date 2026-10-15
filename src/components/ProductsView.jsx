import { useState, useCallback, useRef, useEffect } from "react";
import { usePreferences } from "../contexts/PreferencesContext";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import ProductFilters from "./ProductFilters";

export default function ProductsView({
  state,
  stats,
  processedProducts,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  onToggleActive,
  onAdjustStock,
  onSetFilterCategory,
  onSetFilterStock,
  onSetFilterStatus,
  onSetSort,
  onSetSearch,
  onResetFilters,
}) {
  const { itemsPerPage, viewMode, setViewMode, formatPrice } = usePreferences();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const formTitleRef = useRef(null);

  // Auto-focus al abrir formulario
  useEffect(() => {
    if (showForm && formTitleRef.current) {
      formTitleRef.current.focus();
    }
  }, [showForm]);

  // Patrón "adjust state during render" (recomendado por React)
  const resetKey = `${state.filterCategory}|${state.filterStock}|${state.filterStatus}|${state.sortBy}|${state.searchTerm}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (prevResetKey !== resetKey) {
    setPrevResetKey(resetKey);
    setCurrentPage(1);
  }

  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(processedProducts.length / itemsPerPage),
  );

  const handleOpenAdd = useCallback(() => {
    setEditingProduct(null);
    setShowForm(true);
  }, []);

  const handleOpenEdit = useCallback((product) => {
    setEditingProduct(product);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingProduct(null);
  }, []);

  const handleSubmitForm = useCallback(
    (data) => {
      if (editingProduct) {
        onUpdateProduct(editingProduct.id, data);
      } else {
        onAddProduct(data);
      }
      handleCloseForm();
    },
    [editingProduct, onUpdateProduct, onAddProduct, handleCloseForm],
  );

  const handleExportCSV = useCallback(() => {
    const headers = [
      "SKU",
      "Nombre",
      "Categoría",
      "Precio",
      "Stock",
      "Proveedor",
      "Estado",
    ];
    const rows = processedProducts.map((p) => [
      p.sku,
      p.name,
      p.category,
      p.price,
      p.stock,
      p.supplier,
      p.active ? "Activo" : "Inactivo",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventario-techstore-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [processedProducts]);

  return (
    <div className="view-container">
      <div className="view-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            + Nuevo Producto
          </button>
          <button className="btn btn-secondary" onClick={handleExportCSV}>
            ⬇️ Exportar CSV
          </button>
          <div className="view-mode-toggle">
            <button
              className={`btn btn-sm ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Vista tabla"
            >
              ☰
            </button>
            <button
              className={`btn btn-sm ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Vista grid"
            >
              ▦
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="mini-stat">
            <span>Mostrando:</span>
            <strong>
              {processedProducts.length} / {stats.total}
            </strong>
          </div>
          <div className="mini-stat">
            <span>Valor filtrado:</span>
            <strong>
              {formatPrice(
                processedProducts.reduce(
                  (acc, p) => acc + p.price * p.stock,
                  0,
                ),
              )}
            </strong>
          </div>
        </div>
      </div>

      <ProductFilters
        state={state}
        onSetFilterCategory={onSetFilterCategory}
        onSetFilterStock={onSetFilterStock}
        onSetFilterStatus={onSetFilterStatus}
        onSetSort={onSetSort}
        onSetSearch={onSetSearch}
        onResetFilters={onResetFilters}
      />

      {showForm && (
        <ProductForm
          ref={formTitleRef}
          product={editingProduct}
          onSubmit={handleSubmitForm}
          onCancel={handleCloseForm}
        />
      )}

      {processedProducts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No hay productos</h3>
          <p>No se encontraron productos con los filtros seleccionados.</p>
          <button className="btn btn-secondary" onClick={onResetFilters}>
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <ProductTable
            products={paginatedProducts}
            viewMode={viewMode}
            onEdit={handleOpenEdit}
            onRemove={onRemoveProduct}
            onToggleActive={onToggleActive}
            onAdjustStock={onAdjustStock}
          />

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
