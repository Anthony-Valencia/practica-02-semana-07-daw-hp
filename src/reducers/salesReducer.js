import { initialSales } from '../data/initialData'

export const initialSalesState = {
  items: initialSales,
  filterStatus: 'all',
  sortBy: 'date-desc',
  searchTerm: '',
}

export default function salesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        items: [
          {
            id: `s-${crypto.randomUUID().slice(0, 8)}`,
            date: new Date().toISOString(),
            status: 'completada',
            ...action.payload,
          },
          ...state.items,
        ],
      }

    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((s) => s.id !== action.payload),
      }

    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload }

    case 'SET_SORT':
      return { ...state, sortBy: action.payload }

    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload }

    default:
      return state
  }
}