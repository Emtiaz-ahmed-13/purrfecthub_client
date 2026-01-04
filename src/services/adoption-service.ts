import { API_BASE_URL } from "@/lib/config";
import { CreateApplicationData } from "@/models/types";

export const AdoptionService = {
    async submitApplication(data: CreateApplicationData) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/adoptions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to submit adoption application");
        }

        return response.json();
    },

    async getMyApplications() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/adoptions/my-applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch applications");
        }

        return response.json();
    }
};
