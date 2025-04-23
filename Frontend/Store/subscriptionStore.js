import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = "http://localhost:3000/api";

const STORAGE_KEY = "sentSubscriptionInfo";

export const useSubscriptionStore = create((set, get) => ({
    subscriptionInfo: null,
    loading: false,
    subscirptionSuccess: false,
    sentSubscriptionInfo: JSON.parse(localStorage.getItem(STORAGE_KEY)) || null,

    setSubscriptionInfo: (info) => {
        console.log(info);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
        set({ sentSubscriptionInfo: info });
    },

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
                localStorage.removeItem(STORAGE_KEY); // Clear on success
                set({ sentSubscriptionInfo: null }); // Update store state
                set({ subscirptionSuccess: true });
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
