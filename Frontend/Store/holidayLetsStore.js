import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useHolidayLetsStore = create((set) => ({
    loading: true,
    properties: [],
    dashboardData: [],
    property: null,

    getDashboardData: async () => {
        set({ loading: true });
        try {
            const response = await fetch(
                `${baseUrl}/holiday-lets/get/dashboard`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to get dashboard data");
                return;
            }
            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                console.log(data);
                set({ dashboardData: data.properties });
            }
        } catch (error) {
            toast.error("Error getting dashboard data:", error);
            set({ dashboardData: [] });
        } finally {
            set({ loading: false });
        }
    },
    getProperties: async (serviceId) => {
        try {
            set({ loading: true });
            const response = await fetch(
                `${baseUrl}/holiday-lets/get/all/${serviceId}`
            );
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Something went wrong");
                return false;
            }
            if (response.status === 304 || response.status === 200) {
                const data = await response.json();
                set({ properties: data.properties });
                return true;
            }
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getProperty: async (id) => {
        try {
            set({ loading: true });
            const response = await fetch(`${baseUrl}/holiday-lets/get/${id}`);
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Something went wrong");
                return false;
            }
            if (response.status === 304 || response.status === 200) {
                const data = await response.json();
                set({ property: data.property });
                console.log(data.property);
                return true;
            }
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        } finally {
            set({ loading: false });
        }
    },

    addHolidayProperty: async (propertyData) => {
        try {
            set({ loading: true });

            const response = await fetch(`${baseUrl}/holiday-lets/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(propertyData),
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Something went wrong");
                return false;
            }

            if (response.status === 201) {
                const data = await response.json();
                toast.success(data.message);
                return true;
            }
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
