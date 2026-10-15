import { forwardRef } from 'react'
import { usePreferences } from '../contexts/PreferencesContext'

const ProductTable = forwardRef(function ProductTable(
  { products, viewMode, onEdit, onRemove, onToggleActive, onAdjustStock },
  ref
) {
  const { formatPrice } = usePreferences()

  if (viewMode === 'grid') {
    return (
      <div ref={ref} className="product-grid">
        {products.map((p) => (
          <div key={p.id} className={`product-card ${!p.active ? 'inactive' : ''}`}>
            <div className="product-card-header">
              <span className="product-sku">{p.sku}</span>
              <span className={`product-status ${p.active ? 'active' : 'inactive'}`}>
                {p.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <h4 className="product-card-name">{p.name}</h4>
            <div className="product-card-category">{p.category}</div>
            <div className="product-card-price">{formatPrice(p.price)}</div>
            <div className="product-card-stock">
              <span className={p.stock <= p.minStock ? 'text-warning' : ''}>
                Stock: {p.stock} uds.
              </span>
              <span>Mín: {p.minStock}</span>
            </div>
            <div className="product-card-actions">
              <button className="btn btn-sm btn-edit" onClick={() => onEdit(p)}>
                ✏️ Editar
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onToggleActive(p.id)}
              >
                {p.active ? '🚫' : '✅'}
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onRemove(p.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th className="text-right">Precio</th>
            <th className="text-center">Stock</th>
            <th className="text-center">Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const stockStatus =
              p.stock === 0
                ? 'out'
                : p.stock <= p.minStock
                ? 'low'
                : 'ok'
            return (
              <tr key={p.id} className={!p.active ? 'row-inactive' : ''}>
                <td className="mono">{p.sku}</td>
                <td>
                  <strong>{p.name}</strong>
                </td>
                <td>
                  <span className="badge">{p.category}</span>
                </td>
                <td className="text-muted">{p.supplier}</td>
                <td className="text-right mono">{formatPrice(p.price)}</td>
                <td className="text-center">
                  <div className="stock-control">
                    <button
                      className="stock-btn"
                      onClick={() => onAdjustStock(p.id, -1)}
                      disabled={p.stock === 0}
                    >
                      −
                    </button>
                    <span className={`stock-value stock-${stockStatus}`}>
                      {p.stock}
                    </span>
                    <button
                      className="stock-btn"
                      onClick={() => onAdjustStock(p.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="stock-min">Mín: {p.minStock}</div>
                </td>
                <td className="text-center">
                  <button
                    className={`status-pill ${p.active ? 'active' : 'inactive'}`}
                    onClick={() => onToggleActive(p.id)}
                  >
                    {p.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="text-center">
                  <div className="row-actions">
                    <button
                      className="btn btn-sm btn-edit"
                      onClick={() => onEdit(p)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemove(p.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})

export default ProductTable