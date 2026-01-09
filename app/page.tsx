"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Select, Badge } from "antd";
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

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("pizza");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, "S" | "M" | "L">>({});
  const [cartCount, setCartCount] = useState(0);

  const handleSizeSelect = (productId: number, size: "S" | "M" | "L") => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (_productId: number) => {
    setCartCount((prev) => prev + 1);
  };

  const filteredProducts = products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Location */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-2xl font-bold text-gray-900">pizza</span>
              </div>
              <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 border border-gray-300 rounded-md">
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
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-gray-700 hover:text-gray-900 font-medium">
                Menu
              </a>
              <a href="#orders" className="text-gray-700 hover:text-gray-900 font-medium">
                Orders
              </a>
              <button
                onClick={() => router.push(isAuthenticated ? "/dashboard" : "/login")}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                {isAuthenticated ? "Dashboard" : "Login"}
              </button>
            </nav>

            {/* Cart and Phone */}
            <div className="flex items-center gap-6">
              <Badge count={cartCount} showZero={false} color="#FF6B35">
                <ShoppingCartOutlined className="text-2xl text-gray-700 cursor-pointer" />
              </Badge>
              <div className="flex items-center gap-2 text-gray-700">
                <PhoneOutlined />
                <span className="hidden md:inline">+91 9800 098 998</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Get yummy pizza in <span className="text-[#FF6B35]">30 min</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                No need to pay if, order took more than 30 min
              </p>
              <button className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors">
                Order Now
                <ArrowRightOutlined />
              </button>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
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
      <section className="py-12" id="menu">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-6">
              {/* Category Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedCategory("pizza")}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    selectedCategory === "pizza"
                      ? "text-[#FF6B35]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Pizza
                  {selectedCategory === "pizza" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedCategory("softdrinks")}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    selectedCategory === "softdrinks"
                      ? "text-[#FF6B35]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Softdrinks
                  {selectedCategory === "softdrinks" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                  )}
                </button>
                <button
                  onClick={() => setSelectedCategory("sauces")}
                  className={`px-4 py-2 font-medium transition-colors relative ${
                    selectedCategory === "sauces"
                      ? "text-[#FF6B35]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sauces
                  {selectedCategory === "sauces" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]"></div>
                  )}
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <SearchOutlined className="text-xl text-gray-600" />
              </button>
            </div>

            <Select
              defaultValue="all"
              style={{ width: 200 }}
              className="custom-select"
              suffixIcon={<EnvironmentOutlined className="text-gray-400" />}
            >
              <Option value="all">All Items</Option>
              <Option value="vegetarian">Vegetarian</Option>
              <Option value="non-vegetarian">Non Vegetarian</Option>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const selectedSize = selectedSizes[product.id] || "M";
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
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
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

                    {/* Size Selection */}
                    <div className="flex gap-2">
                      {(["S", "M", "L"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(product.id, size)}
                          className={`w-10 h-10 rounded-full font-semibold transition-all ${
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
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.prices[selectedSize]}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-12 h-12 rounded-full bg-[#FF6B35] hover:bg-[#FF5520] text-white flex items-center justify-center transition-colors shadow-sm"
                      >
                        <PlusOutlined className="text-xl" />
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
