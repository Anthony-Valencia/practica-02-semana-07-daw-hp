export const initialState = {
  items: [
    {
      id: '1',
      title: 'Configurar proyecto Vite + React',
      completed: true,
      priority: 'alta',
      createdAt: '2025-01-10T10:00:00.000Z',
    },
    {
      id: '2',
      title: 'Implementar useReducer para gestión de tareas',
      completed: false,
      priority: 'alta',
      createdAt: '2025-01-11T09:30:00.000Z',
    },
    {
      id: '3',
      title: 'Crear ThemeContext con persistencia en localStorage',
      completed: false,
      priority: 'media',
      createdAt: '2025-01-12T14:15:00.000Z',
    },
    {
      id: '4',
      title: 'Optimizar con useMemo y useCallback',
      completed: false,
      priority: 'media',
      createdAt: '2025-01-13T08:45:00.000Z',
    },
    {
      id: '5',
      title: 'Documentar hooks personalizados en README',
      completed: false,
      priority: 'baja',
      createdAt: '2025-01-14T16:20:00.000Z',
    },
  ],
  filter: 'all',
  sortBy: 'fecha-desc',
}

function tasksReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: crypto.randomUUID(),
            title: action.payload.title,
            completed: false,
            priority: action.payload.priority || 'media',
            createdAt: new Date().toISOString(),
          },
        ],
      }

    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((task) => task.id !== action.payload),
      }

    case 'TOGGLE':
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      }

    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      }

    case 'SET_PRIORITY':
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload.id
            ? { ...task, priority: action.payload.priority }
            : task
        ),
      }

    case 'FILTER':
      return {
        ...state,
        filter: action.payload,
      }

    case 'SORT':
      return {
        ...state,
        sortBy: action.payload,
      }

    default:
      return state
  }
}

export default tasksReducer