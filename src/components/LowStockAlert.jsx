import { useMemo } from 'react'
import { usePreferences } from '../contexts/PreferencesContext'

export default function LowStockAlert({ products, onNavigate }) {
  const { formatPrice } = usePreferences()

  const lowStockProducts = useMemo(() => {
    return products
      .filter((p) => p.stock <= p.minStock)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 6)
  }, [products])

  if (lowStockProducts.length === 0) {
    return (
      <div className="card card-success">
        <div className="card-header">
          <h3>✅ Stock saludable</h3>
        </div>
        <p className="card-empty">Todos los productos tienen stock suficiente.</p>
      </div>
    )
  }

  return (
    <div className="card card-alert">
      <div className="card-header">
        <h3>⚠️ Alertas de Stock Bajo</h3>
        <button className="btn btn-sm btn-link" onClick={() => onNavigate('products')}>
          Ver todo →
        </button>
      </div>
      <ul className="alert-list">
        {lowStockProducts.map((p) => (
          <li key={p.id} className="alert-item">
            <div className="alert-item-info">
              <strong>{p.name}</strong>
              <span className="alert-item-sku">{p.sku}</span>
            </div>
            <div className="alert-item-values">
              <span className={p.stock === 0 ? 'text-danger' : 'text-warning'}>
                {p.stock === 0 ? 'Sin stock' : `${p.stock} uds.`}
              </span>
              <span className="alert-item-price">{formatPrice(p.price)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}