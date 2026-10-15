import { useState, useCallback } from 'react'

export default function ClientsView({
  clients,
  onAddClient,
  onRemoveClient,
  search,
  onSearchChange,
}) {
  const [form, setForm] = useState({
    name: '',
    doc: '',
    email: '',
    phone: '',
    type: 'Persona',
  })
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (!form.name.trim() || !form.doc.trim()) return
      onAddClient({
        name: form.name.trim(),
        doc: form.doc.trim(),
        email: form.email.trim() || '—',
        phone: form.phone.trim() || '—',
        type: form.type,
      })
      setForm({ name: '', doc: '', email: '', phone: '', type: 'Persona' })
      setShowForm(false)
    },
    [form, onAddClient]
  )

  const handleChange = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  return (
    <div className="view-container">
      <div className="view-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
            {showForm ? '✕ Cancelar' : '+ Nuevo Cliente'}
          </button>
          <span className="mini-stat">
            <span>Total:</span> <strong>{clients.length}</strong>
          </span>
        </div>
        <div className="toolbar-right">
          <div className="filter-item filter-search">
            <span className="filter-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, email o documento..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>👤 Registrar Cliente</h3>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nombre completo o razón social"
              />
            </div>
            <div className="form-group">
              <label>Documento *</label>
              <input
                value={form.doc}
                onChange={(e) => handleChange('doc', e.target.value)}
                placeholder="DNI o RUC"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="Persona">Persona</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">
              Registrar
            </button>
          </div>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h3>No hay clientes</h3>
          <p>Registra el primer cliente.</p>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((c) => (
            <div key={c.id} className="client-card">
              <div className="client-avatar">
                {c.type === 'Empresa' ? '🏢' : '👤'}
              </div>
              <div className="client-info">
                <strong>{c.name}</strong>
                <span className="client-doc">{c.doc}</span>
                <span className="client-contact">✉️ {c.email}</span>
                <span className="client-contact">📞 {c.phone}</span>
              </div>
              <div className="client-meta">
                <span className="badge">{c.type}</span>
                <span className="client-purchases">
                  {c.totalPurchases} compras
                </span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onRemoveClient(c.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}