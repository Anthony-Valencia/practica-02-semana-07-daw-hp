import { createContext, useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const PreferencesContext = createContext()

export function PreferencesProvider({ children }) {
  const [viewMode, setViewMode] = useLocalStorage('preferences-view-mode', 'grid')
  const [itemsPerPage, setItemsPerPage] = useLocalStorage('preferences-items-per-page', 10)
  const [showCompleted, setShowCompleted] = useLocalStorage('preferences-show-completed', true)

  const value = {
    viewMode,
    setViewMode,
    itemsPerPage,
    setItemsPerPage,
    showCompleted,
    setShowCompleted,
  }

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences debe usarse dentro de un PreferencesProvider')
  }
  return context
}

export default PreferencesContext