import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useContactUsStore = create((set, get) => ({
    sendContactUsData: async (data) => {
        try {
            const response = await fetch(baseUrl + "/contact-us/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: get().email,
                    message: get().message,
                    reason: get().reason,
                }),
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
                set({ email: "", message: "", reason: "" });
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                "An error occurred while sending your message. Please try again."
            );
        }
    },
}));
