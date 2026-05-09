import { createContext, useContext, useState } from "react";
import type { Product } from "../types/product";

interface CartItem extends Product {
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (p: Product) => void;
  remove: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);
export const useCart = () => useContext(CartContext)!;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (p: Product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === p.id);
      if (exist) {
        return prev.map(i =>
          i.id === p.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const remove = (id: number) =>
    setCart(prev => prev.filter(i => i.id !== id));

  const increase = (id: number) =>
    setCart(prev =>
      prev.map(i =>
        i.id === id ? { ...i, qty: i.qty + 1 } : i
      )
    );

  const decrease = (id: number) =>
    setCart(prev =>
      prev.map(i =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      )
    );

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, remove, increase, decrease, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}