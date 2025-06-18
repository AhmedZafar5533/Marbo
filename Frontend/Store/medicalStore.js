import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useMedicalStore = create((set) => ({
    doctors: [],
    loading: false,
    serviceData: [],
    dashboardData: [],

    fetchDashboardData: async () => {
        try {
            const response = await fetch(`${baseUrl}/medical/get/dashboard`, {
                method: "GET",
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                set({ dashboardData: data.doctors });
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    },
    fetchDoctors: async (serviceId) => {
        console.log("Fetching doctors for service ID:", serviceId);
        set({ loading: true });

        try {
            const response = await fetch(
                `${baseUrl}/medical/get/all/${serviceId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                console.log(data);
                set({ doctors: data.doctors, serviceData: data.serviceData });
            }
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to fetch doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            set({ error: error.message, loading: false });
        } finally {
            set({ loading: false });
        }
    },
    addDoctor: async (doctorData) => {
        set({ loading: true, error: null });
        try {
            console.log("Adding doctor with data:", doctorData);
            const response = await fetch(`${baseUrl}/medical/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(doctorData),
                credentials: "include",
            });
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to add doctor");
            }
            if (response.status === 201) {
                const data = await response.json();
                toast.success(data.message || "Doctor added successfully");
                return true;
            }
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },
}));
