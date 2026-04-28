import { create } from "zustand";
import type { Conversation, Message } from "../../lib/types";

interface MessagingStore {
  conversations: Conversation[];
  unreadCount: number;
  isLoading: boolean;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setUnreadCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
}

export const useMessagingStore = create<MessagingStore>((set) => ({
  conversations: [],
  unreadCount: 0,
  isLoading: false,

  setConversations: (conversations) => {
    const unreadCount = conversations.reduce(
      (sum, c) => sum + c.unreadCount,
      0,
    );
    set({ conversations, unreadCount });
  },

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: message.content, lastMessageAt: message.createdAt }
          : c,
      ),
    })),

  setUnreadCount: (unreadCount) => set({ unreadCount }),

  setLoading: (isLoading) => set({ isLoading }),
}));
