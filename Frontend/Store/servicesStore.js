import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useServiceStore = create((set, get) => ({
  servicePage: null,
  servicesData: [],
  allServices: [],
  pageId: null,
  loading: true,
  isInitialized: false,
  pageIsInitialized: false,
  frontEndServices: [],
  successfullyCreated: false,

  initializeService: async (newData) => {
    try {
      set({ loading: true });

      const result = await fetch(
        `${baseUrl}/service-page/services/initialize`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newData),
        }
      );
      const data = await result.json();

      if (result.ok) {
        set((state) => ({
          servicesData: [...state.servicesData, data.data],
        }));
        set({ successfullyCreated: true });

        toast.success(data.message || "Service created successfully");
      } else {
        toast.error(data.message || "Internal Server Error");
        set({ successfullyCreated: false });
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("initializePage error:", error);
    } finally {
      set({ loading: false });
    }
  },
  getAllServices: async (category) => {
    set({ loading: true });
    try {
      const result = await fetch(
        `${baseUrl}/service-page/services/all/${category}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await result.json();

      if (result.status === 304) {
        set({
          allServices: data.data.map((service) => ({
            ...service,
            rating: 4.5, // Default rating, you can change this dynamically
          })),
        });
      }
      if (result.status === 200) {
        set({
          allServices: data.data.map((service) => ({
            ...service,
            rating: 4.5, // Default rating, you can change this dynamically
          })),
        });

        if (data.data.length === 0) toast.success("No services Found");
      }
      if (!result.ok) set({ allServices: [] });
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("initializePage error:", error);
    } finally {
      set({ loading: false });
    }
  },

  editService: async (serviceId, updatedData) => {
    set({ loading: true });
    try {
      const result = await fetch(
        `${baseUrl}/service-page/service/${serviceId}/edit`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await result.json();
      if (result.ok) {
        set((state) => ({
          servicesData: state.servicesData.map((service) =>
            service._id === serviceId ? data.data : service
          ),
        }));
        toast.success(data.message || "Service updated successfully");
      } else toast.error(data.message || "Internal Server Error");
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("initializePage error:", error);
    } finally {
      set({ loading: false });
    }
  },
  deleteService: async (serviceId) => {
    set({ loading: true });
    try {
      const result = await fetch(
        `${baseUrl}/service-page/service/${serviceId}/delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await result.json();
      if (result.ok) {
        set((state) => ({
          servicesData: state.servicesData.filter(
            (service) => service._id !== serviceId
          ),
        }));
        toast.success(data.message || "Service deleted successfully");
      } else toast.error(data.message || "Internal Server Error");
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("initializePage error:", error);
    } finally {
      set({ loading: false });
    }
  },

  getServicesData: async (id) => {
    set({ loading: true });
    try {
      const result = await fetch(`${baseUrl}/service-page/services/get`, {
        method: "GET",
        credentials: "include",
      });

      const data = await result.json();

      if (result.status === 304) set({ servicesData: data.data });
      if (result.ok) {
        set({ servicesData: data.data });
        if (data.data.length > 0)
          toast.success("Services data retrieved successfully");
        return;
      }
      if (
        (!result.ok && data.onboardingDone === "pending") ||
        data.onboardingDone === "no"
      ) {
        toast.info(data.message);
        return;
      } else toast.error(data.message || "Internal Server Error");
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("initializePage error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchFrontendServices: async () => {
    try {
      set({ loading: true });
      const result = await fetch(
        `${baseUrl}/service-page/services/active/all`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await result.json();

      if (result.ok) {
        const dataToSet = data.data.map((service) => service.title);
        console.log(dataToSet);
        set({ frontEndServices: dataToSet });
      }
      if (!result.ok) toast.error(data.message);
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("initializePage error:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
