import { useMemo } from 'react'
import { usePreferences } from '../contexts/PreferencesContext'
import KPICard from './KPICard'
import LowStockAlert from './LowStockAlert'

export default function DashboardView({
  productsStats,
  dashboardStats,
  products,
  onNavigate,
}) {
  const { formatPrice } = usePreferences()

  const topProducts = useMemo(() => dashboardStats.topProducts, [dashboardStats.topProducts])
  const categoryStats = useMemo(
    () => Object.entries(dashboardStats.categoryStats),
    [dashboardStats.categoryStats]
  )

  const maxCategoryValue = useMemo(() => {
    return Math.max(...categoryStats.map(([, v]) => v.value), 1)
  }, [categoryStats])

  return (
    <div className="view-container">
      <section className="kpi-grid">
        <KPICard
          icon="💵"
          label="Ventas hoy"
          value={formatPrice(dashboardStats.salesTodayTotal)}
          trend={{
            type: dashboardStats.salesTodayCount > 0 ? 'up' : 'neutral',
            label: `${dashboardStats.salesTodayCount} ventas`,
          }}
          color="primary"
        />
        <KPICard
          icon="📈"
          label="Ventas totales"
          value={formatPrice(dashboardStats.totalSales)}
          trend={{ type: 'up', label: 'Acumulado' }}
          color="success"
        />
        <KPICard
          icon="📦"
          label="Productos activos"
          value={productsStats.active}
          trend={{
            type: 'neutral',
            label: `${productsStats.inactive} inactivos`,
          }}
          color="info"
          onClick={() => onNavigate('products')}
        />
        <KPICard
          icon="⚠️"
          label="Alertas de stock"
          value={productsStats.lowStock + productsStats.outOfStock}
          trend={{
            type: productsStats.lowStock + productsStats.outOfStock > 0 ? 'down' : 'up',
            label: `${productsStats.outOfStock} sin stock`,
          }}
          color={productsStats.lowStock + productsStats.outOfStock > 0 ? 'danger' : 'success'}
          onClick={() => onNavigate('products')}
        />
        <KPICard
          icon="🏦"
          label="Valor inventario"
          value={formatPrice(productsStats.inventoryValue)}
          trend={{ type: 'up', label: 'Precio venta' }}
          color="primary"
        />
        <KPICard
          icon="👥"
          label="Clientes"
          value={dashboardStats.clientsCount}
          trend={{ type: 'neutral', label: 'Registrados' }}
          color="info"
          onClick={() => onNavigate('clients')}
        />
      </section>

      <div className="dashboard-grid">
        <LowStockAlert products={products} onNavigate={onNavigate} />

        <div className="card">
          <div className="card-header">
            <h3>🏆 Top Productos por Valor</h3>
          </div>
          <ul className="top-list">
            {topProducts.map((p, i) => (
              <li key={p.id} className="top-item">
                <span className="top-rank">#{i + 1}</span>
                <div className="top-info">
                  <strong>{p.name}</strong>
                  <span className="top-category">{p.category}</span>
                </div>
                <span className="top-value">{formatPrice(p.price * p.stock)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>📊 Inventario por Categoría</h3>
          </div>
          <ul className="category-list">
            {categoryStats.map(([cat, data]) => (
              <li key={cat} className="category-item">
                <div className="category-info">
                  <strong>{cat}</strong>
                  <span>{data.count} productos</span>
                </div>
                <div className="category-bar-wrapper">
                  <div
                    className="category-bar"
                    style={{ width: `${(data.value / maxCategoryValue) * 100}%` }}
                  />
                </div>
                <span className="category-value">{formatPrice(data.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}