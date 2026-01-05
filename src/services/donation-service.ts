import { API_BASE_URL } from "@/lib/config";
import { Donation } from "@/models/types";

export const DonationService = {
    async initializeDonation(data: { amount: number; shelterId?: string; catId?: string }): Promise<{ clientSecret?: string; sessionId?: string; paymentUrl?: string; donation?: any }> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/donations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to initialize donation");
        const responseData = await response.json();
        return responseData.data;
    },

    async verifyPayment(sessionId: string): Promise<{ success: boolean; data: Donation }> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/donations/verify-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
        });
        if (!response.ok) throw new Error("Payment verification failed");
        return response.json();
    },

    async getMyDonations(): Promise<{ data: Donation[] }> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/donations/my-donations`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch my donations");
        return response.json();
    }
};
