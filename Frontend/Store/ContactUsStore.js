import { create } from "zustand";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

export const useContactUsStore = create((set, get) => ({
  success: false,
  messages: [],
  loading: false,
  sendContactUsData: async (data) => {
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + "/contact-us/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (response.status === 201) {
        const data = await response.json();
        toast.success(data.message);
        set({ success: true });
        return true;
      } else {
        const data = await response.json();
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(
        "An error occurred while sending your message. Please try again."
      );
      return false;
    }
  },

  getAllMessages: async () => {
    try {
      set({ loading: true });
      const response = await fetch(baseUrl + "/contact-us/get/all", {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log("Fetched messages:", data);
        const dataToset = { ...data.data, replied: true };
        set({ messages: data.data });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to fetch contacts");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("An error occurred while fetching contacts.");
    } finally {
      set({ loading: false });
    }
  },

  replyMessage: async (messageId, reply) => {
    try {
      set({ loading: true });
      const response = await fetch(`${baseUrl}/contact-us/reply/${messageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply }),
        credentials: "include",
      });

      if (response.status === 200) {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId
              ? { ...msg, reply, replied: true, repliedAt: new Date() }
              : msg
          ),
        }));

        toast.success("Message replied successfully.");
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to reply to message");
        return false;
      }
    } catch (error) {
      console.error("Error replying to message:", error);
      toast.error("An error occurred while replying to the message.");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteMessage: async (messageId) => {
    try {
      set({ loading: true });
      const response = await fetch(
        `${baseUrl}/contact-us/delete/${messageId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.status === 200) {
        toast.success("Message deleted successfully.");
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        }));
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("An error occurred while deleting the message.");
    } finally {
      set({ loading: false });
    }
  },
}));
