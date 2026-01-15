import { API_BASE_URL } from "@/lib/config";

export interface AIChatRequest {
    message: string;
}

export interface AIChatResponse {
    success: boolean;
    data: string;
    message?: string;
}

export const AIChatService = {
    /**
     * Send a message to the AI and get a response
     * @param message - The user's message to send to the AI
     * @returns Promise with the AI's response
     */
    async chatWithAI(message: string): Promise<AIChatResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/ai/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to get AI response");
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("AI Chat Error:", error);
            throw new Error(error.message || "Failed to connect to AI service");
        }
    },
};
