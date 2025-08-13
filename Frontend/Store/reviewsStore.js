import { create } from "zustand";
import { toast } from "sonner";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useReviewStore = create((set, get) => ({
  reviews: [],
  isModelOpen: false,
  loading: false,
  success: false,
  error: null,

  setisModelOpen: () => {
    console.log("setisModelOpen");
    set({ isModelOpen: !get().isModelOpen });
    console.log(get().isModelOpen);
  },
  fetchReviews: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${baseUrl}/reviews`);
      const data = await response.json();
      set({ reviews: data.reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      set({ loading: false });
    }
  },
  postReview: async (id, reviewData) => {
    set({ loading: true });
    try {
      const response = await fetch(`${baseUrl}/reviews/upload/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
        credentials: "include",
      });

      if (response.status === 201) {
        const data = await response.json();
        set({ success: true, error: null });
        toast.success(data.message);
      }
      if (!response.ok) {
        const data = await response.json();
        set({ error: data.message, success: false });
        toast.error(data.message);
      }
    } catch (error) {}
  },
}));
