import { useState, forwardRef, useMemo } from 'react'
import { usePreferences } from '../contexts/PreferencesContext'

const SaleForm = forwardRef(function SaleForm(
  { products, clients, onSubmit, onCancel },
  ref
) {
  const { formatPrice } = usePreferences()
  const [clientId, setClientId] = useState(clients[0]?.id || '')
  const [items, setItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')

  const availableProducts = useMemo(
    () => products.filter((p) => p.active && p.stock > 0),
    [products]
  )

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.price * it.qty, 0),
    [items]
  )

  const handleAddItem = () => {
    if (!selectedProduct) return
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    if (qty < 1 || qty > product.stock) {
      setError(`Cantidad inválida. Stock disponible: ${product.stock}`)
      return
    }

    const existing = items.find((it) => it.productId === product.id)
    if (existing) {
      const newQty = existing.qty + qty
      if (newQty > product.stock) {
        setError(`No hay suficiente stock. Disponible: ${product.stock}`)
        return
      }
      setItems((prev) =>
        prev.map((it) =>
          it.productId === product.id ? { ...it, qty: newQty } : it
        )
      )
    } else {
      setItems((prev) => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty,
        },
      ])
    }
    setSelectedProduct('')
    setQty(1)
    setError('')
  }

  const handleRemoveItem = (productId) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!clientId) {
      setError('Debes seleccionar un cliente')
      return
    }
    if (items.length === 0) {
      setError('Debes agregar al menos un producto')
      return
    }
    const client = clients.find((c) => c.id === clientId)
    onSubmit({
      clientId,
      clientName: client?.name || 'Cliente',
      items,
      total,
    })
  }

  return (
    <form className="product-form sale-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>🧾 Registrar Nueva Venta</h3>
      </div>

      <div className="form-grid">
        <div className="form-group form-group-wide">
          <label htmlFor="sale-client">Cliente *</label>
          <select
            id="sale-client"
            ref={ref}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">-- Seleccionar cliente --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.doc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sale-item-adder">
        <div className="form-group">
          <label htmlFor="sale-product">Producto</label>
          <select
            id="sale-product"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">-- Seleccionar producto --</option>
            {availableProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatPrice(p.price)} (stock: {p.stock})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group form-group-qty">
          <label htmlFor="sale-qty">Cantidad</label>
          <input
            id="sale-qty"
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddItem}
          disabled={!selectedProduct}
        >
          + Agregar
        </button>
      </div>

      {error && <div className="form-error-banner">⚠️ {error}</div>}

      {items.length > 0 && (
        <div className="sale-items-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-center">Cant.</th>
                <th className="text-right">Precio</th>
                <th className="text-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.productId}>
                  <td>{it.name}</td>
                  <td className="text-center">{it.qty}</td>
                  <td className="text-right mono">{formatPrice(it.price)}</td>
                  <td className="text-right mono">
                    {formatPrice(it.price * it.qty)}
                  </td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveItem(it.productId)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-right">
                  <strong>Total:</strong>
                </td>
                <td className="text-right mono">
                  <strong>{formatPrice(total)}</strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          ✅ Registrar Venta
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
})

export default SaleForm