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
  singleService: null,
  serviceInfo: null,

  getServiceInfo: async (id) => {
    set({ loading: true });
    try {
      const result = await fetch(
        `${baseUrl}/service-page/services/info/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (result.status === 200) {
        const data = await result.json();
        set({ serviceInfo: data.data });
        console.log(get().serviceInfo);
      } else if (!result.ok) set({ serviceInfo: null });
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("getServiceInfo error:", error);
    } finally {
      set({ loading: false });
    }
  },

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

      if (result.status === 201) {
        set((state) => ({
          servicesData: [...state.servicesData, data.data],
        }));

        toast.success(data.message || "Service created successfully");
        set({ successfullyCreated: true });
        return true;
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

      if (result.status === 200) {
        console.log("Frontend services data:", data);
        const dataToSet = data.data.map((service) => service.title);

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

  getSingleService: async (id) => {
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + `/service-page/service/${id}`);
      if (!response.ok) {
        const data = await response.json();
        toast.error("Error finding service" || data.message);
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        set({ singleService: data.data });
        return;
      }
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      set({ loading: false });
    }
  },
}));
