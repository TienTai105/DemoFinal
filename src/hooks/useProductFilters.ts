import { useState } from "react";

export const useProductFilters = () => {
  const [maxPrice, setMaxPrice] = useState(500);
  const [categories, setCategories] = useState<string[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const toggle = (
    value: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const resetFilters = () => {
    setMaxPrice(500);
    setCategories([]);
    setProductTypes([]);
    setSizes([]);
    setColors([]);
  };

  return {
    maxPrice,
    setMaxPrice,
    categories,
    setCategories,
    productTypes,
    setProductTypes,
    sizes,
    setSizes,
    colors,
    setColors,
    toggle,
    resetFilters,
  };
};
