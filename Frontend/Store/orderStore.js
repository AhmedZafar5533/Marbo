import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
export const useOrderStore = create((set) => ({
    loading: false,
    addOrder: async (data) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/orders/add/"+data.id, {
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
                toast.success(data.message || "Order created Succssfully");
                return false;
            }
        } catch (error) {
            toast.error(data.message || "Internal server error!");
        } finally {
            set({ loading: false });
        }
    },
}));
