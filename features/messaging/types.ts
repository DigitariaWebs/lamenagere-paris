import type { Conversation, Message } from "../../lib/types";

export interface MessagingState {
  conversations: Conversation[];
  unreadCount: number;
  isLoading: boolean;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  attachments?: string[];
}
