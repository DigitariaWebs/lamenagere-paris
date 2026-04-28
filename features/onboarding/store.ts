import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistStorage } from "../../lib/persist-storage";

interface OnboardingStore {
  hasSeen: boolean;
  hydrated: boolean;
  markSeen: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasSeen: false,
      hydrated: false,
      markSeen: () => set({ hasSeen: true }),
      reset: () => set({ hasSeen: false }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => persistStorage),
      onRehydrateStorage: () => () => {
        // In development, always re-show onboarding so the first-launch flow
        // can be verified on every reload.
        if (__DEV__) {
          useOnboardingStore.setState({ hasSeen: false, hydrated: true });
        } else {
          useOnboardingStore.setState({ hydrated: true });
        }
      },
    },
  ),
);
