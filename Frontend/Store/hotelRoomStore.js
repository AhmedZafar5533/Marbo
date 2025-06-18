import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useHotelRoomStore = create((set) => ({
    hotelRooms: [],
    dashboardData: [],
    roomDetails: null,
    loading: false,

    getDashboardData: async () => {
        set({ loading: true });
        try {
            const response = await fetch(
                `${baseUrl}/hotel-rooms/get/dashboard`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                console.log(data);
                set({ dashboardData: data.rooms });
            }
            if (!response.ok) {
                const data = await response.json();
                toast.error(data.message || "Failed to get dashboard data");
                return;
            }
        } catch (error) {
            toast.error("Error getting dashboard data:", error);
            set({ dashboardData: [] });
        } finally {
            set({ loading: false });
        }
    },
    getAllRooms: async (serviceId) => {
        try {
            set({ loading: true });
            const response = await fetch(
                baseUrl + `/hotel-rooms/get/all/${serviceId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                console.log(data.rooms);
                set({ hotelRooms: data.rooms, loading: false });
                return true;
            } else if (!response.ok) {
                const data = await response.json();
                console.log(data);
                toast.error(data.message);
                set({ loading: false });
          
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    getRoomDeatils: async (roomId) => {
        try {
            set({ loading: true });
            const response = await fetch(
                baseUrl + `/hotel-rooms/get/${roomId}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.status === 200 || response.status === 304) {
                const data = await response.json();
                console.log(data.room);
                set({ roomDetails: data.room, loading: false });
                return true;
            } else if (!response.ok) {
                const data = await response.json();
                console.log(data);
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
            return false;
        } finally {
            set({ loading: false });
        }
    },

    addHotelRoom: async (data) => {
        try {
            set({ loading: true });
            const response = await fetch(baseUrl + "/hotel-rooms/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);

                return true;
            } else if (!response.ok) {
                const data = await response.json();
                console.log(data);
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));
