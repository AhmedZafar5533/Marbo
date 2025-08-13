import { toast } from "sonner";
import { create } from "zustand";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useBillFeeStore = create((set) => ({
  loading: false,
  billFee: null,
  serviceData: null,

  uploadBillFeeData: async (type, id, billData) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/bill/upload/${type}/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(billData),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error uploading bill fee data");
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        set({ billFee: data.bill });
        return true;
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("Error uploading bill fee data:", error);
    } finally {
      set({ loading: false });
    }
  },

  fecthExistingBill: async (type, serviceId) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/bill/get/${type}/${serviceId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error uploading bill fee data");
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        if (!data.bill && data.serviceData) {
          console.log(data);
          set({ serviceData: data.serviceData });
          return;
        }
        set({ billFee: data.bill, serviceData: data.bill.serviceId });
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("Error uploading bill fee data:", error);
    } finally {
      console.log("Here we are");
      set({ loading: false });
    }
  },

  deleteBill: async (id) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/bill/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Error deleting bill");
        return;
      }
      if (response.status === 200) {
        const data = await response.json();
        toast.success(data.message || "Bill deleted successfully");
        return true;
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.error("Error deleting bill:", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useBillFeeStore;
