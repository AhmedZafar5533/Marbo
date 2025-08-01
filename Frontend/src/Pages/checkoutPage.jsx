import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Lock,
  MapPin,
  User,
  Mail,
  Phone,
  ShoppingBag,
  Truck,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useOrderStore } from "../../Store/orderStore";

const CheckoutPage = ({ onBack, onPlaceOrder }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [formData, setFormData] = useState({
    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",

    // Options
    saveInfo: false,
    sameAsBilling: true,
    newsletter: false,
  });

  const [errors, setErrors] = useState({});
  const [completedSections, setCompletedSections] = useState({
    contact: false,
    shipping: false,
    payment: false,
  });

  const { getOrders, addOrder, orders, loading } = useOrderStore();

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  // Check section completion
  useEffect(() => {
    setCompletedSections({
      contact: true, // Assuming contact info is handled elsewhere
      shipping: true, // Assuming shipping info is handled elsewhere
      payment:
        formData.cardNumber &&
        formData.expiryDate &&
        formData.cvv &&
        formData.cardholderName,
    });
  }, [formData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  console.log(orders)
  const processOrdersToCheckoutData = (orders) => {
    if (!orders || orders.length === 0) {
      return {
        items: [],
        summary: {
          itemCount: 0,
          subtotal: 0,
          tax: 0,
          taxRate: 0.085,
          shipping: 0,
          totalPrice: 0,
        },
      };
    }

    // Transform orders to checkout items format
    const items = orders.map((order, index) => ({
      id: index.toString(),
      name: order.name,
      quantity: order.quantity,
      unitPrice: order.price,
      totalPrice: order.price * order.quantity,
      imageUrl: order.imageUrl || "/api/placeholder/80/80",
    }));

    // Calculate summary
    const itemCount = orders.reduce(
      (total, order) => total + order.quantity,
      0
    );
    const subtotal = orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    );
    const taxRate = 0.085;
    const tax = subtotal * taxRate;
    const shipping = 0; // Free shipping
    const totalPrice = subtotal + tax + shipping;

    return {
      items,
      summary: {
        itemCount,
        subtotal,
        tax,
        taxRate,
        shipping,
        totalPrice,
      },
    };
  };

  // Get checkout data from orders
  const data = processOrdersToCheckoutData(orders);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateSection = (section) => {
    const newErrors = {};

    if (section === "payment") {
      if (!formData.cardNumber)
        newErrors.cardNumber = "Card number is required";
      if (!formData.expiryDate)
        newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv) newErrors.cvv = "CVV is required";
      if (!formData.cardholderName)
        newErrors.cardholderName = "Cardholder name is required";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    const isPaymentValid = validateSection("payment");

    if (!isPaymentValid) {
      return;
    }

    // Check if there are items to order
    if (!orders || orders.length === 0) {
      alert("No items in cart to place order.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        ...data,
        customerInfo: formData,
        timestamp: new Date().toISOString(),
      };
      console.log(orderData);
      addOrder(orderData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (onPlaceOrder) {
        onPlaceOrder(orderData);
      } else {
        alert("Order placed successfully!");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const OrderSummaryContent = () => (
    <div className="space-y-6">
      {/* Items */}
      <div className="space-y-4">
        {data.items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No items in cart</p>
          </div>
        ) : (
          data.items.map((item) => (
            <div key={item.id} className="flex space-x-4">
              <div className="relative flex-shrink-0">
                <img
                  src={item.imageUrl || "/api/placeholder/60/60"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                  {item.name}
                </h4>
                <p className="text-gray-500 text-sm mt-1">
                  ${item.unitPrice.toFixed(2)} each
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  ${item.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      {data.items.length > 0 && (
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({data.summary.itemCount} items)
            </span>
            <span className="font-medium">
              ${data.summary.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${data.summary.tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-red-600">
                ${data.summary.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <button
          onClick={() => setShowOrderSummary(!showOrderSummary)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-900">
              Order Summary ({data.summary.itemCount} items)
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-bold text-red-600">
              ${data.summary.totalPrice.toFixed(2)}
            </span>
            {showOrderSummary ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </button>

        {/* Mobile Order Summary Expandable */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showOrderSummary ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <OrderSummaryContent />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Form */}
          <div className="lg:col-span-7">
            <div className="space-y-8">
              {/* Payment Information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      completedSections.payment ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {completedSections.payment ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white font-bold text-sm">1</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Information
                  </h2>
                  <div className="flex items-center space-x-2 ml-auto">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Secure</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          handleInputChange("cardNumber", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="1234 5678 9012 3456"
                        disabled={isProcessing}
                      />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.expiryDate
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="MM/YY"
                        disabled={isProcessing}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.cvv ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="123"
                        disabled={isProcessing}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={formData.cardholderName}
                        onChange={(e) =>
                          handleInputChange("cardholderName", e.target.value)
                        }
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 ${
                          errors.cardholderName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                        disabled={isProcessing}
                      />
                    </div>
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.cardholderName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-25">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <ShoppingBag className="w-6 h-6 text-red-500" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>
                <OrderSummaryContent />

                {/* Place Order Button - Desktop */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={handlePlaceOrder}
                    disabled={
                      isProcessing ||
                      !completedSections.payment ||
                      data.items.length === 0
                    }
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      {isProcessing && (
                        <Loader2 className="animate-spin w-5 h-5 text-white" />
                      )}
                      <span>Place Order</span>
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-50 group-hover:opacity-80 transition-all duration-300"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order Button - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg py-4 px-6">
        <button
          onClick={handlePlaceOrder}
          disabled={
            isProcessing ||
            !completedSections.payment ||
            data.items.length === 0
          }
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            {isProcessing && (
              <Loader2 className="animate-spin w-5 h-5 text-white" />
            )}
            <span>Place Order</span>
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-50 group-hover:opacity-80 transition-all duration-300"></span>
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
