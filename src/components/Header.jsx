import { usePreferences } from '../contexts/PreferencesContext'
import ThemeToggle from './ThemeToggle'

const VIEW_TITLES = {
  dashboard: { title: 'Panel de Control', subtitle: 'Resumen general del negocio' },
  products: { title: 'Gestión de Inventario', subtitle: 'Administra productos y stock' },
  sales: { title: 'Historial de Ventas', subtitle: 'Registra y consulta ventas' },
  clients: { title: 'Gestión de Clientes', subtitle: 'Directorio de clientes' },
}

export default function Header({ onToggleSidebar, activeView, productsStats, onNavigate }) {
  const { formatPrice, lowStockThreshold, setLowStockThreshold } = usePreferences()
  const info = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={onToggleSidebar} aria-label="Abrir menú">
          ☰
        </button>
        <div>
          <h1>{info.title}</h1>
          <p>{info.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        <div className="header-kpi" title="Valor total del inventario">
          <span>Inventario:</span>
          <strong>{formatPrice(productsStats.inventoryValue)}</strong>
        </div>

        <div className="header-kpi header-kpi-alert" title="Alertas de stock">
          <span>Alertas:</span>
          <strong
            className={
              productsStats.lowStock + productsStats.outOfStock > 0 ? 'text-warning' : ''
            }
            onClick={() => onNavigate('products')}
            style={{ cursor: 'pointer' }}
          >
            {productsStats.lowStock + productsStats.outOfStock}
          </strong>
        </div>

        <div className="header-threshold">
          <label htmlFor="threshold">Umbral stock:</label>
          <input
            id="threshold"
            type="number"
            min="1"
            max="50"
            value={lowStockThreshold}
            onChange={(e) => setLowStockThreshold(Number(e.target.value) || 1)}
          />
        </div>

        <ThemeToggle />
      </div>
    </header>
  )
}