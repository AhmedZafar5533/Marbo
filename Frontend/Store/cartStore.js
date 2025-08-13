import { toast } from "sonner";
import { create } from "zustand";
import { useAuthStore } from "./authStore";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useCartStore = create((set, get) => ({
  cart: [],
  cartQuantity: 0,
  isModalOpen: false,
  loading: false,
  success: false,
  error: null,

  setIsModalOpen: () => {
    set({ isModalOpen: !get().isModalOpen });
  },

  addToCart: async (product) => {
    const isLoggedIn = useAuthStore.getState().authenticationState;
    console.log(product);

    if (isLoggedIn) {
      try {
        // Send data to backend
        const response = await fetch(`${baseUrl}/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ product }),
        });

        const data = await response.json();

        if (data.success) {
          const currentCart = [...get().cart];

          const updatedCartItem = data.cartItem;
          console.log(updatedCartItem);

          if (updatedCartItem) {
            const existingItemIndex = currentCart.findIndex(
              (item) =>
                (item.productId &&
                  item.productId === updatedCartItem.productId) ||
                (item._id && item._id === updatedCartItem._id) ||
                item._id === updatedCartItem.productId ||
                item.productId === updatedCartItem._id
            );

            if (existingItemIndex >= 0) {
              currentCart[existingItemIndex] = updatedCartItem;
            } else {
              currentCart.push(updatedCartItem);
            }
          } else {
            // Fallback: manually update if backend doesn't return item data
            const existingItemIndex = currentCart.findIndex(
              (item) =>
                item.productId === product.productId || item._id === product._id
            );

            if (existingItemIndex >= 0) {
              currentCart[existingItemIndex].quantity += product.quantity || 1;
            } else {
              currentCart.push({ ...product, quantity: product.quantity || 1 });
            }
          }

          localStorage.setItem("cart", JSON.stringify(currentCart));
          set({ cart: currentCart });
          get().calculateCartQuantity();
          toast.success(data.message || "Product added to cart");
        } else {
          toast.error(data.message || "Failed to add to cart");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add to cart");
      }
    } else {
      // Handle offline cart (localStorage only)
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingItemIndex = storedCart.findIndex(
          (item) =>
            item._id === product._id || item.productId === product.productId
        );

        if (existingItemIndex >= 0) {
          storedCart[existingItemIndex].quantity += 1;
        } else {
          storedCart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem("cart", JSON.stringify(storedCart));
        set({ cart: storedCart });
        get().calculateCartQuantity();

        toast.success("Product added to cart");
      } catch (error) {
        console.error("Error managing cart in localStorage:", error);
        toast.error("Failed to manage cart");
      }
    }
  },

  removeFromCart: async (productId) => {
    const isLoggedIn = useAuthStore.getState().authenticationState;

    if (isLoggedIn) {
      try {
        // Remove from backend
        const response = await fetch(`${baseUrl}/cart/remove`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId }),
        });

        const data = await response.json();

        if (data.success) {
          // Get current cart from state
          const currentCart = [...get().cart];

          // Remove the item from current cart
          const updatedCart = currentCart.filter(
            (product) =>
              product._id !== productId && product.productId !== productId
          );

          localStorage.setItem("cart", JSON.stringify(updatedCart));
          set({ cart: updatedCart });
          get().calculateCartQuantity();
          toast.success("Product removed from cart");
        } else {
          toast.error(data.message || "Failed to remove from cart");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove from cart");
      }
    } else {
      // Handle offline removal
      try {
        const updatedCart = get().cart.filter(
          (product) =>
            product._id !== productId && product.productId !== productId
        );

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        set({ cart: updatedCart });
        get().calculateCartQuantity();

        toast.success("Product removed from cart");
      } catch (error) {
        console.error("Error removing from cart:", error);
        toast.error("Failed to remove from cart");
      }
    }
  },

  updateQuantity: async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeFromCart(productId);
      return;
    }

    const isLoggedIn = useAuthStore.getState().authenticationState;

    if (isLoggedIn) {
      try {
        const response = await fetch(`${baseUrl}/cart/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId, quantity: newQuantity }),
        });

        const data = await response.json();

        if (data.success) {
          // Get current cart from state
          const currentCart = [...get().cart];

          // Use the updated cart item from backend if available
          const updatedCartItem = data.cartItem || data.item;

          if (updatedCartItem) {
            // Find and update the specific item with backend data
            const itemIndex = currentCart.findIndex(
              (item) =>
                item._id === productId ||
                item.productId === productId ||
                item._id === updatedCartItem._id ||
                item.productId === updatedCartItem.productId
            );

            if (itemIndex >= 0) {
              currentCart[itemIndex] = updatedCartItem;
            }
          } else {
            // Fallback: manually update quantity
            const itemIndex = currentCart.findIndex(
              (item) => item._id === productId || item.productId === productId
            );

            if (itemIndex >= 0) {
              currentCart[itemIndex] = {
                ...currentCart[itemIndex],
                quantity: newQuantity,
              };
            }
          }

          localStorage.setItem("cart", JSON.stringify(currentCart));
          set({ cart: currentCart });
          get().calculateCartQuantity();
        } else {
          toast.error(data.message || "Failed to update quantity");
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      }
    } else {
      try {
        const updatedCart = get().cart.map((item) => {
          if (item._id === productId || item.productId === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        localStorage.setItem("cart", JSON.stringify(updatedCart));
        set({ cart: updatedCart });
        get().calculateCartQuantity();
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("Failed to update quantity");
      }
    }
  },

  getCart: async () => {
    set({ loading: true });
    try {
      const isLoggedIn = useAuthStore.getState().authenticationState;
      let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

      // If user is logged in and localStorage is empty, fetch from backend
      if (cartItems.length === 0 && isLoggedIn) {
        try {
          const response = await fetch(`${baseUrl}/cart/get`, {
            method: "GET",
            credentials: "include",
          });

          const data = await response.json();

          if (data.success && data.cartItems) {
            cartItems = data.cartItems;
            localStorage.setItem("cart", JSON.stringify(cartItems));
          } else if (response.status === 404) {
            cartItems = [];
            localStorage.setItem("cart", JSON.stringify([]));
          }
        } catch (error) {
          console.error("Error fetching cart from backend:", error);
          // Continue with localStorage data
        }
      }

      set({ cart: cartItems });
      get().calculateCartQuantity();
    } catch (error) {
      console.error("Error getting cart:", error);
      toast.error("Failed to load cart");
      set({ cart: [] });
    } finally {
      set({ loading: false });
    }
  },

  calculateCartQuantity: () => {
    const cart = get().cart;
    const totalQuantity = cart.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );
    set({ cartQuantity: totalQuantity });
  },

  clearCart: async () => {
    const isLoggedIn = useAuthStore.getState().authenticationState;

    if (isLoggedIn) {
      try {
        const response = await fetch(`${baseUrl}/cart/clear`, {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();

        if (data.success) {
          localStorage.removeItem("cart");
          set({ cart: [], cartQuantity: 0 });

        } else {
          toast.error(data.message || "Failed to clear cart");
        }
      } catch (error) {
        console.error("Error clearing cart:", error);
        toast.error("Failed to clear cart");
      }
    } else {
      localStorage.removeItem("cart");
      set({ cart: [], cartQuantity: 0 });
      toast.success("Cart cleared");
    }
  },

  syncCartOnLogin: async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (localCart.length > 0) {
        // Sync local cart with backend
        const response = await fetch(`${baseUrl}/cart/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ cartItems: localCart }),
        });

        const data = await response.json();

        if (data.success) {
          localStorage.setItem("cart", JSON.stringify(data.cartItems));
          set({ cart: data.cartItems });
          get().calculateCartQuantity();
        }
      } else {
        // Load cart from backend if local is empty
        get().getCart();
      }
    } catch (error) {
      console.error("Error syncing cart on login:", error);
    }
  },
}));
