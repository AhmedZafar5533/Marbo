import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = "http://localhost:3000/api";

export const useSubscriptionStore = create((set) => ({
    subscriptionInfo: null,
    loading: false,
    sendSubscriptionRequest: async (data) => {
        set({ loading: true });
        try {
            const response = await fetch(baseUrl + "/subscription/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                toast.error(responseData.message);
            }
            if (response.ok) {
                toast.success(responseData.message);
            }
            set({ loading: false });
            return responseData;
        } catch (error) {
            set({ loading: false });
            return { message: error.message };
        }
    },
    fetchSubscriptions: async () => {
        set({ loading: true });
        try {
            const response = await fetch(
                baseUrl + `/subscription/subscriptions`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const responseData = await response.json();
            if (response.ok || response.status === 304) {
                set({ subscriptionInfo: responseData });
            }
            if (!response.ok) {
                toast.error(responseData.message);
            }

            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            return { message: error.message };
        }
    },
    sendUnsubscribeRequest: async (data) => {
        set({ loading: true });
        try {
            const response = await fetch("/api/unsubscribe", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                toast.error(responseData.message);
            }
            if (response.ok) {
                toast.success(responseData.message);
            }
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            return { message: error.message };
        }
    },
    sendSubscriptionUpdateRequest: async (data) => {
        set({ loading: true });
        try {
            const response = await fetch("/api/updateSubscription", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const responseData = await response.json();
            if (!response.ok) {
                toast.error(responseData.message);
            }
            if (response.ok) {
                toast.success(responseData.message);
            }
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
            return { message: error.message };
        }
    },
}));
