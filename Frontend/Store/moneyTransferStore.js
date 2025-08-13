import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useMoneyTransferStore = create((set) => ({
  loading: false,
  exchangeRate: null,
  transferData: null,

  checkConversionRate: async (fromCurrency, toCurrency) => {
    try {
      set({ loading: true });

      console.log(fromCurrency);
      console.log(toCurrency);

      const response = await fetch(
        `${baseUrl}/money/rate/exhange/${fromCurrency}?to=${toCurrency}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 200 || response.status === 304) {
        const result = await response.json();
        console.log(result);
        set({ exchangeRate: result.data });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to get exchange rate");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  addOrder: async (orderData, serviceId) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/money/order/add/${serviceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(orderData),
      });

      if (response.status === 201) {
        const result = await response.json();
        console.log(result);
        toast.success("Money transfer created successfully.");
        set({ transferData: result.data });
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to create money transfer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
  getOrderData: async (serviceId) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/money/get/order/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const result = await response.json();
        console.log(result.data);
        set({ transferData: result.data });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to fetch order data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
