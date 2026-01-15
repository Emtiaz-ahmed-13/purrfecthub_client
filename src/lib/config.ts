// API Configuration
// Automatically switches between localhost and production based on NODE_ENV
// You can override by setting NEXT_PUBLIC_API_URL in .env

const isProduction = process.env.NODE_ENV === 'production';

// API Base URL - Auto-switch based on environment
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (isProduction
        ? 'https://purrfecthub-server-z726.vercel.app/api/v1'
        : 'http://localhost:5001/api/v1'
    );

// Socket.io URL - Auto-switch based on environment
export const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL ||
    (isProduction
        ? 'https://purrfecthub-server-z726.vercel.app'
        : 'http://localhost:5001'
    );

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
        CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    },

    // Users
    USERS: {
        ME: `${API_BASE_URL}/users/me`,
        ALL: `${API_BASE_URL}/users`,
        BY_ID: (id: string) => `${API_BASE_URL}/users/${id}`,
        UPDATE_STATUS: (id: string) => `${API_BASE_URL}/users/${id}/status`,
    },

    // Shelters
    SHELTERS: {
        ALL: `${API_BASE_URL}/shelters`,
        NEARBY: `${API_BASE_URL}/shelters/nearby`,
        ME: `${API_BASE_URL}/shelters/me`,
        BY_ID: (id: string) => `${API_BASE_URL}/shelters/${id}`,
        PROFILE: `${API_BASE_URL}/shelters/profile`,
        LOCATION: `${API_BASE_URL}/shelters/profile/location`,
        VERIFY: (id: string) => `${API_BASE_URL}/shelters/${id}/verify`,
    },

    // Cats
    CATS: {
        ALL: `${API_BASE_URL}/cats`,
        MY_CATS: `${API_BASE_URL}/cats/shelter/my-cats`,
        BY_ID: (id: string) => `${API_BASE_URL}/cats/${id}`,
        CREATE: `${API_BASE_URL}/cats`,
        UPDATE: (id: string) => `${API_BASE_URL}/cats/${id}`,
        DELETE: (id: string) => `${API_BASE_URL}/cats/${id}`,
    },

    // Adoptions
    ADOPTIONS: {
        ALL: `${API_BASE_URL}/adoptions`,
        MY_APPLICATIONS: `${API_BASE_URL}/adoptions/my-applications`,
        SHELTER_APPLICATIONS: `${API_BASE_URL}/adoptions/shelter/applications`,
        BY_ID: (id: string) => `${API_BASE_URL}/adoptions/${id}`,
        UPDATE_STATUS: (id: string) => `${API_BASE_URL}/adoptions/${id}/status`,
        REVIEW: (id: string) => `${API_BASE_URL}/adoptions/${id}/review`,
        COMPLETE: (id: string) => `${API_BASE_URL}/adoptions/${id}/complete`,
    },

    // Medical Records
    MEDICAL: {
        CAT_RECORDS: (catId: string) => `${API_BASE_URL}/medical/cats/${catId}/records`,
        RECORD_BY_ID: (id: string) => `${API_BASE_URL}/medical/records/${id}`,
        REMINDERS: `${API_BASE_URL}/medical/reminders`,
    },

    // Donations
    DONATIONS: {
        CREATE: `${API_BASE_URL}/donations`,
        VERIFY_PAYMENT: `${API_BASE_URL}/donations/verify-payment`,
        MY_DONATIONS: `${API_BASE_URL}/donations/my-donations`,
        SHELTER_DONATIONS: `${API_BASE_URL}/donations/shelter-donations`,
        STATS: `${API_BASE_URL}/donations/stats`,
    },

    // Chat
    CHAT: {
        CONVERSATIONS: `${API_BASE_URL}/chat/conversations`,
        CONVERSATION_MESSAGES: (id: string) => `${API_BASE_URL}/chat/conversations/${id}/messages`,
        SEND_MESSAGE: (id: string) => `${API_BASE_URL}/chat/conversations/${id}/messages`,
        UNREAD_COUNT: `${API_BASE_URL}/chat/unread-count`,
    },

    // AI
    AI: {
        CHAT: `${API_BASE_URL}/ai/chat`,
    },

    // AI Training
    AI_TRAINING: {
        SUGGEST: `${API_BASE_URL}/ai-training/suggest`,
        SUGGESTIONS: `${API_BASE_URL}/ai-training/suggestions`,
    },

    // Shelter Requests
    SHELTER_REQUESTS: {
        CREATE: `${API_BASE_URL}/shelter-requests`,
        MY_REQUESTS: `${API_BASE_URL}/shelter-requests/my-requests`,
        SHELTER_REQUESTS: `${API_BASE_URL}/shelter-requests/shelter-requests`,
        UPDATE_STATUS: (id: string) => `${API_BASE_URL}/shelter-requests/${id}/status`,
    },

    // Admin
    ADMIN: {
        ANALYTICS: `${API_BASE_URL}/admin/analytics`,
    },
};

// Export for debugging
export const CONFIG = {
    API_BASE_URL,
    SOCKET_URL,
    NODE_ENV: process.env.NODE_ENV,
};

