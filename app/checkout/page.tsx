"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, message, Modal, Checkbox } from "antd";
import {
  CheckCircleFilled,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";
import Navbar from "@/components/layout/Navbar";
import { billingService } from "@/services/billing.service";
import { couponService } from "@/services/coupon.service";
import type { Customer, TaxItem } from "@/types/billing.types";
import type { Coupon, VerifiedCoupon } from "@/types/coupon.types";
import { WalletSection } from "@/components/wallet/WalletSection";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartSubtotal = useSelector((state: RootState) => state.cart.subtotal);
  const selectedRestaurant = useSelector((state: RootState) => state.cart.selectedRestaurant);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentType, setPaymentType] = useState<"COD" | "Online">("COD");
  const [couponCode, setCouponCode] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [customerLoading, setCustomerLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [isDefaultAddress, setIsDefaultAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [verifiedCoupon, setVerifiedCoupon] = useState<VerifiedCoupon | null>(null);
  const [verifyingCoupon, setVerifyingCoupon] = useState(false);
  const [activeTaxes, setActiveTaxes] = useState<TaxItem[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [chargesLoading, setChargesLoading] = useState(false);
  const [walletCreditsToUse, setWalletCreditsToUse] = useState<number>(0);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch customer data on page load
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!isAuthenticated || loading || !user) return;

      setCustomerLoading(true);
      try {
        const userId = user.id.toString();
        const customerResponse = await billingService.ensureCustomerExists(userId);
        setCustomer(customerResponse.customer);
        setFirstName(customerResponse.customer.firstName);
        setLastName(customerResponse.customer.lastName);
        setEmail(customerResponse.customer.email);

        // Auto-select default address, or first address if no default
        const addresses = customerResponse.customer.address;
        if (addresses.length > 0) {
          const defaultAddr = addresses.find((a) => a.isDefault);
          setSelectedAddressId(defaultAddr ? defaultAddr._id : addresses[0]._id);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        message.error("Failed to load customer information");
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchCustomerData();
  }, [isAuthenticated, loading, user]);

  // Fetch tax config and delivery charges
  useEffect(() => {
    const fetchCharges = async () => {
      if (!selectedRestaurant) return;

      setChargesLoading(true);
      try {
        const tenantId = selectedRestaurant.id.toString();

        const [taxResponse, deliveryResponse] = await Promise.all([
          billingService.getTaxConfig(tenantId),
          billingService.calculateDeliveryCharge(tenantId, cartSubtotal),
        ]);

        // Only use active taxes
        const active = taxResponse.taxConfig.taxes.filter((t) => t.isActive);
        setActiveTaxes(active);

        setDeliveryCharge(deliveryResponse.deliveryCharge);
        setIsFreeDelivery(deliveryResponse.isFreeDelivery);
      } catch (error) {
        console.error("Error fetching charges:", error);
      } finally {
        setChargesLoading(false);
      }
    };

    fetchCharges();
  }, [selectedRestaurant, cartSubtotal]);

  const handleAddAddress = () => {
    setEditingAddressId(null);
    setAddressText("");
    setIsDefaultAddress(false);
    setShowAddressModal(true);
  };

  const handleEditAddress = (addressId: string, text: string, isDefault: boolean) => {
    setEditingAddressId(addressId);
    setAddressText(text);
    setIsDefaultAddress(isDefault);
    setShowAddressModal(true);
  };

  const handleSaveAddress = async () => {
    if (!customer || !addressText.trim()) {
      message.error("Please enter an address");
      return;
    }

    try {
      if (editingAddressId) {
        // Update existing address
        const response = await billingService.updateAddress(customer._id, editingAddressId, {
          text: addressText,
          isDefault: isDefaultAddress,
        });
        setCustomer(response.customer);
        message.success("Address updated successfully");
      } else {
        // Add new address
        const response = await billingService.addAddress(customer._id, {
          text: addressText,
          isDefault: isDefaultAddress,
        });
        setCustomer(response.customer);
        message.success("Address added successfully");
      }
      setShowAddressModal(false);
      setAddressText("");
      setIsDefaultAddress(false);
      setEditingAddressId(null);
    } catch (error) {
      console.error("Error saving address:", error);
      message.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async () => {
    if (!customer || !deletingAddressId) return;

    setDeleteLoading(true);
    try {
      const response = await billingService.deleteAddress(customer._id, deletingAddressId);
      setCustomer(response.customer);
      if (selectedAddressId === deletingAddressId) {
        setSelectedAddressId("");
      }
      message.success("Address deleted successfully");
      setDeletingAddressId(null);
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Failed to delete address");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewCoupons = async () => {
    if (!selectedRestaurant) {
      message.error("Please select a restaurant first");
      return;
    }

    setShowCouponModal(true);
    setCouponsLoading(true);

    try {
      const response = await couponService.getCoupons(1, 10, selectedRestaurant.id);
      setCoupons(response.data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      message.error("Failed to load coupons");
    } finally {
      setCouponsLoading(false);
    }
  };

  const handleApplyCoupon = async (couponCode: string) => {
    if (!selectedRestaurant) {
      message.error("Please select a restaurant first");
      return;
    }

    setVerifyingCoupon(true);
    try {
      const response = await couponService.verifyCoupon({
        code: couponCode,
        tenantId: selectedRestaurant.id.toString(),
      });

      setVerifiedCoupon(response.coupon);
      setCouponCode(couponCode);
      setShowCouponModal(false);
      message.success(response.message);
    } catch (error: any) {
      console.error("Error verifying coupon:", error);
      message.error(error?.response?.data?.message || "Invalid coupon code");
      setVerifiedCoupon(null);
    } finally {
      setVerifyingCoupon(false);
    }
  };

  const subtotal = cartSubtotal;
  const discountPercent = verifiedCoupon?.discount || 0;
  const discountAmount = Math.round(((subtotal * discountPercent) / 100) * 100) / 100;
  const taxableAmount = subtotal - discountAmount;
  const totalTaxRate = activeTaxes.reduce((sum, t) => sum + t.rate, 0);
  const taxes = Math.round(taxableAmount * (totalTaxRate / 100) * 100) / 100;
  const totalBeforeWallet = Math.round((taxableAmount + taxes + deliveryCharge) * 100) / 100;
  const finalTotal = Math.max(0, Math.round((totalBeforeWallet - walletCreditsToUse) * 100) / 100);

  const handleCheckout = async () => {
    if (!customer) {
      message.error("Customer information not available");
      return;
    }

    if (!selectedAddressId) {
      message.error("Please select a delivery address");
      return;
    }

    if (cartItems.length === 0) {
      message.error("Your cart is empty");
      return;
    }

    if (!selectedRestaurant) {
      message.error("Please select a restaurant");
      return;
    }

    const selectedAddress = customer.address.find((a) => a._id === selectedAddressId);
    if (!selectedAddress) {
      message.error("Selected address not found");
      return;
    }

    setCheckoutLoading(true);

    try {
      // Map cart items to order items format
      const orderItems = cartItems.map((item) => ({
        _id: item.productId.toString(),
        name: item.name,
        image: item.image,
        qty: item.quantity,
        priceConfiguration: {
          small: item.size === "S" ? "small" : item.size === "M" ? "medium" : "large",
        },
        toppings: (item.toppings || []).map((t) => ({
          _id: t.id.toString(),
          name: t.name,
          image: t.image,
          price: t.price,
        })),
        totalPrice: item.price * item.quantity,
      }));

      const paymentMode = paymentType === "COD" ? "cash" : "card";

      const orderPayload: import("@/types/billing.types").CreateOrderPayload = {
        address: selectedAddress.text,
        items: orderItems,
        total: totalBeforeWallet,
        finalTotal: finalTotal, // Amount after wallet credit deduction
        paymentMode,
        tenantId: selectedRestaurant.id.toString(),
        ...(verifiedCoupon ? { couponCode: couponCode, discount: discountAmount } : {}),
        ...(walletCreditsToUse > 0 ? { walletCredits: walletCreditsToUse } : {}),
        taxTotal: taxes,
        deliveryCharge: deliveryCharge,
      };

      const orderResponse = await billingService.createOrder(orderPayload, user!.id.toString());

      // If wallet covers the full amount, skip payment gateway
      if (finalTotal === 0) {
        message.success("Order placed successfully using wallet credits!");
        dispatch(clearCart());
        router.push("/orders");
        return;
      }

      // If payment type is Online, initiate payment and redirect to Stripe
      if (paymentType === "Online") {
        const paymentIdempotencyKey = `payment-${orderResponse.order._id}-${crypto.randomUUID()}`;
        const paymentResponse = await billingService.initiatePayment(
          {
            orderId: orderResponse.order._id,
            currency: "INR",
          },
          paymentIdempotencyKey
        );

        // Redirect to Stripe checkout
        window.location.href = paymentResponse.payment.paymentUrl;
        return;
      }

      // For COD, show success and redirect to orders
      message.success("Order placed successfully!");
      dispatch(clearCart());
      router.push("/orders");
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      if (error instanceof Error) {
        message.error(error.message || "Failed to place order");
      } else {
        message.error("Failed to place order");
      }
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Show loading or nothing while checking authentication
  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Navbar cartCount={cartItems.length} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address, Restaurant, Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Details</h2>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                {customerLoading ? (
                  <div className="text-gray-500">Loading customer information...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customer?.address.map((address) => {
                  const isSelected = selectedAddressId === address._id;
                  return (
                    <div
                      key={address._id}
                      onClick={() => setSelectedAddressId(address._id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all relative ${
                        isSelected
                          ? "border-[#FF6B35] bg-orange-50 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? "bg-[#FF6B35] text-white" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <EnvironmentOutlined className="text-base" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {address.isDefault && (
                              <span className="text-[10px] font-semibold uppercase bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                Default
                              </span>
                            )}
                            {isSelected && <CheckCircleFilled className="text-[#FF6B35] ml-auto" />}
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed mb-3">
                            {address.text}
                          </p>
                          <div
                            className="flex gap-3 border-t border-gray-100 pt-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() =>
                                handleEditAddress(address._id, address.text, address.isDefault)
                              }
                              className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"
                            >
                              <EditOutlined /> Edit
                            </button>
                            <button
                              onClick={() => setDeletingAddressId(address._id)}
                              className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                            >
                              <DeleteOutlined /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add Address Button */}
                <button
                  onClick={handleAddAddress}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#FF6B35] hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <PlusOutlined className="text-lg text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Add new address</span>
                </button>
              </div>
            </div>

            {/* Restaurant Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant</h2>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                {selectedRestaurant ? (
                  <>
                    <h3 className="font-semibold text-gray-900">{selectedRestaurant.name}</h3>
                    <p className="text-sm text-gray-600">{selectedRestaurant.location}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No restaurant selected</p>
                )}
              </div>
            </div>

            {/* Payment Type Section - hidden when wallet covers full amount */}
            {finalTotal > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentType("COD")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                      paymentType === "COD"
                        ? "border-[#FF6B35] bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {paymentType === "COD" && (
                      <CheckCircleFilled className="absolute top-3 right-3 text-[#FF6B35] text-xl" />
                    )}
                    <p className="font-semibold text-gray-900">COD</p>
                  </div>
                  <div
                    onClick={() => setPaymentType("Online")}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentType === "Online"
                        ? "border-[#FF6B35] bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900">Online</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>
                    Taxes
                    {activeTaxes.length > 0 &&
                      ` (${activeTaxes.map((t) => `${t.name} ${t.rate}%`).join(" + ")})`}
                  </span>
                  <span className="font-semibold">{chargesLoading ? "..." : `₹${taxes}`}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery charges</span>
                  <span className={`font-semibold ${isFreeDelivery ? "text-green-600" : ""}`}>
                    {chargesLoading ? "..." : isFreeDelivery ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                {verifiedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Discount ({verifiedCoupon.code} - {discountPercent}%)
                    </span>
                    <span className="font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Order total</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>

              {/* View Coupons Button */}
              <div className="mb-4">
                <button
                  onClick={handleViewCoupons}
                  className="text-[#FF6B35] hover:text-[#FF5520] font-medium text-sm underline"
                >
                  View available coupons
                </button>
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    if (verifiedCoupon) {
                      setVerifiedCoupon(null);
                    }
                  }}
                  className="flex-1"
                  disabled={verifyingCoupon}
                />
                <button
                  onClick={() => handleApplyCoupon(couponCode)}
                  disabled={!couponCode || verifyingCoupon}
                  className="px-6 bg-[#FF6B35] hover:bg-[#FF5520] text-white border-none rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifyingCoupon ? "Verifying..." : "Apply"}
                </button>
              </div>

              {/* Verified Coupon Details */}
              {verifiedCoupon && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-green-800">{verifiedCoupon.title}</p>
                      <p className="text-sm text-green-600">
                        {discountPercent}% off (₹{discountAmount} discount applied)
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setVerifiedCoupon(null);
                        setCouponCode("");
                      }}
                      className="text-green-600 hover:text-green-800 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Wallet Section */}
              {user && (
                <WalletSection
                  orderTotal={totalBeforeWallet}
                  onWalletAmountChange={(amount: number) => setWalletCreditsToUse(amount)}
                />
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-[#FF6B35] hover:bg-[#FF5520] text-white h-12 text-lg font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EnvironmentOutlined className="text-[#FF6B35]" />
            <span>{editingAddressId ? "Edit Address" : "Add New Address"}</span>
          </div>
        }
        open={showAddressModal}
        onCancel={() => {
          setShowAddressModal(false);
          setAddressText("");
          setIsDefaultAddress(false);
          setEditingAddressId(null);
        }}
        footer={
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setShowAddressModal(false);
                setAddressText("");
                setIsDefaultAddress(false);
                setEditingAddressId(null);
              }}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAddress}
              disabled={!addressText.trim()}
              className="px-5 py-2 bg-[#FF6B35] hover:bg-[#FF5520] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingAddressId ? "Update Address" : "Save Address"}
            </button>
          </div>
        }
      >
        <div className="space-y-5 py-2">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
            <Input.TextArea
              placeholder="House/Flat No., Street, Landmark, City, State, PIN Code"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              rows={4}
              className="!rounded-lg"
              showCount
              maxLength={200}
            />
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <Checkbox
              checked={isDefaultAddress}
              onChange={(e) => setIsDefaultAddress(e.target.checked)}
            >
              <span className="text-sm text-gray-700">Set as default delivery address</span>
            </Checkbox>
          </div>
        </div>
      </Modal>

      {/* Delete Address Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <DeleteOutlined />
            <span>Delete Address</span>
          </div>
        }
        open={!!deletingAddressId}
        onCancel={() => setDeletingAddressId(null)}
        footer={
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingAddressId(null)}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAddress}
              disabled={deleteLoading}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {deleteLoading ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        }
        width={420}
      >
        <div className="py-4">
          <p className="text-gray-600 mb-3">Are you sure you want to delete this address?</p>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-800">
              {customer?.address.find((a) => a._id === deletingAddressId)?.text}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-3">This action cannot be undone.</p>
        </div>
      </Modal>

      {/* Coupon Modal */}
      <Modal
        title="Available Coupons"
        open={showCouponModal}
        onCancel={() => setShowCouponModal(false)}
        footer={null}
        width={600}
      >
        {couponsLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No coupons available for this restaurant</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#FF6B35] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{coupon.code}</h3>
                    <p className="text-sm text-gray-700 font-medium">{coupon.title}</p>
                    {coupon.description && (
                      <p className="text-xs text-gray-600 mt-1">{coupon.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleApplyCoupon(coupon.code)}
                    disabled={verifyingCoupon}
                    className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF5520] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-gray-600 mt-3">
                  <span>
                    Discount:{" "}
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${coupon.discountValue}`}
                  </span>
                  {coupon.minOrderValue && <span>Min Order: ₹{coupon.minOrderValue}</span>}
                  {coupon.maxDiscountAmount && (
                    <span>Max Discount: ₹{coupon.maxDiscountAmount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
