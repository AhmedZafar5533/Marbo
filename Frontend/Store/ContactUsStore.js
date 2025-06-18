import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useContactUsStore = create((set, get) => ({
    success: false,
    sendContactUsData: async (data) => {
        try {
            const response = await fetch(baseUrl + "/contact-us/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                set({ success: true });
                return true;
            } else {
                const data = await response.json();
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(
                "An error occurred while sending your message. Please try again."
            );
            return false;
        }
    },
}));
