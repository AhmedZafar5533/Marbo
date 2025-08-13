import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useProductStore = create((set) => ({
  products: [],
  fetchedProduct: null,
  loading: false,
  addProduct: async (product) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/products/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
        credentials: "include",
      });

      console.log("Response from adding product:", response);

      if (response.status === 200) {
        const data = await response.json();
        set((state) => ({
          products: [...state.products, product],
        }));
        toast.success(data.message || "Product added successfully");
        return true;
      } else if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to add product");
        return false;
      }
    } catch (error) {
      toast.error("Failed to add product. Please try again.");
      return false;
    } finally {
      set({ loading: false });
    }
  },
  getInventory: async (type) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${baseUrl}/products/get/inventory/${type}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 200 || response.status === 304) {
        const data = await response.json();
        console.log("Inventory data fetched:", data.products);
        set({ products: data.products });
        return data.products;
      } else if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to fetch inventory");
        return [];
      }
    } catch (error) {
      toast.error("Failed to fetch inventory. Please try again.");
      return [];
    } finally {
      set({ loading: false });
    }
  },
  getProducts: async (serviceId) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/products/get/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200 || response.status === 304) {
        const data = await response.json();
        console.log(data);
        set({ products: data.products });
        return data.products;
      }
    } catch (error) {
      toast.error("Failed to fetch products. Please try again.");
      return [];
    } finally {
      set({ loading: false });
    }
  },
  getProductById: async (productId) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${baseUrl}/products/get/product/${productId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 200 || response.status === 304) {
        const data = await response.json();
        set({ fetchedProduct: data.product });
        console.log("Fetched product:", data.product);
      } else if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to fetch product");
        return;
      }
    } catch (error) {
      toast.error("Failed to fetch product. Please try again.");
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));
