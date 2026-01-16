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

        // Validate token exists and is not malformed
        if (!token || token === "undefined" || token === "null") {
            console.warn("No valid token found");
            return null;
        }

        // Basic JWT format check (should have 3 parts separated by dots)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.warn("Malformed token detected, clearing...");
            localStorage.removeItem("accessToken");
            return null;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/shelters/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                if (response.status === 401) {
                    // Token is invalid, clear it
                    console.warn("Invalid token, clearing...");
                    localStorage.removeItem("accessToken");
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
        } catch (error: any) {
            // If it's a JWT error, clear the token
            if (error.message && error.message.includes("jwt")) {
                console.warn("JWT error, clearing token...");
                localStorage.removeItem("accessToken");
                return null;
            }
            throw error;
        }
    },

    async getShelters() {
        const response = await fetch(`${API_BASE_URL}/shelters`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch shelters");
        }
        return response.json();
    },

    async getShelterById(id: string) {
        const response = await fetch(`${API_BASE_URL}/shelters/${id}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch shelter details");
        }
        const result = await response.json();
        return result.data || result;
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
    },

    async updateProfile(data: Partial<CreateShelterData>, logo?: File) {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        if (logo) {
            formData.append("logo", logo);
        }

        const response = await fetch(`${API_BASE_URL}/shelters/profile`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update shelter profile");
        }

        const result = await response.json();
        return result.data || result;
    }
};
