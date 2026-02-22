import { Product } from './mockData';

export interface CartItem extends Product {
  quantity: number;
}

const CART_KEY = 'dandl_cart';

const getCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    console.error('Failed to save cart to localStorage');
  }
};

export const cartStore = {
  getCart: () => getCartFromStorage(),
  
  addItem: (product: Product, quantity = 1) => {
    const cart = getCartFromStorage();
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    saveCartToStorage(cart);
  },

  removeItem: (productId: number) => {
    let cart = getCartFromStorage();
    cart = cart.filter((item) => item.id !== productId);
    saveCartToStorage(cart);
  },

  updateQuantity: (productId: number, quantity: number) => {
    let cart = getCartFromStorage();
    const item = cart.find((item) => item.id === productId);
    if (item) {
      if (quantity <= 0) {
        cartStore.removeItem(productId);
      } else {
        item.quantity = quantity;
        saveCartToStorage(cart);
      }
    }
  },

  clearCart: () => {
    saveCartToStorage([]);
  },

  getTotal: () => {
    const cart = getCartFromStorage();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCount: () => {
    const cart = getCartFromStorage();
    return cart.reduce((count, item) => count + item.quantity, 0);
  },
};
