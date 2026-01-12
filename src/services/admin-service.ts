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

    // Get all cats (for admin)
    async getAllCats() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/cats`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch cats");
        return response.json();
    },

    // Get all shelters (for admin)
    async getAllShelters() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelters`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to fetch shelters");
        return response.json();
    },

    // Verify shelter (admin only)
    async verifyShelter(shelterId: string, isVerified: boolean) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelters/${shelterId}/verify`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ isVerified }),
        });
        if (!response.ok) throw new Error("Failed to verify shelter");
        return response.json();
    },

    // Moderate content example
    async deleteContent(type: 'cat' | 'user', id: string) {
        const token = localStorage.getItem("accessToken");
        const endpoint = type === 'cat' ? `/cats/${id}` : `/users/${id}`;
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error("Failed to delete content");
        return response.json();
    }
};
