import { API_BASE_URL } from "@/lib/config";
import { User } from "@/models/types";

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    homeType?: string;
    hasOtherPets?: boolean;
    otherPetsInfo?: string;
    experience?: string;
    aboutMe?: string;
}

export interface UserResponse {
    success: boolean;
    data?: {
        user: User;
    };
    user?: User;
    message?: string;
}

export interface UsersListResponse {
    success: boolean;
    data: User[];
    message?: string;
}

export const UserService = {
    /**
     * Get the current user's profile
     * @returns Promise with the user's profile data
     */
    async getMyProfile(): Promise<UserResponse> {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Unauthorized - Please login again");
            }
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch profile");
        }

        return response.json();
    },

    /**
     * Update the current user's profile
     * @param data - The profile data to update
     * @returns Promise with the updated user data
     */
    async updateMyProfile(data: UpdateProfileData): Promise<UserResponse> {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/users/me`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update profile");
        }

        return response.json();
    },

    // ==================== ADMIN METHODS ====================

    /**
     * Get all users (Admin only)
     * @returns Promise with list of all users
     */
    async getAllUsers(): Promise<UsersListResponse> {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch users");
        }

        return response.json();
    },

    /**
     * Get a user by ID (Admin only)
     * @param userId - The ID of the user to fetch
     * @returns Promise with the user data
     */
    async getUserById(userId: string): Promise<UserResponse> {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch user");
        }

        return response.json();
    },

    /**
     * Update a user's status (Admin only)
     * @param userId - The ID of the user to update
     * @param status - The new status (ACTIVE, INACTIVE, SUSPENDED)
     * @returns Promise with the updated user data
     */
    async updateUserStatus(userId: string, status: string): Promise<UserResponse> {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update user status");
        }

        return response.json();
    },

    /**
     * Delete a user (Admin only)
     * @param userId - The ID of the user to delete
     * @returns Promise with success response
     */
    async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete user");
        }

        return response.json();
    },
};
