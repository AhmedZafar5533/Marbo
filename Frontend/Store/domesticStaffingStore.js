import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const useDomesticStaffingStore = create((set, get) => ({
    loading: false,
    domesticStaffing: [],
    dashboardData: [],
    serviceData: [],

    getDashboardData: async () => {
        set({ loading: true });
        try {
            const response = await fetch(
                `${baseUrl}/domestic-staffing/get/dashboard`,
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
                set({ dashboardData: data.domesticStaffing });
            }
        } catch (error) {
            toast.error("Error getting dashboard data:", error);
            set({ dashboardData: [] });
        } finally {
            set({ loading: false });
        }
    },

    deleteDomesticStaffing: async (id) => {
        set({ loading: true });
        try {
            const response = await fetch(
                `${baseUrl}/domestic-staffing/delete/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                toast.error(
                    data.message || "Failed to delete domestic staffing"
                );
                return false;
            }
            if (response.status === 200) {
                const data = await response.json();
                toast.success(
                    data.message || "Domestic staffing deleted successfully"
                );
                return true;
            }
        } catch (error) {
            toast.error("Error deleting domestic staffing:", error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    editDomesticStaffing: async (id, data) => {
        set({ loading: true });
        try {
            const response = await fetch(
                `${baseUrl}/domestic-staffing/edit/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                toast.error(
                    data.message || "Failed to update domestic staffing"
                );
                return false;
            }
            if (response.status === 200) {
                const data = await response.json();
                toast.success(
                    data.message || "Domestic staffing updated successfully"
                );
                return true;
            }
        } catch (error) {
            toast.error("Error updating domestic staffing:", error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getAllDomesticStaffing: async (serviceId) => {
        set({ loading: true });
        try {
            const response = await fetch(
                `${baseUrl}/domestic-staffing/get/${serviceId}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to get domestic staffing");
                return;
            }
            if (response.status === 200 || response.status === 304) {
                
                const data = await response.json();
                console.log(data);
                set({
                    domesticStaffing: data.domesticStaffing,
                    serviceData: data.serviceData,
                });
            }
        } catch (error) {
            toast.error("Error getting domestic staffing:", error);
            set({ domesticStaffing: [] });
        } finally {
            set({ loading: false });
        }
    },

    addDomesticStaffing: async (type, description, schedule) => {
        set({ loading: true });
        try {
            const response = await fetch(`${baseUrl}/domestic-staffing/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type, description, schedule }),
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to add domestic staffing");
            }
            if (response.status === 201) {
                const data = await response.json();
                set((state) => ({
                    domesticStaffing: [...state.domesticStaffing, data],
                }));
                toast.success("Domestic staffing added successfully");
                return true;
            }
        } catch (error) {
            toast.error("Error adding domestic staffing:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
