import React from "react";
import { View } from "react-native";
import type { Category } from "../../lib/types";
import CategoryCard from "./CategoryCard";

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <View>
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </View>
  );
}
