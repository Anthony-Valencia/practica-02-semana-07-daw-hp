import { useState, useMemo, useCallback, useRef } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PreferencesProvider } from "./contexts/PreferencesContext";
import {
  NotificationProvider,
  useNotifications,
} from "./contexts/NotificationContext";
import useProducts from "./hooks/useProducts";
import useDebounce from "./hooks/useDebounce";
import salesReducer, { initialSalesState } from "./reducers/salesReducer";
import { initialClients } from "./data/initialData";
import { useReducer } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import ProductsView from "./components/ProductsView";
import SalesView from "./components/SalesView";
import ClientsView from "./components/ClientsView";
import Notifications from "./components/Notifications";

const VIEWS = {
  dashboard: "dashboard",
  products: "products",
  sales: "sales",
  clients: "clients",
};

function AppContent() {
  const [activeView, setActiveView] = useState(VIEWS.dashboard);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Productos: hook personalizado sobre useReducer
  const products = useProducts();

  // Ventas: useReducer independiente
  const [salesState, salesDispatch] = useReducer(
    salesReducer,
    initialSalesState,
  );
  const [searchSales, setSearchSales] = useState("");
  const debouncedSearchSales = useDebounce(searchSales, 300);

  // Clientes: useState simple (datos no tan complejos)
  const [clients, setClients] = useState(initialClients);
  const [searchClients, setSearchClients] = useState("");
  const debouncedSearchClients = useDebounce(searchClients, 300);

  // Búsqueda de productos con debounce
  const debouncedProductSearch = useDebounce(products.state.searchTerm, 300);

  const { notify } = useNotifications();
  const mainRef = useRef(null);

  // ✅ NUEVO: handler unificado que hace las 3 cosas sin useEffect
  const handleNavigate = useCallback((view) => {
    setActiveView(view);
    setSidebarOpen(false);
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
  // Handler para registrar venta (afecta stock + agrega venta + incrementa cliente)
  const handleRegisterSale = useCallback(
    (sale) => {
      // 1. Agregar la venta
      salesDispatch({ type: "ADD", payload: sale });

      // 2. Descontar stock de cada producto vendido
      sale.items.forEach((item) => {
        products.adjustStock(item.productId, -item.qty);
      });

      // 3. Incrementar compras del cliente
      setClients((prev) =>
        prev.map((c) =>
          c.id === sale.clientId
            ? { ...c, totalPurchases: (c.totalPurchases || 0) + 1 }
            : c,
        ),
      );

      // 4. Notificar
      notify(
        `Venta registrada por ${products.stats ? "" : ""}${sale.clientName}`,
        "success",
      );
    },
    [products, notify],
  );

  const handleAddProduct = useCallback(
    (payload) => {
      products.addProduct(payload);
      notify(`Producto "${payload.name}" agregado al inventario`, "success");
    },
    [products, notify],
  );

  const handleUpdateProduct = useCallback(
    (id, updates) => {
      products.updateProduct(id, updates);
      notify(`Producto actualizado correctamente`, "info");
    },
    [products, notify],
  );

  const handleRemoveProduct = useCallback(
    (id) => {
      const prod = products.state.items.find((p) => p.id === id);
      products.removeProduct(id);
      notify(`Producto "${prod?.name || ""}" eliminado`, "warning");
    },
    [products, notify],
  );

  const handleAddClient = useCallback(
    (client) => {
      const newClient = {
        id: `c-${crypto.randomUUID().slice(0, 8)}`,
        totalPurchases: 0,
        createdAt: new Date().toISOString(),
        ...client,
      };
      setClients((prev) => [newClient, ...prev]);
      notify(`Cliente "${client.name}" registrado`, "success");
    },
    [notify],
  );

  const handleRemoveClient = useCallback(
    (id) => {
      setClients((prev) => prev.filter((c) => c.id !== id));
      notify("Cliente eliminado", "warning");
    },
    [notify],
  );

  const handleRemoveSale = useCallback(
    (id) => {
      salesDispatch({ type: "REMOVE", payload: id });
      notify("Venta eliminada del historial", "warning");
    },
    [notify],
  );

  // Productos procesados (filter + sort + search) con useMemo
  const processedProducts = useMemo(() => {
    let result = [...products.state.items];

    if (products.state.filterCategory !== "all") {
      result = result.filter(
        (p) => p.category === products.state.filterCategory,
      );
    }
    if (products.state.filterStock === "low") {
      result = result.filter((p) => p.stock > 0 && p.stock <= p.minStock);
    } else if (products.state.filterStock === "out") {
      result = result.filter((p) => p.stock === 0);
    } else if (products.state.filterStock === "ok") {
      result = result.filter((p) => p.stock > p.minStock);
    }
    if (products.state.filterStatus === "active") {
      result = result.filter((p) => p.active);
    } else if (products.state.filterStatus === "inactive") {
      result = result.filter((p) => !p.active);
    }
    if (debouncedProductSearch.trim()) {
      const term = debouncedProductSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.sku.toLowerCase().includes(term) ||
          p.supplier.toLowerCase().includes(term),
      );
    }

    switch (products.state.sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-desc":
        result.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }

    return result;
  }, [
    products.state.items,
    products.state.filterCategory,
    products.state.filterStock,
    products.state.filterStatus,
    products.state.sortBy,
    debouncedProductSearch,
  ]);

  // Ventas procesadas
  const processedSales = useMemo(() => {
    let result = [...salesState.items];

    if (salesState.filterStatus !== "all") {
      result = result.filter((s) => s.status === salesState.filterStatus);
    }
    if (debouncedSearchSales.trim()) {
      const term = debouncedSearchSales.toLowerCase();
      result = result.filter(
        (s) =>
          s.clientName.toLowerCase().includes(term) ||
          s.id.toLowerCase().includes(term),
      );
    }

    switch (salesState.sortBy) {
      case "date-desc":
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "date-asc":
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "total-desc":
        result.sort((a, b) => b.total - a.total);
        break;
      case "total-asc":
        result.sort((a, b) => a.total - b.total);
        break;
      default:
        break;
    }
    return result;
  }, [
    salesState.items,
    salesState.filterStatus,
    salesState.sortBy,
    debouncedSearchSales,
  ]);

  // Clientes filtrados
  const filteredClients = useMemo(() => {
    if (!debouncedSearchClients.trim()) return clients;
    const term = debouncedSearchClients.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.doc.toLowerCase().includes(term),
    );
  }, [clients, debouncedSearchClients]);

  // KPIs del dashboard (memoizados)
  const dashboardStats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const salesToday = salesState.items.filter(
      (s) => s.date.slice(0, 10) === today,
    );
    const salesTodayTotal = salesToday.reduce((acc, s) => acc + s.total, 0);
    const totalSales = salesState.items.reduce((acc, s) => acc + s.total, 0);

    const categoryStats = {};
    products.state.items.forEach((p) => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = { count: 0, value: 0 };
      }
      categoryStats[p.category].count += 1;
      categoryStats[p.category].value += p.price * p.stock;
    });

    const topProducts = [...products.state.items]
      .sort((a, b) => b.price * b.stock - a.price * a.stock)
      .slice(0, 5);

    return {
      salesTodayCount: salesToday.length,
      salesTodayTotal,
      totalSales,
      categoryStats,
      topProducts,
      clientsCount: clients.length,
    };
  }, [salesState.items, products.state.items, clients.length]);

  return (
    <div className="app-layout">
      <Sidebar
        activeView={activeView}
        onChangeView={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        productsStats={products.stats}
      />

      <div className="app-main">
        <Header
          onToggleSidebar={() => setSidebarOpen((s) => !s)}
          activeView={activeView}
          productsStats={products.stats}
          onNavigate={handleNavigate}
        />

        <main ref={mainRef} className="app-content">
          {activeView === VIEWS.dashboard && (
            <DashboardView
              productsStats={products.stats}
              dashboardStats={dashboardStats}
              products={products.state.items}
              onNavigate={handleNavigate}
            />
          )}

          {activeView === VIEWS.products && (
            <ProductsView
              state={products.state}
              stats={products.stats}
              processedProducts={processedProducts}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onRemoveProduct={handleRemoveProduct}
              onToggleActive={products.toggleActive}
              onAdjustStock={products.adjustStock}
              onSetFilterCategory={products.setFilterCategory}
              onSetFilterStock={products.setFilterStock}
              onSetFilterStatus={products.setFilterStatus}
              onSetSort={products.setSort}
              onSetSearch={products.setSearch}
              onResetFilters={products.resetFilters}
            />
          )}

          {activeView === VIEWS.sales && (
            <SalesView
              salesState={salesState}
              salesDispatch={salesDispatch}
              processedSales={processedSales}
              products={products.state.items}
              clients={clients}
              onRegisterSale={handleRegisterSale}
              onRemoveSale={handleRemoveSale}
              searchSales={searchSales}
              onSearchSalesChange={setSearchSales}
              dashboardStats={dashboardStats}
            />
          )}

          {activeView === VIEWS.clients && (
            <ClientsView
              clients={filteredClients}
              onAddClient={handleAddClient}
              onRemoveClient={handleRemoveClient}
              search={searchClients}
              onSearchChange={setSearchClients}
            />
          )}
        </main>
      </div>

      <Notifications />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
