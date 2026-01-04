import { API_BASE_URL } from "@/lib/config";
import { CreateMedicalRecordData, MedicalRecord } from "@/models/types";

export const MedicalRecordService = {
    async getCatRecords(catId: string): Promise<{ data: MedicalRecord[] }> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/medical/cats/${catId}/records`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch medical records");
        return response.json();
    },

    async createRecord(catId: string, data: CreateMedicalRecordData): Promise<{ data: MedicalRecord }> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/medical/cats/${catId}/records`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create medical record");
        return response.json();
    },

    async updateRecord(id: string, data: Partial<CreateMedicalRecordData>): Promise<{ data: MedicalRecord }> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/medical/records/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update medical record");
        return response.json();
    },

    async deleteRecord(id: string): Promise<void> {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/medical/records/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to delete medical record");
    }
};
