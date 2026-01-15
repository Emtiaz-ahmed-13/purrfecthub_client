import { API_BASE_URL } from "@/lib/config";
import { Cat } from "@/models/types";

// Helper to transform backend cat response to frontend Cat type
const transformCatResponse = (backendCat: any): Cat => {
    // Ensure we have images array
    const images = backendCat.images || [];

    return {
        ...backendCat,
        images: images,
        // Set imageUrl as first image for backward compatibility
        imageUrl: images[0] || undefined,
        // Set location from shelter city if available
        location: backendCat.shelter?.city || backendCat.location || 'Unknown',
    };
};

export interface CreateCatData {
    name: string;
    breed: string;
    age: number;
    gender: string;
    color?: string;
    weight?: number;
    description?: string;
    isVaccinated?: boolean;
    isNeutered?: boolean;
    specialNeeds?: string;
}

export const CatService = {
    async createCat(data: CreateCatData, images: File[]) {
        const token = localStorage.getItem("accessToken");
        const formData = new FormData();

        formData.append("data", JSON.stringify(data));
        images.forEach((image) => {
            formData.append("images", image);
        });
        const response = await fetch(`${API_BASE_URL}/cats`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create cat");
        }

        const responseData = await response.json();
        return {
            ...responseData,
            data: responseData.data ? transformCatResponse(responseData.data) : responseData.data
        };
    },

    async updateCat(id: string, data: Partial<Cat>) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/cats/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update cat");
        }

        const responseData = await response.json();
        return {
            ...responseData,
            data: responseData.data ? transformCatResponse(responseData.data) : responseData.data
        };
    },

    async deleteCat(id: string) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/cats/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete cat");
        }

        return response.json();
    },

    async getMyCats(page = 1, limit = 10) {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/cats/shelter/my-cats?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch my cats");
        }

        const responseData = await response.json();

        // Backend returns an array directly in the data field
        const catsArray = Array.isArray(responseData.data) ? responseData.data : [];
        const transformedCats = catsArray.map(transformCatResponse);

        return {
            ...responseData,
            data: {
                cats: transformedCats,
                meta: responseData.meta
            }
        };
    },

    async getCat(id: string) {
        const response = await fetch(`${API_BASE_URL}/cats/${id}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch cat");
        }
        const responseData = await response.json();
        return {
            ...responseData,
            data: responseData.data ? transformCatResponse(responseData.data) : responseData.data
        };
    },

    async getCats(filters: any = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/cats?${queryParams}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch cats");
        }
        const responseData = await response.json();


        const catsData = responseData.data || [];

        const transformedCats = Array.isArray(catsData) ? catsData.map(transformCatResponse) : [];

        return {
            ...responseData,
            data: transformedCats
        };
    },
};
