"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input, message, Modal, Checkbox } from "antd";
import { CheckCircleFilled, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Navbar from "@/components/layout/Navbar";
import { billingService } from "@/services/billing.service";
import type { Customer } from "@/types/billing.types";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
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
      } catch (error) {
        console.error("Error fetching customer data:", error);
        message.error("Failed to load customer information");
      } finally {
        setCustomerLoading(false);
      }
    };

    fetchCustomerData();
  }, [isAuthenticated, loading, user]);

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

  const handleDeleteAddress = async (addressId: string) => {
    if (!customer) return;

    try {
      const response = await billingService.deleteAddress(customer._id, addressId);
      setCustomer(response.customer);
      if (selectedAddressId === addressId) {
        setSelectedAddressId("");
      }
      message.success("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      message.error("Failed to delete address");
    }
  };

  const subtotal = 4000;
  const taxes = 200;
  const deliveryCharges = 0;
  const total = subtotal + taxes + deliveryCharges;

  const handleCheckout = async () => {
    setCheckoutLoading(true);

    try {
      // Customer already exists from page load, use the stored customer data
      if (!customer) {
        message.error("Customer information not available");
        return;
      }

      message.success("Processing checkout...");

      // Step 2: TODO - Create order with customer info
      // For now, just redirect to orders page
      router.push("/orders");
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      if (error instanceof Error) {
        message.error(error.message || "Failed to process checkout");
      } else {
        message.error("Failed to process checkout");
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
      <Navbar cartCount={4} />

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
                {customer?.address.map((address) => (
                  <div
                    key={address._id}
                    onClick={() => setSelectedAddressId(address._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                      selectedAddressId === address._id
                        ? "border-[#FF6B35] bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selectedAddressId === address._id && (
                      <CheckCircleFilled className="absolute top-3 right-3 text-[#FF6B35] text-xl" />
                    )}
                    {address.isDefault && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded mb-2 inline-block">
                        Default
                      </span>
                    )}
                    <p className="text-sm text-gray-700 mb-3">{address.text}</p>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() =>
                          handleEditAddress(address._id, address.text, address.isDefault)
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <EditOutlined /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <DeleteOutlined /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Address Button */}
                <button
                  onClick={handleAddAddress}
                  className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FF6B35] transition-colors flex flex-col items-center justify-center gap-2 min-h-30"
                >
                  <PlusOutlined className="text-2xl text-gray-400" />
                  <span className="text-gray-600 font-medium">Add address</span>
                </button>
              </div>
            </div>

            {/* Restaurant Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant</h2>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900">Pizzarea</h3>
                <p className="text-sm text-gray-600">Shopping mall,</p>
                <p className="text-sm text-gray-600">2nd floor</p>
              </div>
            </div>

            {/* Payment Type Section */}
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
                  <span>Taxes</span>
                  <span className="font-semibold">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery charges</span>
                  <span className="font-semibold">₹{deliveryCharges}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Order total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <button className="px-6 bg-[#FF6B35] hover:bg-[#FF5520] text-white border-none rounded-lg transition-colors font-medium">
                  Apply
                </button>
              </div>

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
        title={editingAddressId ? "Edit Address" : "Add Address"}
        open={showAddressModal}
        onOk={handleSaveAddress}
        onCancel={() => {
          setShowAddressModal(false);
          setAddressText("");
          setIsDefaultAddress(false);
          setEditingAddressId(null);
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <Input.TextArea
              placeholder="Enter full address (e.g., 123 Main Street, City, State, ZIP)"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Checkbox
              checked={isDefaultAddress}
              onChange={(e) => setIsDefaultAddress(e.target.checked)}
            >
              Set as default address
            </Checkbox>
          </div>
        </div>
      </Modal>
    </div>
  );
}
