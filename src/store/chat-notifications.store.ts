import { create } from "zustand";

type ChatNotificationsState = {
  hasUnreadMessages: boolean;
  setHasUnreadMessages: (value: boolean) => void;
};

export const useChatNotificationsStore = create<ChatNotificationsState>((set) => ({
  hasUnreadMessages: false,
  setHasUnreadMessages: (value) => set({ hasUnreadMessages: value }),
}));