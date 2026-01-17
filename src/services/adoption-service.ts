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
    },

    // Shelter methods
    async getShelterApplications() {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/adoptions/shelter/applications`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch shelter applications");
        }

        return response.json();
    },

    async updateApplicationStatus(applicationId: string, status: 'APPROVED' | 'REJECTED', reviewNotes?: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/adoptions/${applicationId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status, reviewNotes }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update application status");
        }

        return response.json();
    },

    async cancelApplication(applicationId: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/adoptions/${applicationId}/cancel`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to cancel application");
        }

        return response.json();
    },

    async completeAdoption(applicationId: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/adoptions/${applicationId}/complete`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "COMPLETED" }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to complete adoption");
        }

        return response.json();
    }
};
