import { toast } from "sonner";
import { create } from "zustand";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useTourStore = create((set) => ({
  isTourOpen: false,
  loading: false,
  data: [],
  details: null,
  countries: [],
  createTour: async (data) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/tours/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to create tour");
        return false;
      }

      if (response.status === 201) {
        const data = await response.json();
        toast.success(data.message || "Tour created successfully");
        return true;
      }
    } catch (error) {
      toast.error("Error creating tour" || error.message);
    } finally {
      set({ loading: false });
    }
  },
  getToursByType: async (country, type, id) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${baseUrl}/tours/${type}/${country}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        // toast.error(data.message || "Failed to fetch tours");
        set({ data: [] });
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        console.log("Fetched tours:", data);
        set({ data });
      }
    } catch (error) {
      toast.error("Error fetching tours" || error.message);
    } finally {
      set({ loading: false });
    }
  },
  getDetailsById: async (id) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/tours/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to fetch tour details");
        return null;
      }
      if (response.status === 200) {
        const data = await response.json();
        return set({ details: data });
      }
    } catch (error) {
      toast.error("Error fetching tour details" || error.message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  fetchCountries: async (id) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${baseUrl}/tours/countries-available/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to fetch countries");
        set({ countries: [] });
        return [];
      }
      if (response.status === 200) {
        const data = await response.json();
        set({ countries: data });
      }
    } catch (error) {
      toast.error("Error fetching countries" || error.message);
      return [];
    } finally {
      set({ loading: false });
    }
  },
  openTour: () => set({ isTourOpen: true }),
  closeTour: () => set({ isTourOpen: false }),
}));
