import { API_BASE_URL } from "@/lib/config";
import { CreateShelterRequestData, ShelterRequest } from "@/models/types";

export const ShelterRequestService = {
    async createRequest(data: CreateShelterRequestData, images: File[]) {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        images.forEach((image) => {
            formData.append("images", image);
        });

        const response = await fetch(`${API_BASE_URL}/shelter-requests`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to submit request");
        }

        return response.json();
    },

    async getMyRequests(): Promise<ShelterRequest[]> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelter-requests/my-requests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch your requests");
        }

        const responseData = await response.json();
        return responseData.data;
    },

    async getShelterRequests(): Promise<ShelterRequest[]> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelter-requests/shelter-requests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch shelter requests");
        }

        const responseData = await response.json();
        return responseData.data;
    },

    async updateStatus(requestId: string, status: string, adminNotes?: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/shelter-requests/${requestId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status, adminNotes }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update request status");
        }

        return response.json();
    },
};
