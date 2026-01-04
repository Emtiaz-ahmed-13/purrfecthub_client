import { API_BASE_URL } from "@/lib/config";

export const ChatService = {
    async getConversations() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch conversations");
        return response.json();
    },

    async createConversation(participantId: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/chat/conversations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ participantId }),
        });
        if (!response.ok) throw new Error("Failed to create conversation");
        return response.json();
    },

    async getMessages(conversationId: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch messages");
        return response.json();
    },

    async sendMessage(conversationId: string, content: string) {
       
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/chat/conversations/${conversationId}/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error("Failed to send message");
        return response.json();
    },

    async getUnreadCount() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/chat/unread-count`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            // Fail silently or return 0, as this might be a new endpoint
            return { count: 0 };
        }
        return response.json();
    }
};
