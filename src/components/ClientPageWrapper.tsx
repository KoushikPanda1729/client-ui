"use client";

import { useState, useCallback } from "react";
import Navbar from "./layout/Navbar";
import ProductCatalogSection from "./home/ProductCatalogSection";
import HeroSection from "./home/HeroSection";
import { Product, Category, Topping } from "@/services";

interface ClientPageWrapperProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialToppings: Topping[];
}

export default function ClientPageWrapper({
  initialProducts,
  initialCategories,
  initialToppings,
}: ClientPageWrapperProps) {
  const [cartCount] = useState(0);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();

  const handleTenantChange = useCallback((tenantId: string) => {
    setSelectedTenantId(tenantId);
  }, []);

  return (
    <>
      {/* Navbar with tenant change handler */}
      <Navbar cartCount={cartCount} onTenantChange={handleTenantChange} />

      {/* Hero Section */}
      <HeroSection />

      {/* Product Catalog with selected tenant */}
      <ProductCatalogSection
        initialProducts={initialProducts}
        initialCategories={initialCategories}
        initialToppings={initialToppings}
        selectedTenantId={selectedTenantId}
      />
    </>
  );
}
