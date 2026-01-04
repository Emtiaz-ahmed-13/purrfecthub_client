import { API_BASE_URL } from "@/lib/config";

export interface CreateShelterData {
    name: string;
    city: string;
    description?: string;
    phone?: string;
    address?: string;
}

export const ShelterService = {
    async getMyProfile() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelters/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            const error = await response.json();
            if (error.message && (error.message.includes("Shelter not found") || error.message.includes("Shelter profile not found"))) {
                return null;
            }
            throw new Error(error.message || "Failed to fetch shelter profile");
        }

        return response.json();
    },

    async getShelters() {
        const response = await fetch(`${API_BASE_URL}/shelters`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch shelters");
        }
        return response.json();
    },

    async createProfile(data: CreateShelterData) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelters`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create shelter profile");
        }

        return response.json();
    }
};
