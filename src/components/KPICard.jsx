export default function KPICard({ icon, label, value, trend, color = 'default', onClick }) {
  return (
    <div
      className={`kpi-card kpi-${color} ${onClick ? 'kpi-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        {trend && <span className={`kpi-trend ${trend.type}`}>{trend.label}</span>}
      </div>
      <div className="kpi-body">
        <span className="kpi-value">{value}</span>
        <span className="kpi-label">{label}</span>
      </div>
    </div>
  )
}