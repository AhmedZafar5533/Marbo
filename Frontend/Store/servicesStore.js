import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

// Helper function for API requests with error handling
const fetchData = async (url, options) => {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }
    return result;
};

export const useServiceStore = create((set, get) => ({
    servicePage: null,
    servicesData: [],
    allServices: [],
    pageId: null,
    loading: false,
    isInitialized: false,
    pageIsInitialized: false,
    successfullyCreated: false,

    initializeService: async (newData) => {
        try {
            set({ loading: true });
            const result = await fetch(
                `${baseUrl}/service-page/services/initialize`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData),
                }
            );
            const data = await result.json();

            if (result.ok) {
                set((state) => ({
                    servicesData: [...state.servicesData, data.data],
                }));
                set({ successfullyCreated: true });

                toast.success(data.message || "Service created successfully");
            } else {
                toast.error(data.message || "Internal Server Error");
                set({ successfullyCreated: false });
            }
        } catch (error) {
            toast.error("Internal Server Error");
            console.error("initializePage error:", error);
        } finally {
            set({ loading: false });
        }
    },
    getAllServices: async () => {
        set({ loading: true });
        try {
            const result = await fetch(`${baseUrl}/service-page/services/all`, {
                method: "GET",
                credentials: "include",
            });

            const data = await result.json();

            if (result.status === 304)
                set({
                    allServices: data.data.map((service) => ({
                        ...service,
                        rating: 4.5, // Default rating, you can change this dynamically
                    })),
                });
            if (result.ok) {
                set({
                    allServices: data.data.map((service) => ({
                        ...service,
                        rating: 4.5, // Default rating, you can change this dynamically
                    })),
                });

                if (data.data.length === 0) toast.success("No services Found");
            }

            if (!result.ok) {
                toast.error("Error loading data. Please reload the page");
            }
        } catch (error) {
            toast.error("Internal Server Error");
            console.error("initializePage error:", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteService: async (serviceId) => {
        set({ loading: true });
        try {
            const result = await fetch(
                `${baseUrl}/service-page/service/${serviceId}/delete`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            const data = await result.json();
            if (result.ok) {
                set((state) => ({
                    servicesData: state.servicesData.filter(
                        (service) => service._id !== serviceId
                    ),
                }));
                toast.success(data.message || "Service deleted successfully");
            } else toast.error(data.message || "Internal Server Error");
        } catch (error) {
            toast.error("Internal Server Error");
            console.error("initializePage error:", error);
        } finally {
            set({ loading: false });
        }
    },

    getServicesData: async (id) => {
        set({ loading: true });
        try {
            const result = await fetch(`${baseUrl}/service-page/services/get`, {
                method: "GET",
                credentials: "include",
            });

            const data = await result.json();

            if (result.status === 304) set({ servicesData: data.data });
            if (result.ok) {
                set({ servicesData: data.data });
                if (data.data.length > 0)
                    toast.success("Services data retrieved successfully");
                return;
            }
            if (
                (!result.ok && data.onboardingDone === "pending") ||
                data.onboardingDone === "no"
            ) {
                toast.info(data.message);
                return;
            } else toast.error(data.message || "Internal Server Error");
        } catch (error) {
            toast.error("Internal Server Error");
            console.error("initializePage error:", error);
        } finally {
            set({ loading: false });
        }
    },

    // initializeServicePage: async (id) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetch(`${baseUrl}/service-page/initialize`, {
    //             method: "POST",
    //             credentials: "include",
    //         });
    //         const data = await result.json();

    //         if (data.pageIsInitialized) {
    //             set({ pageIsInitialized: true });
    //             return;
    //         }
    //         if (result.ok) {
    //             set({
    //                 pageIsInitialized: true,
    //             });
    //             toast.success("Service Page created successfully");
    //         }
    //     } catch (error) {
    //         toast.error("Internal Server Error");
    //         console.error("initializePage error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },

    // getPageData: async (pageId) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetchData(
    //             `${baseUrl}/service-page/${pageId}`,
    //             {
    //                 method: "GET",
    //             }
    //         );

    //         if (result.success) {
    //             set({
    //                 isInitialized: true,
    //                 servicePage: result.data,
    //             });
    //         } else {
    //             set({
    //                 isInitialized: false,
    //             });
    //             toast.success("Page data retrieval failed. Please reload");
    //         }
    //     } catch (error) {
    //         toast.error("Internal Server Error");
    //         console.error("initializePage error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },

    // saveHeaderData: async (headerData, pageId) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetchData(
    //             `${baseUrl}/service-page/edit/header`,
    //             {
    //                 method: "PUT",
    //                 credentials: "include",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(headerData),
    //             }
    //         );
    //         toast.success("Service Page Header saved successfully");
    //         set({
    //             servicePage: { ...result },
    //         });
    //     } catch (error) {
    //         toast.error(error.message || "Internal Server Error");
    //         console.error("saveHeaderData error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },

    // sendAboutUsData: async (aboutData, pageId) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetchData(
    //             `${baseUrl}/service-page/edit/about`,
    //             {
    //                 method: "PUT",
    //                 credentials: "include",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(aboutData),
    //             }
    //         );
    //         toast.success(
    //             result.message || "About Us data updated successfully"
    //         );
    //         set({
    //             servicePage: { ...result },
    //         });
    //     } catch (error) {
    //         toast.error(error.message || "Internal Server Error");
    //         console.error("sendAboutUsData error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },

    // sendHowItWorksData: async (howItWorksData, pageId) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetchData(
    //             `${baseUrl}/service-page/edit/how-it-works`,
    //             {
    //                 method: "PUT",
    //                 credentials: "include",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(howItWorksData),
    //             }
    //         );
    //         toast.success(
    //             result.message || "How It Works data updated successfully"
    //         );
    //         set({
    //             servicePage: { ...result },
    //         });
    //     } catch (error) {
    //         toast.error(error.message || "Internal Server Error");
    //         console.error("sendHowItWorksData error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },

    // sendFeaturesData: async (featuresData, pageId) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetchData(
    //             `${baseUrl}/service-page/edit/features`,
    //             {
    //                 method: "PUT",
    //                 credentials: "include",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(featuresData),
    //             }
    //         );
    //         toast.success(
    //             result.message || "Features data updated successfully"
    //         );
    //         set({
    //             servicePage: { ...result },
    //         });
    //     } catch (error) {
    //         toast.error(error.message || "Internal Server Error");
    //         console.error("sendFeaturesData error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },

    // sendPricingData: async (pricingData, pageId) => {
    //     set({ loading: true });
    //     try {
    //         const result = await fetchData(
    //             `${baseUrl}/service-page/edit/pricing`,
    //             {
    //                 method: "PUT",
    //                 credentials: "include",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(pricingData),
    //             }
    //         );
    //         toast.success(
    //             result.message || "Pricing data updated successfully"
    //         );
    //         set({
    //             servicePage: { ...result },
    //         });
    //     } catch (error) {
    //         toast.error(error.message || "Internal Server Error");
    //         console.error("sendPricingData error:", error);
    //     } finally {
    //         set({ loading: false });
    //     }
    // },
}));
