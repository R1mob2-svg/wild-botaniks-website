import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import type { Product, ProductVariant } from "./siteData";

type CartItem = {
  key: string;
  productHandle: string;
  title: string;
  variantId: number;
  variantTitle: string;
  image: string;
  price: number;
  quantity: number;
};

type Address = {
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
};

type Order = {
  id: string;
  placedAt: string;
  total: number;
  items: CartItem[];
  status: string;
  shippingAddress: Address;
};

type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  marketingOptIn: boolean;
  savedAddress: Address | null;
  orders: Order[];
};

type CheckoutInput = {
  shippingAddress: Address;
};

type StoreContextValue = {
  cartItems: CartItem[];
  customer: Customer | null;
  subtotal: number;
  cartCount: number;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;
  register: (
    payload: Omit<Customer, "orders" | "savedAddress"> & { savedAddress?: Address | null },
  ) => { ok: boolean; message: string };
  signIn: (email: string, password: string) => { ok: boolean; message: string };
  signOut: () => void;
  updateCustomer: (partial: Partial<Customer>) => void;
  saveAddress: (address: Address) => void;
  placeDemoOrder: (checkout: CheckoutInput) => string;
};

const CART_KEY = "wild-botaniks-cart";
const CUSTOMER_KEY = "wild-botaniks-customer";

const StoreContext = createContext<StoreContextValue | null>(null);

const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
};

export function StoreProvider({ children }: PropsWithChildren) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readStorage(CART_KEY, []));
  const [customer, setCustomer] = useState<Customer | null>(() => readStorage(CUSTOMER_KEY, null));

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (customer) {
      window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
      return;
    }

    window.localStorage.removeItem(CUSTOMER_KEY);
  }, [customer]);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product: Product, variant: ProductVariant, quantity = 1) => {
    const key = `${product.handle}:${variant.id}`;

    setCartItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }

      return [
        ...current,
        {
          key,
          productHandle: product.handle,
          title: product.cardTitle,
          variantId: variant.id,
          variantTitle: variant.title,
          image: product.images[0] ?? "/branding/wild-botaniks-logo.png",
          price: variant.price,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (key: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((current) => current.filter((item) => item.key !== key));
      return;
    }

    setCartItems((current) =>
      current.map((item) => (item.key === key ? { ...item, quantity } : item)),
    );
  };

  const removeFromCart = (key: string) => {
    setCartItems((current) => current.filter((item) => item.key !== key));
  };

  const register: StoreContextValue["register"] = (payload) => {
    if (customer?.email.toLowerCase() === payload.email.toLowerCase()) {
      return { ok: false, message: "This email is already registered in the demo account area." };
    }

    const nextCustomer: Customer = {
      ...payload,
      savedAddress: payload.savedAddress ?? null,
      orders: [],
    };

    setCustomer(nextCustomer);
    return { ok: true, message: "Account created. You're now signed in." };
  };

  const signIn: StoreContextValue["signIn"] = (email, password) => {
    if (!customer) {
      return { ok: false, message: "No demo account exists yet. Create one to continue." };
    }

    if (customer.email.toLowerCase() !== email.toLowerCase() || customer.password !== password) {
      return { ok: false, message: "Those credentials do not match the saved demo account." };
    }

    setCustomer({ ...customer });
    return { ok: true, message: "Signed in successfully." };
  };

  const signOut = () => {
    setCustomer(null);
  };

  const updateCustomer = (partial: Partial<Customer>) => {
    setCustomer((current) => (current ? { ...current, ...partial } : current));
  };

  const saveAddress = (address: Address) => {
    setCustomer((current) => (current ? { ...current, savedAddress: address } : current));
  };

  const placeDemoOrder = ({ shippingAddress }: CheckoutInput) => {
    const orderId = `WB-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: Order = {
      id: orderId,
      placedAt: new Date().toISOString(),
      total: subtotal,
      items: cartItems,
      status: "Checkout handoff ready",
      shippingAddress,
    };

    if (customer) {
      setCustomer({
        ...customer,
        savedAddress: shippingAddress,
        orders: [order, ...customer.orders],
      });
    }

    setCartItems([]);
    return orderId;
  };

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        customer,
        subtotal,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        register,
        signIn,
        signOut,
        updateCustomer,
        saveAddress,
        placeDemoOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }

  return context;
};
