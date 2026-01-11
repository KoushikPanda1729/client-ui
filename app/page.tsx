"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import { Select, Badge, Spin } from "antd";
import {
  PlusOutlined,
  ArrowRightOutlined,
  HeartOutlined,
  SearchOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import {
  productService,
  Product as APIProduct,
  toppingService,
  Topping,
  categoryService,
  Category,
} from "@/services";

const { Option } = Select;

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<APIProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedSize, setModalSelectedSize] = useState<string>("medium");
  const [selectedCrust, setSelectedCrust] = useState<"Thick" | "Thin">("Thick");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // API product state
  const [apiProducts, setApiProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>();

  // API topping state
  const [apiToppings, setApiToppings] = useState<Topping[]>([]);
  const [toppingsLoading, setToppingsLoading] = useState(false);

  // API category state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedTenantId) return;

      try {
        setCategoriesLoading(true);
        const response = await categoryService.getCategories(1, 50, selectedTenantId);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [selectedTenantId]);

  // Fetch toppings from API
  useEffect(() => {
    const fetchToppings = async () => {
      if (!selectedTenantId) {
        setApiToppings([]);
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
  }, [selectedTenantId]);

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

  const handleAddToCart = (_productId: string) => {
    setCartCount((prev) => prev + 1);
  };

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
    setCurrentPage(1);
  };

  // Helper function to get price from API product
  const getProductPrice = (product: APIProduct, size: string = "medium") => {
    const priceConfig = product.priceConfiguration;
    if (priceConfig && priceConfig.small && priceConfig.small.availableOptions) {
      return (
        priceConfig.small.availableOptions[size] || priceConfig.small.availableOptions.medium || 0
      );
    }
    return 0;
  };

  // Filter products by category
  const filteredProducts = apiProducts.filter((product) => {
    if (!selectedCategoryId) return true;
    return product.category._id === selectedCategoryId;
  });

  // Memoized tenant change handler to prevent infinite loops
  const handleTenantChange = useCallback((tenantId: string) => {
    // Reset all tenant-dependent state when switching tenants
    setSelectedTenantId(tenantId);
    setSelectedCategoryId(undefined);
    setApiProducts([]);
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Navbar cartCount={cartCount} onTenantChange={handleTenantChange} />

      {/* Hero Section */}
      <section className="bg-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Get yummy pizza in <span className="text-[#FF6B35]">30 min</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                No need to pay if, order took more than 30 min
              </p>
              <button
                onClick={() =>
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors text-sm sm:text-base cursor-pointer"
              >
                Order Now
                <ArrowRightOutlined />
              </button>
            </div>
            <div className="flex justify-center mt-6 lg:mt-0">
              <div className="relative w-full max-w-xs sm:max-w-md">
                <Image
                  src="/image/pizza_image.png"
                  alt="Delicious Pizza"
                  width={500}
                  height={500}
                  className="w-full h-auto mix-blend-multiply"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section className="py-8 sm:py-12" id="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Menu</h2>

            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              {/* Search Input */}
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
          <div className="mb-6 sm:mb-8">
            {categoriesLoading ? (
              <div className="flex gap-2">
                <Spin size="small" />
              </div>
            ) : (
              <div className="flex items-center gap-6 overflow-x-auto pb-2 border-b border-gray-200">
                <button
                  onClick={() => handleCategorySelect(undefined)}
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
                    onClick={() => handleCategorySelect(category._id)}
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
            )}
          </div>

          {/* Product Grid */}
          {loading && apiProducts.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const price = getProductPrice(product);
                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                      onClick={() => handleProductClick(product)}
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
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            ₹{price}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product._id);
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
          )}
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <Badge count={cartCount} color="#FF6B35">
            <button
              onClick={() => router.push("/cart")}
              className="w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center"
            >
              <ShoppingCartOutlined className="text-2xl text-white" />
            </button>
          </Badge>
        </div>
      )}

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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-12 lg:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* About Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <h3 className="text-2xl font-bold text-white">pizza</h3>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Delicious pizzas delivered to your doorstep in 30 minutes or less. Quality
                ingredients, authentic taste, and unbeatable service.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                >
                  <FacebookOutlined className="text-lg" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                >
                  <TwitterOutlined className="text-lg" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                >
                  <InstagramOutlined className="text-lg" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-gray-800 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                >
                  <YoutubeOutlined className="text-lg" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#menu" className="hover:text-[#FF6B35] transition-colors">
                    Menu
                  </a>
                </li>
                <li>
                  <a href="#orders" className="hover:text-[#FF6B35] transition-colors">
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#FF6B35] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#FF6B35] transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-[#FF6B35] transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#faq" className="hover:text-[#FF6B35] transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#shipping" className="hover:text-[#FF6B35] transition-colors">
                    Delivery Info
                  </a>
                </li>
                <li>
                  <a href="#returns" className="hover:text-[#FF6B35] transition-colors">
                    Returns Policy
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-[#FF6B35] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-[#FF6B35] transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <EnvironmentOutlined className="text-[#FF6B35] mt-1" />
                  <span className="text-sm">123 Pizza Street, Mumbai, Maharashtra 400001</span>
                </li>
                <li className="flex items-center gap-2">
                  <PhoneOutlined className="text-[#FF6B35]" />
                  <span className="text-sm">+91 9800 098 998</span>
                </li>
                <li className="flex items-center gap-2">
                  <MailOutlined className="text-[#FF6B35]" />
                  <span className="text-sm">info@pizza.com</span>
                </li>
              </ul>
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Opening Hours</p>
                <p className="text-sm">Mon - Sun: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Pizza. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#privacy" className="hover:text-[#FF6B35] transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-[#FF6B35] transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-[#FF6B35] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
