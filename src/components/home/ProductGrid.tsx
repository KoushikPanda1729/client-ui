"use client";

import { useState, useEffect } from "react";
import { Spin } from "antd";
import {
  PlusOutlined,
  HeartOutlined,
  ArrowRightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Product as APIProduct, productService } from "@/services";
import ProductSkeleton from "./ProductSkeleton";

interface ProductGridProps {
  selectedTenantId?: string;
  selectedCategoryId?: string;
  onProductClick: (product: APIProduct) => void;
  onAddToCart: (productId: string) => void;
  getProductPrice: (product: APIProduct, size?: string) => number;
}

export default function ProductGrid({
  selectedTenantId,
  selectedCategoryId,
  onProductClick,
  onAddToCart,
  getProductPrice,
}: ProductGridProps) {
  const [apiProducts, setApiProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts(currentPage, 10, selectedTenantId);
        setApiProducts(response.data);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedTenantId]);

  // Reset to page 1 when tenant or category changes
  useEffect(() => {
    setCurrentPage(1);
    setApiProducts([]);
  }, [selectedTenantId, selectedCategoryId]);

  const loadMoreProducts = async () => {
    if (loading || currentPage >= totalPages) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const response = await productService.getProducts(nextPage, 10, selectedTenantId);
      setApiProducts((prev) => [...prev, ...response.data]);
      setCurrentPage(nextPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load more products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by category
  const filteredProducts = apiProducts.filter((product) => {
    if (!selectedCategoryId) return true;
    return product.category._id === selectedCategoryId;
  });

  if (loading && apiProducts.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const price = getProductPrice(product);
          return (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              onClick={() => onProductClick(product)}
            >
              {/* Product Image with Heart Icon */}
              <div className="relative h-56 bg-gray-50 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="object-contain mix-blend-multiply"
                />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                  <HeartOutlined className="text-gray-600" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {product.description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                    {product.category.name}
                  </span>
                </div>

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <span className="text-lg sm:text-xl font-bold text-gray-900">₹{price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product._id);
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FF6B35] hover:bg-[#FF5520] text-white flex items-center justify-center transition-colors shadow-sm"
                  >
                    <PlusOutlined className="text-base sm:text-xl" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {currentPage < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreProducts}
            disabled={loading}
            className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                Loading...
              </>
            ) : (
              <>
                See More
                <ArrowRightOutlined />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
