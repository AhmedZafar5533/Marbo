import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = "http://localhost:3000/api";

export const useVendorStore = create((set) => ({
    vendor: [],
    goToNextStep: false,
    loading: false,
    isInitialized: false,

    unsetGotoNextStep: () => set({ goToNextStep: false }),

    initializeOnboarding: async () => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/vendor/initialize", {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json();

            if (data.isInititialized) {
                toast.success("Continue Onboarding");
                set((state) => ({
                    vendor: [...state.vendor, data.vendorData],
                }));
                set({ isInitialized: true });
                return;
            }
            if (response.status === 201) {
                toast.success(data.message);
                set((state) => ({
                    vendor: [...state.vendor, data.vendorData],
                }));
                set({ isInitialized: true });
            } else if (!response.ok) {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error initializing onboarding");
        } finally {
            set({ loading: false });
        }
    },
    sendBusinessDetails: async (businessDetails) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/vendor/business-details", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(businessDetails),
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                set((state) => ({
                    vendor:
                        state.vendor.length > 0
                            ? [{ ...state.vendor[0], ...data.vendor }]
                            : [data.vendor],
                }));
                set({ goToNextStep: true });
            } else if (!response.ok) {
                toast.error(data.message);
                set({ goToNextStep: false });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.data.message || "Error saving business details");
        } finally {
            set({ loading: false });
        }
    },
    sendBusinessContact: async (businessContact) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/vendor/business-contact", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(businessContact),
            });
            const data = await response.json();

            if (response.status === 200) {
                console.log(data.vendor.businessContact);
                toast.success(data.message);
                set((state) => ({
                    vendor:
                        state.vendor.length > 0
                            ? [{ ...state.vendor[0], ...data.vendor }]
                            : [data.vendor],
                }));
                set({ goToNextStep: true });
            } else if (!response.ok) {
                toast.error(data.message);
                set({ goToNextStep: false });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error saving business contact details");
        } finally {
            set({ loading: false });
        }
    },
    sendOwnerDetails: async (ownerDetails) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/vendor/owner-details", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(ownerDetails),
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                set((state) => ({
                    vendor:
                        state.vendor.length > 0
                            ? [{ ...state.vendor[0], ...data.vendor }]
                            : [data.vendor],
                }));
                set({ goToNextStep: true });
            } else if (!response.ok) {
                toast.error(data.message);
                set({ goToNextStep: false });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error saving owner details");
        } finally {
            set({ loading: false });
        }
    },
    sendContactPerson: async (contactPerson) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/vendor/contact-person", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(contactPerson),
            });
            const data = await response.json();

            if (response.status === 200) {
                toast.success(data.message);
                set((state) => ({
                    vendor:
                        state.vendor.length > 0
                            ? [{ ...state.vendor[0], ...data.vendor }]
                            : [data.vendor],
                }));
                set({ goToNextStep: true });
            } else if (!response.ok) {
                toast.error(data.message);
                set({ goToNextStep: false });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error saving contact person details");
        } finally {
            set({ loading: false });
        }
    },
    sendAddressDetails: async (addressDetails) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/vendor/business-address", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(addressDetails),
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                set((state) => ({
                    vendor:
                        state.vendor.length > 0
                            ? [{ ...state.vendor[0], ...data.vendor }]
                            : [data.vendor],
                }));
            } else if (!response.ok) {
                toast.error(data.message);
                set({ goToNextStep: false });
            }
        } catch (error) {
            console.log(error);
            toast.error("Error saving address details");
        } finally {
            set({ loading: false });
        }
    },
}));
