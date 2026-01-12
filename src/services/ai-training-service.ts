import { API_BASE_URL } from "@/lib/config";

export interface AITrainingSuggestion {
    content: string;
    language: "bn" | "en" | "mixed";
    intent: "general" | "care" | "adoption" | "health";
    createdBy?: string;
}

export interface AITrainingSuggestionResponse {
    id: string;
    content: string;
    language: string;
    intent: string;
    createdBy?: string;
    createdAt: string;
}

class AITrainingService {
    async submitSuggestion(data: AITrainingSuggestion): Promise<AITrainingSuggestionResponse> {
        const response = await fetch(`${API_BASE_URL}/ai-training/suggest`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to submit suggestion");
        }

        const result = await response.json();
        return result.data;
    }

    async getAllSuggestions(): Promise<AITrainingSuggestionResponse[]> {
        const response = await fetch(`${API_BASE_URL}/ai-training/suggestions`);

        if (!response.ok) {
            throw new Error("Failed to fetch suggestions");
        }

        const result = await response.json();
        return result.data;
    }
}

export default new AITrainingService();
