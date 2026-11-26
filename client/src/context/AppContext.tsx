import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "../services/api";
import type { Customer, Product } from "../types";

interface AppContextValue {
  customers: Customer[];
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  apiOnline: boolean;
}
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [customerData, productData] = await Promise.all([api.customers(), api.products()]);
      setCustomers(customerData.customers);
      setProducts(productData.products);
      setApiOnline(true);
    } catch (err) {
      setApiOnline(false);
      setError(err instanceof Error ? err.message : "Could not connect to the API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);
  const value = useMemo(
    () => ({ customers, products, loading, error, refresh, apiOnline }),
    [customers, products, loading, error, apiOnline],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used inside AppProvider");
  return context;
}
