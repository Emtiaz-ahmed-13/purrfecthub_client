import { API_BASE_URL } from '@/lib/config';

export interface Review {
    id: string;
    rating: number;
    text: string;
    reviewerId: string;
    adoptionId?: string | null;
    shelterId?: string | null;
    catName?: string | null;
    isApproved: boolean;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
    reviewer: {
        id: string;
        name: string;
        avatar?: string | null;
    };
    shelter?: {
        id: string;
        name: string;
    } | null;
    adoption?: {
        id: string;
        cat: {
            name: string;
            images: string[];
        };
    } | null;
}

export interface CreateReviewPayload {
    rating: number;
    text: string;
    adoptionId?: string;
    shelterId?: string;
    catName?: string;
}

export interface ReviewFilters {
    shelterId?: string;
    catName?: string;
    rating?: number;
    isApproved?: boolean;
    isVisible?: boolean;
    limit?: number;
    offset?: number;
    page?: number;
}

export interface ReviewStats {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

export const reviewService = {
    async getReviews(filters?: ReviewFilters) {
        const queryParams = new URLSearchParams(filters as any).toString();
        const response = await fetch(`${API_BASE_URL}/reviews?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch reviews');
        }
        return response.json();
    },

    async getReviewById(id: string) {
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch review');
        }
        return response.json();
    },

    async createReview(payload: CreateReviewPayload) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create review' }));
            throw new Error(error.message || 'Failed to create review');
        }
        return response.json();
    },

    async updateReview(id: string, payload: Partial<CreateReviewPayload>) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to update review');
        }
        return response.json();
    },

    async deleteReview(id: string) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete review');
        }
        return response.json();
    },

    async getReviewStats(shelterId?: string) {
        const queryParams = shelterId ? `?shelterId=${shelterId}` : '';
        const response = await fetch(`${API_BASE_URL}/reviews/stats${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch review stats');
        }
        return response.json();
    },
};
