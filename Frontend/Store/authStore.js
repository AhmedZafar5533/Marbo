import { create } from "zustand";
import { toast } from "sonner";
import { useCartStore } from "./cartStore";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useAuthStore = create((set, get) => ({
  user: null,
  authenticationState: false,
  redirectToOtp: false,
  isVendor: false,
  isAdmin: false,
  vendorChecked: false,
  adminChecked: false,
  returnedMessages: [],
  loading: true,

  // ---- Auth Checks ----
  checkAuth: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/check`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);

      if (res.ok && data.isAuthenticated && data.user && !data.otpRequired) {
        set({
          user: data.user,
          authenticationState: true,
          redirectToOtp: false,
        });
      } else if (data.otpRequired) {
        set({ authenticationState: false, redirectToOtp: true });
      } else {
        set({ authenticationState: false, redirectToOtp: false });
      }
    } catch {
      set({ authenticationState: false, redirectToOtp: false });
    } finally {
      set({ loading: false });
    }
  },

  checkVendor: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/check-vendor`, {
        credentials: "include",
      });
      const data = await res.json();
      set({
        isVendor: !!data.isAuthenticated,
        vendorChecked: true,
      });
    } catch {
      set({ isVendor: false, vendorChecked: true });
    } finally {
      set({ loading: false });
    }
  },

  checkAdmin: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/check-admin`, {
        credentials: "include",
      });
      const data = await res.json();
      set({
        isAdmin: !!data.isAuthenticated,
        adminChecked: true,
      });
    } catch {
      set({ isAdmin: false, adminChecked: true });
    } finally {
      set({ loading: false });
    }
  },

  // ---- Auth Actions ----
  sendRegisterRequest: async (userData) => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 201) {
        set({ redirectToOtp: true, authenticationState: false });
        toast.success("User registered successfully. Please verify yourself");
      } else if (data.errorMessages) {
        Object.values(data.errorMessages).forEach((msg) => toast.error(msg));
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch {
      toast.error("Registration failed");
    } finally {
      set({ loading: false });
    }
  },

  sendLoginRequest: async (userData) => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 403) {
        set({ redirectToOtp: true, authenticationState: false });
        toast.info(data.message);
      } else if (res.status === 200) {
        set({ authenticationState: true, user: data.user });
        toast.success("Login Successful");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Login failed");
    } finally {
      set({ loading: false });
    }
  },

  uploadProfilePic: async (imageData) => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/upload/profile-pic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
        get().checkAuth();
      } else if (!res.ok) {
        toast.error(data.message || "Profile picture upload failed");
      }
    } catch {
      toast.error("Profile picture upload failed");
    } finally {
      set({ loading: false });
    }
  },

  getOtp: async () => {
    if (!get().redirectToOtp) return;
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/otp/gen-otp`, {
        credentials: "include",
      });
      const data = await res.json();
      res.ok ? toast.success(data.message) : toast.error(data.message);
    } catch {
      toast.error("OTP generation failed");
      set({ authenticationState: false });
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (otp) => {
    if (!get().redirectToOtp) return;
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
        set({ authenticationState: true, redirectToOtp: false });
        get().checkAuth();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("OTP verification failed");
      set({ authenticationState: false });
    } finally {
      set({ loading: false });
    }
  },

  sendLogoutRequest: async () => {
    set({ loading: true });
    try {
      const res = await fetch(`${baseUrl}/auth/logout`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 200) {
        toast.success(data.message);
        set({
          authenticationState: false,
          redirectToOtp: false,
          user: null,
        });
        localStorage.removeItem("cart");
        useCartStore.getState().getCart();
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch {
      toast.error("Logout failed");
    } finally {
      set({ loading: false });
    }
  },
}));
