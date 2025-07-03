import type { ChatHistory, ChatSessionInfo, ChatHealth} from "@/types/chat";

export interface ChatState {
    histories: ChatHistory[];
    sessionInfo: ChatSessionInfo | null;
    health: ChatHealth | null;

    loadingHistories: boolean;
    loadingSessionInfo: boolean;
    loadingHealth: boolean;
    error: string | null;
    cacheCleared: boolean;
    loadingSend: boolean;
}