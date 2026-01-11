"use client";

import { useState, useEffect } from "react";
import { Spin } from "antd";
import { categoryService, Category } from "@/services";

interface CategoryFilterProps {
  selectedTenantId?: string;
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string | undefined) => void;
  initialCategories?: Category[];
}

export default function CategoryFilter({
  selectedTenantId,
  selectedCategoryId,
  onCategorySelect,
  initialCategories = [],
}: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedTenantId) return;

      try {
        setLoading(true);
        const response = await categoryService.getCategories(1, 50, selectedTenantId);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedTenantId]);

  if (loading) {
    return (
      <div className="flex gap-2 mb-6 sm:mb-8">
        <Spin size="small" />
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-6 overflow-x-auto pb-2 border-b border-gray-200">
        <button
          onClick={() => onCategorySelect(undefined)}
          className={`pb-3 font-medium transition-all whitespace-nowrap relative ${
            !selectedCategoryId ? "text-[#FF6B35]" : "text-gray-600 hover:text-[#FF6B35]"
          }`}
        >
          All
          {!selectedCategoryId && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
          )}
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategorySelect(category._id)}
            className={`pb-3 font-medium transition-all whitespace-nowrap relative ${
              selectedCategoryId === category._id
                ? "text-[#FF6B35]"
                : "text-gray-600 hover:text-[#FF6B35]"
            }`}
          >
            {category.name}
            {selectedCategoryId === category._id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
