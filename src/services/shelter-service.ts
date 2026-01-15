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

        const result = await response.json();
        // Return the data field from the response, or null if no data
        return result.data || null;
    },

    async getShelters() {
        const response = await fetch(`${API_BASE_URL}/shelters`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch shelters");
        }
        return response.json();
    },

    async createProfile(data: CreateShelterData, logo?: File) {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        if (logo) {
            formData.append("logo", logo);
        }

        const response = await fetch(`${API_BASE_URL}/shelters/profile`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create shelter profile");
        }

        const result = await response.json();
        return result.data || result;
    }
};
