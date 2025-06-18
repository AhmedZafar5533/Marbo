import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useClothingStore = create((set) => ({
    clothing: [],
    fetchedClothing: null,
    loading: false,
    dashboardData: [],

    getDashboardData: async () => {
        set({ loading: true });
        try {
            const response = await fetch(`${baseUrl}/clothing/get/dashboard`, {
                method: "GET",
                credentials: "include",
            });
            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                console.log(data);
                set({ dashboardData: data.clothing });
            }
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to get dashboard data");
                return;
            }
        } catch (error) {
            toast.error("Error getting dashboard data:", error);
            set({ dashboardData: [] });
        } finally {
            set({ loading: false });
        }
    },
    addClothes: async (clothingData) => {
        try {
            set({ loading: true });
            const response = await fetch(`${baseUrl}/clothing/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(clothingData),
                credentials: "include",
            });
            if (response.status === 201) {
                const data = await response.json();
                toast.success(data.message);
                return true;
            } else if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Error adding clothing:");
        } finally {
            set({ loading: false });
        }
    },
    getAllClothes: async (serviceId) => {
        try {
            set({ loading: true });
            const response = await fetch(
                `${baseUrl}/clothing/get/all/${serviceId}`
            );

            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                set({ clothing: data.clothing });
                return true;
            } else if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Error fetching clothing:");
        } finally {
            set({ loading: false });
        }
    },
    getDetails: async (id) => {
        try {
            set({ loading: true });
            const response = await fetch(`${baseUrl}/clothing/get/${id}`);
            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                set({ fetchedClothing: data.clothing });
                return true;
            } else if (!response.ok) {
                const data = await response.json();
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Error fetching clothing:");
        } finally {
            set({ loading: false });
        }
    },
}));
