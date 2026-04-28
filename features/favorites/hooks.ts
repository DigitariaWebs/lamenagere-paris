import { useFavoritesStore } from "./store";

export const useFavorites = () => {
  const favorites = useFavoritesStore((s) => s.favorites);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const isFavorited = useFavoritesStore((s) => s.isFavorited);
  const clear = useFavoritesStore((s) => s.clear);

  return { favorites, toggleFavorite, isFavorited, clear };
};
