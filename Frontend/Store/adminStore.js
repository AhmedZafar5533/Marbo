import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = "http://localhost:3000/api";

export const useAdminStore = create((set, get) => ({
    pendingVendors: [],
    vendorData: null,
    loading: false,
    success: false,
    approvedVendors: [],

    getApprovedVendors: async () => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/admin/approved-vendors", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 200) {
                const extractedVendorsData = data.vendors.map((vendor) => ({
                    id: vendor._id,
                    businessName: vendor.businessDetails.businessName,

                    category: vendor.businessDetails.businessIndustry,
                    businessRevenue: 5600,
                    joinDate: new Date(vendor.createdAt)
                        .toISOString()
                        .split("T")[0],
                }));

                set({ approvedVendors: [...extractedVendorsData] });
            } else if (!response.ok) {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch pending vendors");
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
    getPendingVendors: async () => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/admin/pending-vendors", {
                method: "GET",
                credentials: "include",
            });
            const data = await response.json();
            if (response.status === 200) {
                const extractedVendorsData = data.vendors.map((vendor) => ({
                    id: vendor._id,
                    businessName: vendor.businessDetails.businessName,
                    email: vendor.businessContact.businessEmail,
                    businessType: vendor.businessDetails.businessType,
                    applicationDate: new Date(vendor.createdAt)
                        .toISOString()
                        .split("T")[0],
                    status: vendor.status,
                    phone: vendor.businessContact.businessPhone,
                }));

                set({ pendingVendors: [...extractedVendorsData] });
            } else if (!response.ok) {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch pending vendors");
            console.log(error);
        } finally {
            set({ loading: false });
        }
    },
    getVendorDetails: async (id) => {
        try {
            set({ loading: true });
            const response = await fetch(
                baseUrl + `/admin/vendor-details/${id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await response.json();

            if (response.ok) set({ vendorData: data.vendor });
            if (response.status === 304) set({ vendor: data.vendorData });

            if (!response.ok) toast.error(data.message);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
    setVendorApproval: async ({ status, vendorId }) => {
        try {
            set({ loading: true });
            const response = await fetch(
                baseUrl + `/admin/change-vendor-status/${vendorId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status, vendorId }),
                    credentials: "include",
                }
            );
            const data = await response.json();
            if (response.ok) {
                set({ vendorData: data.vendor, success: true });

                toast.success(data.message);
            }
            if (!response.ok) toast.error(data.message);
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
}));
