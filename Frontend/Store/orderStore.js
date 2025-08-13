import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
export const useOrderStore = create((set) => ({
  loading: false,
  orders: [],
  addOrder: async (data) => {
    console.log(data);
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + "/orders/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error saving order!");
        return false;
      }
      if (response.status === 201) {
        const data = await response.json();
       
        return true;
      }
    } catch (error) {
      toast.error(data.message || "Internal server error!");
    } finally {
      set({ loading: false });
    }
  },

  getOrders: async () => {
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + "/orders/get", {
        method: "GET",
        credentials: "include",
      });
      console.log(response);
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error fetching orders!");
        return false;
      }
      if (response.status === 200 || response.data.success === true) {
        const data = await response.json();
        console.log(data);
        set({ orders: data.items });
      }
    } catch (error) {
      toast.error(data.message || "Internal server error!");
    } finally {
      set({ loading: false });
    }
  },
  placeOrder: async () => {
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + "/orders/place", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error fetching orders!");
        return false;
      }
      if (response.status === 200) {
        const data = await response.json();
        return data.orders;
      }
    } catch (error) {
      toast.error(data.message || "Internal server error!");
    } finally {
      set({ loading: false });
    }
  },
}));
