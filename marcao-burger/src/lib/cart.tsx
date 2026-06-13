import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageKey?: string;
  notes?: string;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "marcao_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add: CartContextValue["add"] = useCallback((item, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.productId === item.productId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const remove: CartContextValue["remove"] = useCallback((productId) => {
    setItems((prev) => prev.filter((p) => p.productId !== productId));
  }, []);

  const setQty: CartContextValue["setQty"] = useCallback((productId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.productId !== productId)
        : prev.map((p) => (p.productId === productId ? { ...p, quantity: qty } : p)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    return { items, add, remove, setQty, clear, subtotal, count };
  }, [items, add, remove, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
