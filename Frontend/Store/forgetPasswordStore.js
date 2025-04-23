import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
export const useForgetPasswordStore = create((set) => ({
    loading: false,
    resetSuccess: false,
    sendForgetPasswordRequest: async (email) => {
        try {
            set({ loading: true });
            const response = await fetch(
                baseUrl + "/forget-password/send/reset/link",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else if (!response.ok) {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Password reset failed");
        } finally {
            set({ loading: false });
        }
    },

    sendResetPasswordRequest: async (info) => {
        try {
            set({ loading: true });

            const response = await fetch(baseUrl + "/forget-password/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(info),
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                set({ resetSuccess: true });
            } else if (!response.ok) {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Password reset failed");
        } finally {
            set({ loading: false });
        }
    },
}));
