import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { persistStorage } from "../../lib/persist-storage";
import { MOCK_PRODUCTS } from "../../lib/mock-data";

export type HeroSlide = {
  id: string;
  kind: "image" | "video";
  src: string;
  title?: string;
  subtitle?: string;
  productId?: string;
  categoryId?: string;
};

interface FeaturedStore {
  featuredProductIds: string[];
  heroSlides: HeroSlide[];
  setFeaturedProducts: (ids: string[]) => void;
  toggleFeaturedProduct: (id: string) => void;
  reorderFeaturedProducts: (ids: string[]) => void;
  addSlide: (slide: HeroSlide) => void;
  removeSlide: (id: string) => void;
  updateSlide: (id: string, patch: Partial<HeroSlide>) => void;
  reorderSlides: (ids: string[]) => void;
}

const DEFAULT_FEATURED_IDS = MOCK_PRODUCTS.slice(0, 6).map((p) => p.id);

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    kind: "image",
    src: "cuisineLuxeIlot",
    title: "Cuisines Sur Mesure",
    subtitle: "Collection 2026",
    categoryId: "2",
  },
  {
    id: "slide-2",
    kind: "image",
    src: "chambreRoyale",
    title: "Chambres d'exception",
    subtitle: "Nouvelle collection",
    categoryId: "4",
  },
];

export const useFeaturedStore = create<FeaturedStore>()(
  persist(
    (set, get) => ({
      featuredProductIds: DEFAULT_FEATURED_IDS,
      heroSlides: DEFAULT_SLIDES,

      setFeaturedProducts: (ids) => set({ featuredProductIds: ids }),

      toggleFeaturedProduct: (id) => {
        const { featuredProductIds } = get();
        set({
          featuredProductIds: featuredProductIds.includes(id)
            ? featuredProductIds.filter((x) => x !== id)
            : [...featuredProductIds, id],
        });
      },

      reorderFeaturedProducts: (ids) => set({ featuredProductIds: ids }),

      addSlide: (slide) =>
        set((state) => ({ heroSlides: [...state.heroSlides, slide] })),

      removeSlide: (id) =>
        set((state) => ({
          heroSlides: state.heroSlides.filter((s) => s.id !== id),
        })),

      updateSlide: (id, patch) =>
        set((state) => ({
          heroSlides: state.heroSlides.map((s) =>
            s.id === id ? { ...s, ...patch } : s,
          ),
        })),

      reorderSlides: (ids) =>
        set((state) => {
          const map = new Map(state.heroSlides.map((s) => [s.id, s]));
          return {
            heroSlides: ids
              .map((id) => map.get(id))
              .filter((s): s is HeroSlide => Boolean(s)),
          };
        }),
    }),
    {
      name: "featured-storage",
      storage: createJSONStorage(() => persistStorage),
    },
  ),
);

export const useFeaturedProducts = () => {
  const ids = useFeaturedStore((s) => s.featuredProductIds);
  return MOCK_PRODUCTS.filter((p) => ids.includes(p.id));
};

export const useHeroSlides = () => useFeaturedStore((s) => s.heroSlides);
