import { toast } from "sonner";
import { create } from "zustand";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useOilOfferStore = create((set) => ({
  oilOffers: [],
  offerDetail: null,
  loading: false,
  addOilOffer: async (offer) => {
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + "/oil-offers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(offer),
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error adding oil offer!");
        return false;
      }
      if (response.status === 201) {
        const data = await response.json();
        toast.success("Oil offer added successfully!");
        return true;
      }
    } catch (error) {
      toast.error("Internal server error!");
    } finally {
      set({ loading: false });
    }
  },

  getOffer: async (offerId) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/oil-offers/${offerId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error fetching oil offer!");
        return false;
      }
      if (response.status === 200) {
        const data = await response.json();
        console.log("Fetched oil offer:", data.offer);
        set({ offerDetail: data.offer });
        return data.offer;
      }
    } catch (error) {
      toast.error("Internal server error!");
    } finally {
      set({ loading: false });
    }
  },

  updateOilOffer: (offerId, updatedOffer) =>
    set((state) => ({
      oilOffers: state.oilOffers.map((offer) =>
        offer._id === offerId ? updatedOffer : offer
      ),
    })), // Update an existing oil offer
  deleteOilOffer: (offerId) =>
    set((state) => ({
      oilOffers: state.oilOffers.filter((offer) => offer._id !== offerId),
    })), // Delete an oil offer
}));
export default useOilOfferStore;
