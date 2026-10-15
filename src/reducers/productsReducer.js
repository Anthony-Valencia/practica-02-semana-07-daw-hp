import { initialProducts } from '../data/initialData'

export const initialProductsState = {
  items: initialProducts,
  filterCategory: 'all',
  filterStock: 'all',
  filterStatus: 'all',
  sortBy: 'name-asc',
  searchTerm: '',
}

export default function productsReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: `p-${crypto.randomUUID().slice(0, 8)}`,
            createdAt: new Date().toISOString(),
            active: true,
            ...action.payload,
          },
        ],
      }

    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.updates } : p
        ),
      }

    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((p) => p.id !== action.payload),
      }

    case 'TOGGLE_ACTIVE':
      return {
        ...state,
        items: state.items.map((p) =>
          p.id === action.payload ? { ...p, active: !p.active } : p
        ),
      }

    case 'ADJUST_STOCK':
      return {
        ...state,
        items: state.items.map((p) =>
          p.id === action.payload.id
            ? { ...p, stock: Math.max(0, p.stock + action.payload.delta) }
            : p
        ),
      }

    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.payload }

    case 'SET_FILTER_STOCK':
      return { ...state, filterStock: action.payload }

    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload }

    case 'SET_SORT':
      return { ...state, sortBy: action.payload }

    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload }

    case 'RESET_FILTERS':
      return {
        ...state,
        filterCategory: 'all',
        filterStock: 'all',
        filterStatus: 'all',
        sortBy: 'name-asc',
        searchTerm: '',
      }

    default:
      return state
  }
}