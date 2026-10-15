import { useState, forwardRef } from 'react'
import { CATEGORIES } from '../data/initialData'

const ProductForm = forwardRef(function ProductForm(
  { product, onSubmit, onCancel },
  ref
) {
  const [form, setForm] = useState({
    sku: product?.sku || '',
    name: product?.name || '',
    category: product?.category || CATEGORIES[0],
    price: product?.price || '',
    cost: product?.cost || '',
    stock: product?.stock ?? '',
    minStock: product?.minStock ?? 5,
    supplier: product?.supplier || '',
    active: product?.active ?? true,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.sku.trim()) newErrors.sku = 'SKU obligatorio'
    if (!form.name.trim()) newErrors.name = 'Nombre obligatorio'
    if (Number(form.price) <= 0) newErrors.price = 'Precio debe ser mayor a 0'
    if (Number(form.cost) < 0) newErrors.cost = 'Costo no puede ser negativo'
    if (Number(form.stock) < 0) newErrors.stock = 'Stock no puede ser negativo'
    if (Number(form.minStock) < 0) newErrors.minStock = 'Mínimo no puede ser negativo'
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    onSubmit({
      sku: form.sku.trim().toUpperCase(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      cost: Number(form.cost),
      stock: Number(form.stock),
      minStock: Number(form.minStock),
      supplier: form.supplier.trim() || 'Sin proveedor',
      active: form.active,
    })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{product ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="pf-sku">SKU *</label>
          <input
            id="pf-sku"
            ref={ref}
            type="text"
            value={form.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            placeholder="Ej: HP-PAV-15"
            autoComplete="off"
          />
          {errors.sku && <span className="form-error">{errors.sku}</span>}
        </div>

        <div className="form-group form-group-wide">
          <label htmlFor="pf-name">Nombre *</label>
          <input
            id="pf-name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Laptop HP Pavilion 15"
            autoComplete="off"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="pf-category">Categoría</label>
          <select
            id="pf-category"
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="pf-supplier">Proveedor</label>
          <input
            id="pf-supplier"
            type="text"
            value={form.supplier}
            onChange={(e) => handleChange('supplier', e.target.value)}
            placeholder="Ej: HP Perú"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pf-price">Precio venta (S/) *</label>
          <input
            id="pf-price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="0.00"
          />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="pf-cost">Costo (S/)</label>
          <input
            id="pf-cost"
            type="number"
            min="0"
            step="0.01"
            value={form.cost}
            onChange={(e) => handleChange('cost', e.target.value)}
            placeholder="0.00"
          />
          {errors.cost && <span className="form-error">{errors.cost}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="pf-stock">Stock actual *</label>
          <input
            id="pf-stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => handleChange('stock', e.target.value)}
          />
          {errors.stock && <span className="form-error">{errors.stock}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="pf-minstock">Stock mínimo</label>
          <input
            id="pf-minstock"
            type="number"
            min="0"
            value={form.minStock}
            onChange={(e) => handleChange('minStock', e.target.value)}
          />
          {errors.minStock && <span className="form-error">{errors.minStock}</span>}
        </div>

        <div className="form-group form-group-check">
          <label>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => handleChange('active', e.target.checked)}
            />
            Producto activo
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {product ? 'Actualizar' : 'Registrar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
})

export default ProductForm