import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useAuthStore = create((set, get) => ({
    user: null,
    authenticationState: false,
    redirectToOtp: false,
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

    // Rest of your store methods remain the same
    checkAdmin: async () => {
        try {
            const response = await fetch(baseUrl + "/auth/check-admin", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 200) {
                if (data.isAdmin) {
                    set({ user: data.user, authenticationState: true });
                }
            }
        } catch (error) {}
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
                    set({ returnedMessages: data.errorMessages });
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
