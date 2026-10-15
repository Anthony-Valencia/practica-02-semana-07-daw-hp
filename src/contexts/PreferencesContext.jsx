import { createContext, useContext, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const PreferencesContext = createContext();

const CURRENCIES = {
  PEN: { symbol: "S/", label: "Soles" },
  USD: { symbol: "$", label: "Dólares" },
  EUR: { symbol: "€", label: "Euros" },
};

export function PreferencesProvider({ children }) {
  const [currency, setCurrency] = useLocalStorage("techstore-currency", "PEN");
  const [itemsPerPage, setItemsPerPage] = useLocalStorage(
    "techstore-items-per-page",
    8,
  );
  const [lowStockThreshold, setLowStockThreshold] = useLocalStorage(
    "techstore-low-stock-threshold",
    5,
  );
  const [viewMode, setViewMode] = useLocalStorage(
    "techstore-view-mode",
    "table",
  );
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage(
    "techstore-notifications",
    true,
  );

  const formatPrice = useCallback(
    (value) => {
      const c = CURRENCIES[currency] || CURRENCIES.PEN;
      return `${c.symbol} ${Number(value).toFixed(2)}`;
    },
    [currency],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      itemsPerPage,
      setItemsPerPage,
      lowStockThreshold,
      setLowStockThreshold,
      viewMode,
      setViewMode,
      notificationsEnabled,
      setNotificationsEnabled,
      formatPrice,
    }),
    [
      currency,
      setCurrency,
      itemsPerPage,
      setItemsPerPage,
      lowStockThreshold,
      setLowStockThreshold,
      viewMode,
      setViewMode,
      notificationsEnabled,
      setNotificationsEnabled,
      formatPrice,
    ],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences debe usarse dentro de PreferencesProvider");
  return ctx;
}

export default PreferencesContext;
