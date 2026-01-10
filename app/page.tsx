"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Select, Badge, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  ShoppingCartOutlined,
  PhoneOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  HeartOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  prices: {
    S: number;
    M: number;
    L: number;
  };
  category: "pizza" | "softdrinks" | "sauces";
}

interface Topping {
  id: number;
  name: string;
  image: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Pepperoni Pizza",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/peperoni.png",
    prices: { S: 299, M: 499, L: 699 },
    category: "pizza",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/product _image.png",
    prices: { S: 249, M: 449, L: 649 },
    category: "pizza",
  },
  {
    id: 3,
    name: "Chicken Pizza",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/peperoni.png",
    prices: { S: 349, M: 549, L: 749 },
    category: "pizza",
  },
  {
    id: 4,
    name: "BBQ Fresh",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/product _image.png",
    prices: { S: 399, M: 599, L: 799 },
    category: "pizza",
  },
  {
    id: 5,
    name: "Veggie Delight",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/peperoni.png",
    prices: { S: 279, M: 479, L: 679 },
    category: "pizza",
  },
  {
    id: 6,
    name: "Cheese Burst",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/product _image.png",
    prices: { S: 329, M: 529, L: 729 },
    category: "pizza",
  },
  {
    id: 7,
    name: "Italian Special",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/peperoni.png",
    prices: { S: 379, M: 579, L: 779 },
    category: "pizza",
  },
  {
    id: 8,
    name: "Supreme Pizza",
    description:
      "Juicy chicken fillet and crispy bacon combined with signature tomato sauce, Mozzarella and onions",
    image: "/image/product _image.png",
    prices: { S: 419, M: 619, L: 819 },
    category: "pizza",
  },
  {
    id: 9,
    name: "Pepsi",
    description: "Chilled refreshing soft drink",
    image: "/image/pepsi.png",
    prices: { S: 40, M: 60, L: 80 },
    category: "softdrinks",
  },
  {
    id: 10,
    name: "Coca Cola",
    description: "Refreshing cola drink",
    image: "/image/drink.png",
    prices: { S: 40, M: 60, L: 80 },
    category: "softdrinks",
  },
  {
    id: 11,
    name: "Sprite",
    description: "Lemon-lime flavored soft drink",
    image: "/image/pepsi.png",
    prices: { S: 40, M: 60, L: 80 },
    category: "softdrinks",
  },
  {
    id: 12,
    name: "Fanta",
    description: "Orange flavored soft drink",
    image: "/image/drink.png",
    prices: { S: 40, M: 60, L: 80 },
    category: "softdrinks",
  },
  {
    id: 13,
    name: "Mountain Dew",
    description: "Citrus flavored soft drink",
    image: "/image/pepsi.png",
    prices: { S: 45, M: 65, L: 85 },
    category: "softdrinks",
  },
  {
    id: 14,
    name: "7UP",
    description: "Lemon-lime soft drink",
    image: "/image/drink.png",
    prices: { S: 40, M: 60, L: 80 },
    category: "softdrinks",
  },
  {
    id: 15,
    name: "Sweet Chilli Sauce",
    description: "Spicy and sweet dipping sauce",
    image: "/image/sweet_chilli.png",
    prices: { S: 30, M: 50, L: 70 },
    category: "sauces",
  },
  {
    id: 16,
    name: "Honey Mustard",
    description: "Creamy honey mustard sauce",
    image: "/image/honey_sauce.png",
    prices: { S: 30, M: 50, L: 70 },
    category: "sauces",
  },
  {
    id: 17,
    name: "BBQ Sauce",
    description: "Tangy barbecue dipping sauce",
    image: "/image/sweet_chilli.png",
    prices: { S: 35, M: 55, L: 75 },
    category: "sauces",
  },
  {
    id: 18,
    name: "Garlic Mayo",
    description: "Creamy garlic mayonnaise",
    image: "/image/honey_sauce.png",
    prices: { S: 30, M: 50, L: 70 },
    category: "sauces",
  },
];

const toppings: Topping[] = [
  {
    id: 1,
    name: "Cheddar",
    image: "/image/pizza_image.png",
    price: 70,
  },
  {
    id: 2,
    name: "Mushroom",
    image: "/image/pizza_image.png",
    price: 80,
  },
  {
    id: 3,
    name: "Chicken",
    image: "/image/pizza_image.png",
    price: 90,
  },
  {
    id: 4,
    name: "Jalapeño",
    image: "/image/pizza_image.png",
    price: 30,
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string>("pizza");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, "S" | "M" | "L">>({});
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedSize, setModalSelectedSize] = useState<"S" | "M" | "L">("L");
  const [selectedCrust, setSelectedCrust] = useState<"Thick" | "Thin">("Thick");
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-gray-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">Role: {user?.role}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

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

  const handleSizeSelect = (productId: number, size: "S" | "M" | "L") => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (_productId: number) => {
    setCartCount((prev) => prev + 1);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalSelectedSize("L");
    setSelectedCrust("Thick");
    setSelectedToppings([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedToppings([]);
  };

  const handleToggleTopping = (toppingId: number) => {
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
    const basePrice = selectedProduct.prices[modalSelectedSize];
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppings.find((t) => t.id === toppingId);
      return total + (topping?.price || 0);
    }, 0);
    return basePrice + toppingsPrice;
  };

  const filteredProducts = products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">pizza</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Select
                  defaultValue="mumbai"
                  variant="borderless"
                  style={{ width: 100 }}
                  suffixIcon={null}
                >
                  <Option value="mumbai">Mumbai</Option>
                  <Option value="delhi">Delhi</Option>
                  <Option value="bangalore">Bangalore</Option>
                </Select>
              </div>
              <a href="#menu" className="text-gray-700 hover:text-gray-900 font-medium">
                Menu
              </a>
              <a href="#orders" className="text-gray-700 hover:text-gray-900 font-medium">
                Orders
              </a>
            </nav>

            {/* Cart, Phone, User Avatar and Mobile Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Badge count={cartCount} showZero={false} color="#FF6B35">
                <ShoppingCartOutlined className="text-xl sm:text-2xl text-gray-700 cursor-pointer" />
              </Badge>
              <a
                href="tel:+919800098998"
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] transition-colors"
              >
                <PhoneOutlined />
                <span className="hidden md:inline text-sm lg:text-base">+91 9800 098 998</span>
              </a>
              {isAuthenticated ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                    <Avatar
                      style={{ backgroundColor: "#FF6B35" }}
                      icon={<UserOutlined />}
                      size="default"
                    />
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user?.role}</p>
                    </div>
                  </div>
                </Dropdown>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="hidden lg:block text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 p-2"
              >
                {mobileMenuOpen ? (
                  <CloseOutlined className="text-xl" />
                ) : (
                  <MenuOutlined className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md w-fit">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Select
                  defaultValue="mumbai"
                  variant="borderless"
                  style={{ width: 100 }}
                  suffixIcon={null}
                >
                  <Option value="mumbai">Mumbai</Option>
                  <Option value="delhi">Delhi</Option>
                  <Option value="bangalore">Bangalore</Option>
                </Select>
              </div>
              <a
                href="#menu"
                className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </a>
              <a
                href="#orders"
                className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </a>
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
                        style={{ backgroundColor: "#FF6B35" }}
                        icon={<UserOutlined />}
                        size="large"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-xs text-gray-500">Role: {user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 font-medium w-full text-left"
                  >
                    <LogoutOutlined />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium w-full text-left"
                >
                  Login
                </button>
              )}
              <a
                href="tel:+919800098998"
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#FF6B35] font-medium sm:hidden"
              >
                <PhoneOutlined />
                <span>+91 9800 098 998</span>
              </a>
            </div>
          )}
        </div>
      </header>

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
              <button className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors text-sm sm:text-base">
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
          {/* Category Tabs and Filters */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 border-b border-gray-200 pb-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelectedCategory("pizza")}
                className={`px-4 py-2 font-medium transition-colors relative whitespace-nowrap ${
                  selectedCategory === "pizza"
                    ? "text-[#FF6B35]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pizza
                {selectedCategory === "pizza" && (
                  <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedCategory("softdrinks")}
                className={`px-4 py-2 font-medium transition-colors relative whitespace-nowrap ${
                  selectedCategory === "softdrinks"
                    ? "text-[#FF6B35]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Softdrinks
                {selectedCategory === "softdrinks" && (
                  <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                )}
              </button>
              <button
                onClick={() => setSelectedCategory("sauces")}
                className={`px-4 py-2 font-medium transition-colors relative whitespace-nowrap ${
                  selectedCategory === "sauces"
                    ? "text-[#FF6B35]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Sauces
                {selectedCategory === "sauces" && (
                  <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                )}
              </button>
            </div>

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

              <Select
                defaultValue="all"
                style={{ width: 140 }}
                className="custom-select"
                size="middle"
              >
                <Option value="all">All Items</Option>
                <Option value="vegetarian">Vegetarian</Option>
                <Option value="non-vegetarian">Non Vegetarian</Option>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const selectedSize = selectedSizes[product.id] || "M";
              return (
                <div
                  key={product.id}
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

                    {/* Size Selection */}
                    <div className="flex gap-2">
                      {(["S", "M", "L"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(product.id, size)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-semibold transition-all text-sm sm:text-base ${
                            selectedSize === size
                              ? "bg-[#FF6B35] text-white"
                              : "bg-white text-gray-700 border-2 border-gray-300 hover:border-[#FF6B35]"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between pt-1 sm:pt-2">
                      <span className="text-lg sm:text-xl font-bold text-gray-900">
                        ₹{product.prices[selectedSize]}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product.id)}
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
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <Badge count={cartCount} color="#FF6B35">
            <button className="w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center">
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
                  <div className="flex gap-2">
                    {(["L", "M", "S"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalSelectedSize(size);
                        }}
                        className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                          modalSelectedSize === size
                            ? "bg-gray-200 text-gray-900"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-150"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crust Selection */}
                {selectedProduct.category === "pizza" && (
                  <div className="mb-8">
                    <div className="flex gap-2">
                      {(["Thick", "Thin"] as const).map((crust) => (
                        <button
                          key={crust}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCrust(crust);
                          }}
                          className={`px-8 py-2.5 rounded-full font-medium transition-all ${
                            selectedCrust === crust
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
                {selectedProduct.category === "pizza" && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Extra Toppings</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {toppings.map((topping) => {
                        const isSelected = selectedToppings.includes(topping.id);
                        return (
                          <button
                            key={topping.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTopping(topping.id);
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
