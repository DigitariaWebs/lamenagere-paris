import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistStorage } from "../../lib/persist-storage";

const MAX_RECENT = 8;

interface SearchStore {
  recent: string[];
  pushRecent: (query: string) => void;
  clearRecent: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      recent: [],
      pushRecent: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        const next = [trimmed, ...get().recent.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
          0,
          MAX_RECENT,
        );
        set({ recent: next });
      },
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => persistStorage),
    },
  ),
);
