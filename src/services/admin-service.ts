import { API_BASE_URL } from "@/lib/config";

export const AdminService = {
    async getUsers() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
    },

    async updateUserStatus(userId: string, status: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error("Failed to update user status");
        return response.json();
    },

    async getAnalytics() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch analytics");
        return response.json();
    },

    // Moderate content example
    async deleteContent(type: 'cat' | 'user', id: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/admin/content/${type}/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to delete content");
        return response.json();
    }
};
