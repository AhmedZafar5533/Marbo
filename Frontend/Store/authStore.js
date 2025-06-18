import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useAuthStore = create((set, get) => ({
    user: null,
    authenticationState: false,
    redirectToOtp: false,
    isVendor: false,
    isAdmin: false,
    vendorChecked: false, // new flag
    adminChecked: false, // new flag
    adminLoading: false,
    returnedMessages: [],

    loading: true, // Start with loading true to prevent flashes of redirect

    checkAuth: async () => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/auth/check", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (response.ok) {
                if (data.user && data.isAuthenticated && !data.otpRequired) {
                    set({
                        user: data.user,
                        authenticationState: true,
                        redirectToOtp: false,
                    });
                } else if (data.otpRequired) {
                    set({
                        authenticationState: false,
                        redirectToOtp: true,
                    });
                } else {
                    set({
                        authenticationState: false,
                        redirectToOtp: false,
                    });
                }
            } else {
                set({
                    authenticationState: false,
                    redirectToOtp: data.otpRequired || false,
                });
            }
        } catch (error) {
            set({
                authenticationState: false,
                redirectToOtp: false,
            });
        } finally {
            set({ loading: false });
        }
    },
    checkVendor: async () => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/auth/check-vendor", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();

            if (response.status === 200 && data.isAuthenticated) {
                set({
                    isVendor: true,
                    vendorChecked: true,
                    loading: false,
                });
            } else if (response.status === 304) {
                if (data.isAuthenticated) {
                    set({
                        isVendor: true,
                        vendorChecked: true,
                        loading: false,
                    });
                } else {
                    set({
                        isVendor: false,
                        vendorChecked: true,
                        loading: false,
                    });
                }
            } else {
                set({
                    isVendor: false,
                    vendorChecked: true,
                    loading: false,
                });
            }
        } catch (error) {
            set({
                isVendor: false,
                vendorChecked: true,
                loading: false,
            });
        }
    },
    // Rest of your store methods remain the same
    checkAdmin: async () => {
        try {
            set({ adminLoading: true });
            const response = await fetch(baseUrl + "/auth/check-admin", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                if (data.isAuthenticated) {
                    console.log("In 200 route", data);
                    set({ isAdmin: true, adminChecked: true });
                    console.log(get().isAdmin, get().adminChecked);
                }
                return;
            }
            if (response.status === 304) {
                if (data.isAuthenticated) {
                    console.log("In 304 route", data);

                    set({ isAdmin: true, adminChecked: true }); // Or potentially do nothing, depending on your logic
                }
                return;
            } else set({ isAdmin: false, adminChecked: true });
        } catch (error) {
            set({ isAdmin: false, adminChecked: true });
        } finally {
            console.log(get().isAdmin);
            set({ loading: false });
        }
    },
    sendRegisterReguest: async (userData) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include",
            });
            if (response.status === 201) {
                set({ redirectToOtp: true, authenticationState: false });
                toast.success(
                    "User registered successfully. Please verify yourself"
                );
            }
            const data = await response.json();

            if (!response.ok) {
                if (data.errorMessages) {
                    if (data.errorMessages.username) {
                        toast.error(data.errorMessages.username);
                        return;
                    }
                    if (data.errorMessages.email) {
                        toast.error(data.errorMessages.email);
                    }
                    return;
                }
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Registration failed");
        } finally {
            set({ loading: false });
        }
    },
    sendLoginRequest: async (userData) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 403) {
                set({ redirectToOtp: true, authenticationState: false });
                toast.info(data.message);
                return;
            }
            if (response.status === 200) {
                set({ authenticationState: true, user: data.user });
                toast.success("Login Successfull");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Login failed");
        } finally {
            set({ loading: false });
        }
    },

    getOtp: async () => {
        if (!get().redirectToOtp) return;
        try {
            const response = await fetch(baseUrl + "/otp/gen-otp", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("OTP generation failed");
            set({ authenticationState: false });
        }
    },
    verifyOtp: async (otp) => {
        if (!get().redirectToOtp) return;
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/otp/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp }),
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                set({ authenticationState: true, redirectToOtp: false });
                get().checkAuth();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("OTP verification failed");
            set({ authenticationState: false });
        } finally {
            set({ loading: false });
        }
    },
    sendLogoutRequest: async () => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/auth/logout", {
                method: "GET",
                credentials: "include",
            });
            if (response.status === 200) {
                const data = await response.json();
                toast.success(data.message);
                set({
                    authenticationState: false,
                    redirectToOtp: false,
                    user: null,
                });
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (err) {
            toast.error("Logout failed");
        } finally {
            set({ loading: false });
        }
    },
}));
