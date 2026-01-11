"use client";

import { Product as APIProduct, Topping, Category, toppingService } from "@/services";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import Image from "next/image";
import { lazy, Suspense, useEffect, useState } from "react";
import FloatingCartButton from "@/components/layout/FloatingCartButton";

const ProductGrid = lazy(() => import("@/components/home/ProductGrid"));
const CategoryFilter = lazy(() => import("@/components/home/CategoryFilter"));
const ProductSkeleton = lazy(() => import("@/components/home/ProductSkeleton"));

interface ProductCatalogSectionProps {
  initialProducts: APIProduct[];
  initialCategories: Category[];
  initialToppings: Topping[];
}

export default function ProductCatalogSection({
  initialProducts,
  initialCategories,
  initialToppings,
}: ProductCatalogSectionProps) {
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<APIProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedSize, setModalSelectedSize] = useState<string>("medium");
  const [selectedCrust, setSelectedCrust] = useState<"Thick" | "Thin">("Thick");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const [apiToppings, setApiToppings] = useState<Topping[]>(initialToppings);
  const [toppingsLoading, setToppingsLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Fetch toppings when tenant changes
  useEffect(() => {
    const fetchToppings = async () => {
      if (!selectedTenantId) {
        setApiToppings(initialToppings);
        return;
      }

      try {
        setToppingsLoading(true);
        const response = await toppingService.getToppings(1, 50, selectedTenantId);
        setApiToppings(response.data);
      } catch (error) {
        console.error("Failed to fetch toppings:", error);
      } finally {
        setToppingsLoading(false);
      }
    };

    fetchToppings();
  }, [selectedTenantId, initialToppings]);

  const handleProductClick = (product: APIProduct) => {
    setSelectedProduct(product);
    setModalSelectedSize("medium");
    setSelectedCrust("Thick");
    setSelectedToppings([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedToppings([]);
  };

  const handleToggleTopping = (toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((id) => id !== toppingId) : [...prev, toppingId]
    );
  };

  const handleAddToCartFromModal = () => {
    setCartCount((prev) => prev + 1);
    handleCloseModal();
  };

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0;
    const basePrice = getProductPrice(selectedProduct, modalSelectedSize);
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = apiToppings.find((t) => t._id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return basePrice + toppingsPrice;
  };

  const handleCategorySelect = (categoryId: string | undefined) => {
    setSelectedCategoryId(categoryId);
  };

  const getProductPrice = (product: APIProduct, size: string = "medium") => {
    const priceConfig = product.priceConfiguration;
    if (priceConfig && priceConfig.small && priceConfig.small.availableOptions) {
      return (
        priceConfig.small.availableOptions[size] || priceConfig.small.availableOptions.medium || 0
      );
    }
    return 0;
  };

  const handleAddToCart = (_productId: string) => {
    setCartCount((prev) => prev + 1);
  };

  return (
    <>
      <section className="py-8 sm:py-12" id="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Menu</h2>

            {/* Search Input */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border-2 border-[#FF6B35] rounded-lg focus:outline-none focus:ring-0 w-64 text-sm text-gray-900 placeholder-gray-400"
                />
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF6B35]" />
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <Suspense
            fallback={
              <div className="flex gap-2 mb-6 sm:mb-8">
                <Spin size="small" />
              </div>
            }
          >
            <CategoryFilter
              selectedTenantId={selectedTenantId}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
              initialCategories={initialCategories}
            />
          </Suspense>

          {/* Product Grid */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Suspense
                    key={index}
                    fallback={<div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>}
                  >
                    <ProductSkeleton />
                  </Suspense>
                ))}
              </div>
            }
          >
            <ProductGrid
              selectedTenantId={selectedTenantId}
              selectedCategoryId={selectedCategoryId}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              getProductPrice={getProductPrice}
              initialProducts={initialProducts}
            />
          </Suspense>
        </div>
      </section>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left Side - Product Image */}
              <div className="p-12 flex items-center justify-center bg-gray-50 rounded-l-3xl">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={450}
                  height={450}
                  className="object-contain mix-blend-multiply"
                />
              </div>

              {/* Right Side - Product Details */}
              <div className="p-8 sm:p-10 flex flex-col relative">
                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <CloseOutlined className="text-2xl text-gray-600" />
                </button>

                {/* Product Name */}
                <h2 className="text-3xl font-bold text-gray-900 mb-3 pr-12">
                  {selectedProduct.name}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

                {/* Size Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Size</h3>
                  <div className="flex gap-2">
                    {selectedProduct.priceConfiguration?.small?.availableOptions &&
                      Object.keys(selectedProduct.priceConfiguration.small.availableOptions).map(
                        (size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalSelectedSize(size);
                            }}
                            className={`px-8 py-2.5 rounded-full font-medium transition-all capitalize ${
                              modalSelectedSize === size
                                ? "bg-gray-200 text-gray-900"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {size}
                          </button>
                        )
                      )}
                  </div>
                </div>

                {/* Crust Selection */}
                {selectedProduct.category?.attributes?.find((attr) => attr.name === "Crust") && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Crust</h3>
                    <div className="flex gap-2">
                      {selectedProduct.category.attributes
                        .find((attr) => attr.name === "Crust")
                        ?.availableOptions.map((crust) => (
                          <button
                            key={crust}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCrust(crust as "Thick" | "Thin");
                            }}
                            className={`px-8 py-2.5 rounded-full font-medium transition-all capitalize ${
                              selectedCrust.toLowerCase() === crust.toLowerCase()
                                ? "bg-gray-200 text-gray-900"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                            }`}
                          >
                            {crust}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Extra Toppings */}
                {apiToppings.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Extra Toppings</h3>
                    {toppingsLoading ? (
                      <div className="flex justify-center py-4">
                        <Spin />
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-3">
                        {apiToppings.map((topping) => {
                          const isSelected = selectedToppings.includes(topping._id);
                          return (
                            <button
                              key={topping._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTopping(topping._id);
                              }}
                              className={`relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center ${
                                isSelected
                                  ? "border-[#FF6B35] bg-white"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path d="M5 13l4 4L19 7"></path>
                                  </svg>
                                </div>
                              )}
                              <Image
                                src={topping.image}
                                alt={topping.name}
                                width={48}
                                height={48}
                                className="object-contain mb-2"
                              />
                              <p className="text-xs font-medium text-gray-900 text-center">
                                {topping.name}
                              </p>
                              <p className="text-xs text-gray-600">₹{topping.price}</p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <p className="text-3xl font-bold text-gray-900">₹{calculateTotalPrice()}</p>
                  <button
                    onClick={handleAddToCartFromModal}
                    className="bg-[#FF6B35] hover:bg-[#FF5520] text-white py-3 px-8 rounded-xl font-semibold transition-colors"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Cart Button (Mobile) */}
      <FloatingCartButton cartCount={cartCount} />
    </>
  );
}
