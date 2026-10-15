import { useReducer, useMemo, useCallback } from 'react'
import productsReducer, { initialProductsState } from '../reducers/productsReducer'

export default function useProducts() {
  const [state, dispatch] = useReducer(productsReducer, initialProductsState)

  const addProduct = useCallback((payload) => dispatch({ type: 'ADD', payload }), [])
  const updateProduct = useCallback((id, updates) =>
    dispatch({ type: 'UPDATE', payload: { id, updates } }), [])
  const removeProduct = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), [])
  const toggleActive = useCallback((id) =>
    dispatch({ type: 'TOGGLE_ACTIVE', payload: id }), [])
  const adjustStock = useCallback((id, delta) =>
    dispatch({ type: 'ADJUST_STOCK', payload: { id, delta } }), [])
  const setFilterCategory = useCallback((v) =>
    dispatch({ type: 'SET_FILTER_CATEGORY', payload: v }), [])
  const setFilterStock = useCallback((v) =>
    dispatch({ type: 'SET_FILTER_STOCK', payload: v }), [])
  const setFilterStatus = useCallback((v) =>
    dispatch({ type: 'SET_FILTER_STATUS', payload: v }), [])
  const setSort = useCallback((v) => dispatch({ type: 'SET_SORT', payload: v }), [])
  const setSearch = useCallback((v) => dispatch({ type: 'SET_SEARCH', payload: v }), [])
  const resetFilters = useCallback(() => dispatch({ type: 'RESET_FILTERS' }), [])

  const stats = useMemo(() => {
    const total = state.items.length
    const active = state.items.filter((p) => p.active).length
    const inactive = total - active
    const inventoryValue = state.items.reduce((acc, p) => acc + p.price * p.stock, 0)
    const inventoryCost = state.items.reduce((acc, p) => acc + p.cost * p.stock, 0)
    const lowStock = state.items.filter((p) => p.stock > 0 && p.stock <= p.minStock).length
    const outOfStock = state.items.filter((p) => p.stock === 0).length
    const potentialProfit = inventoryValue - inventoryCost
    return { total, active, inactive, inventoryValue, inventoryCost, lowStock, outOfStock, potentialProfit }
  }, [state.items])

  return {
    state,
    dispatch,
    addProduct,
    updateProduct,
    removeProduct,
    toggleActive,
    adjustStock,
    setFilterCategory,
    setFilterStock,
    setFilterStatus,
    setSort,
    setSearch,
    resetFilters,
    stats,
  }
}