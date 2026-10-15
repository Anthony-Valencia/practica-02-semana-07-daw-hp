import { useMemo } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'products', label: 'Inventario', icon: '📦' },
  { id: 'sales', label: 'Ventas', icon: '💰' },
  { id: 'clients', label: 'Clientes', icon: '👥' },
]

export default function Sidebar({ activeView, onChangeView, isOpen, onClose, productsStats }) {
  const { theme } = useTheme()

  const alerts = useMemo(() => {
    return productsStats.lowStock + productsStats.outOfStock
  }, [productsStats])

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">🖥️</div>
          <div>
            <h2>TechStore Pro</h2>
            <p>Sistema de Gestión</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => onChangeView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {item.id === 'products' && alerts > 0 && (
                <span className="nav-badge">{alerts}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-info">
            <span>Modo:</span>
            <strong>{theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro'}</strong>
          </div>
          <div className="sidebar-info">
            <span>Productos activos:</span>
            <strong>{productsStats.active}</strong>
          </div>
          <div className="sidebar-info">
            <span>Stock bajo:</span>
            <strong className={alerts > 0 ? 'text-warning' : ''}>{alerts}</strong>
          </div>
        </div>
      </aside>
    </>
  )
}