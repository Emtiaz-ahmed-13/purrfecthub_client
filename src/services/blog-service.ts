import { API_BASE_URL } from '@/lib/config';

export enum BlogStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt?: string | null;
    coverImage?: string | null;
    tags: string[];
    authorId: string;
    status: BlogStatus;
    approvedBy?: string | null;
    approvedAt?: string | null;
    rejectionReason?: string | null;
    views: number;
    likes: number;
    publishedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    author: {
        id: string;
        name: string;
        avatar?: string | null;
    };
}

export interface CreateBlogPayload {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    tags?: string[];
}

export interface BlogFilters {
    status?: BlogStatus;
    authorId?: string;
    tags?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

export const blogService = {
    async getBlogs(filters?: BlogFilters) {
        const queryParams = new URLSearchParams(filters as any).toString();
        const response = await fetch(`${API_BASE_URL}/blogs?${queryParams}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }
        return response.json();
    },

    async getBlogBySlug(slug: string) {
        const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
        if (!response.ok) {
            throw new Error('Failed to fetch blog');
        }
        return response.json();
    },

    async createBlog(payload: CreateBlogPayload) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to create blog');
        }
        return response.json();
    },

    async updateBlog(id: string, payload: Partial<CreateBlogPayload>) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error('Failed to update blog');
        }
        return response.json();
    },

    async deleteBlog(id: string) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete blog');
        }
        return response.json();
    },

    async getPendingBlogs() {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/blogs/admin/pending`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch pending blogs');
        }
        return response.json();
    },

    async approveBlog(id: string) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/blogs/${id}/approve`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to approve blog');
        }
        return response.json();
    },

    async rejectBlog(id: string, rejectionReason?: string) {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/blogs/${id}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ rejectionReason }),
        });
        if (!response.ok) {
            throw new Error('Failed to reject blog');
        }
        return response.json();
    },
};
