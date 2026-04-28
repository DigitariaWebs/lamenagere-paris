import React from "react";
import { View } from "react-native";
import type { Product } from "../../lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <View className="flex-row flex-wrap gap-x-4 gap-y-8 px-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant="grid" />
      ))}
    </View>
  );
}
