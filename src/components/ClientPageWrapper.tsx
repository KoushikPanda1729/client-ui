"use client";

import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
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
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();

  const handleTenantChange = useCallback((tenantId: string) => {
    setSelectedTenantId(tenantId);
  }, []);

  return (
    <>
      {/* Navbar with tenant change handler - allowTenantChange only on home page */}
      <Navbar
        cartCount={cartItems.length}
        onTenantChange={handleTenantChange}
        allowTenantChange={true}
      />

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
