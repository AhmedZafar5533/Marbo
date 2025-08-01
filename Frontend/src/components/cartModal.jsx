import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  Heart,
  Star,
  Loader2,
} from "lucide-react";
import { useCartStore } from "../../Store/cartStore";
import { toast } from "sonner";
import { useOrderStore } from "../../Store/orderStore";
import { useNavigate } from "react-router-dom";

const CartModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loadingItems, setLoadingItems] = useState(new Set());
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const navigate = useNavigate();

  const {
    isModalOpen,
    setIsModalOpen,
    getCart,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading: isLoading,
    cartQuantity,
  } = useCartStore();

  const { addOrder } = useOrderStore();

  useEffect(() => {
    if (isModalOpen) {
      getCart();
    }
  }, [isModalOpen, getCart]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 500);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleUpdateQuantity = async (id, change) => {
    const item = cart.find((item) => item._id === id || item.productId === id);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity + change);

    // Add loading state for this item
    setLoadingItems((prev) => new Set(prev).add(id));

    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      // Remove loading state for this item
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (id) => {
    setLoadingItems((prev) => new Set(prev).add(id));

    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await clearCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const getTotalItems = () => {
    return cartQuantity;
  };

  const getItemId = (item) => {
    return item._id || item.productId || item.serviceId;
  };

  // Checkout Handler
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsProcessingCheckout(true);
    try {
      // Calculate totals
      const subtotal = getTotalPrice();
      const taxRate = 0.085; // 8.5%
      const tax = subtotal * taxRate;
      const totalPrice = subtotal + tax;
      const shipping = 0; // Free shipping

      // Prepare checkout data
      // const checkoutData = {
      //   items: cart.map((item) => ({
      //     productId: getItemId(item),
      //     name: item.name || "Unnamed Product",
      //     serviceId: item.serviceId || null,
      //     quantity: item.quantity || 0,
      //     unitPrice: item.price || 0,
      //     totalPrice: (item.price || 0) * (item.quantity || 0),
      //     imageUrl: item.imageUrl || null,
      //   })),
      //   summary: {
      //     itemCount: getTotalItems(),
      //     subtotal: parseFloat(subtotal.toFixed(2)),
      //     tax: parseFloat(tax.toFixed(2)),
      //     taxRate: taxRate,
      //     shipping: shipping,
      //     totalPrice: parseFloat(totalPrice.toFixed(2)),
      //   },
      //   timestamp: new Date().toISOString(),
      //   currency: "USD",
      // };
      navigate("/checkout");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setTimeout(() => {
        setIsProcessingCheckout(false);
      }, 3000);
    }
  };

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-red-100 rounded-full animate-spin border-t-red-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-red-500" />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Loading your cart...
        </h3>
        <p className="text-gray-500 text-sm">Please wait a moment</p>
      </div>
    </div>
  );

  // Item Loading Overlay Component
  const ItemLoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
      <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
    </div>
  );

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .loading-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-50">
        {/* Backdrop with smooth fade */}
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ease-in-out ${
            isAnimating ? "bg-opacity-60" : "bg-opacity-0"
          }`}
          onClick={() => setIsModalOpen()}
        />

        {/* Modal with slide animation */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md sm:max-w-lg bg-white shadow-2xl transform transition-all duration-500 ease-in-out flex flex-col ${
            isAnimating ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Enhanced Header with Gradient and Blur Effect */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-rose-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="relative flex items-center justify-between p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <ShoppingBag className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                  <div className="flex items-center space-x-2">
                    <p className="text-red-100 text-sm">
                      {isLoading ? "..." : getTotalItems()} items
                    </p>
                    <div className="w-1 h-1 bg-red-200 rounded-full"></div>
                    <p className="text-red-100 text-sm">
                      ${isLoading ? "..." : getTotalPrice().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
                    title="Clear cart"
                    disabled={isProcessingCheckout}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen()}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
                  disabled={isProcessingCheckout}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cart Items with Enhanced Design */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-4">
              {isLoading ? (
                <LoadingSpinner />
              ) : cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500">
                    Discover amazing products and add them to your cart
                  </p>
                </div>
              ) : (
                cart.map((item, index) => {
                  const itemId = getItemId(item);
                  return (
                    <div
                      key={itemId}
                      className={`relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200 ${
                        loadingItems.has(itemId) || isProcessingCheckout
                          ? "pointer-events-none"
                          : ""
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: isAnimating
                          ? "slideInRight 0.3s ease-out forwards"
                          : "none",
                      }}
                    >
                      {/* Loading Overlay */}
                      {loadingItems.has(itemId) && <ItemLoadingOverlay />}

                      <div className="flex space-x-4">
                        {/* Enhanced Image with Overlay */}
                        <div className="relative flex-shrink-0 group">
                          <img
                            src={item.imageUrl || "/api/placeholder/80/80"}
                            alt={item.name || "Product"}
                            className="w-20 h-20 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = "/api/placeholder/80/80";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-all duration-300"></div>
                          <button className="absolute top-2 right-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg">
                            <Heart className="w-3 h-3 text-red-500" />
                          </button>
                        </div>

                        {/* Enhanced Content */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                              {item.name || "Unnamed Product"}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <span className="text-red-600 font-bold text-lg">
                                ${(item.price || 0).toFixed(2)}
                              </span>
                              <p className="text-xs text-gray-500">per item</p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(itemId)}
                              disabled={
                                loadingItems.has(itemId) || isProcessingCheckout
                              }
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Enhanced Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 bg-gray-100 rounded-xl p-1">
                              <button
                                onClick={() => handleUpdateQuantity(itemId, -1)}
                                disabled={
                                  loadingItems.has(itemId) ||
                                  (item.quantity || 0) <= 1 ||
                                  isProcessingCheckout
                                }
                                className="w-8 h-8 rounded-lg bg-white hover:bg-red-500 text-gray-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold text-gray-900 min-w-[2rem] text-center text-sm">
                                {item.quantity || 0}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(itemId, 1)}
                                disabled={
                                  loadingItems.has(itemId) ||
                                  isProcessingCheckout
                                }
                                className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900">
                                $
                                {(
                                  (item.price || 0) * (item.quantity || 0)
                                ).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500">total</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          {!isLoading && cart.length > 0 && (
            <div className="border-t border-gray-200 bg-white">
              {/* Collapsible Order Summary */}
              <div className="p-6">
                <button
                  onClick={() => setShowOrderDetails(!showOrderDetails)}
                  className="w-full bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-all duration-300 group"
                  disabled={isProcessingCheckout}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="font-semibold text-gray-800">
                        Order Summary
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-red-600">
                        $
                        {(getTotalPrice() + getTotalPrice() * 0.085).toFixed(2)}
                      </span>
                      <div
                        className={`transform transition-transform duration-300 ${
                          showOrderDetails ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        <svg
                          className="w-5 h-5 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Expandable Details */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    showOrderDetails
                      ? "max-h-96 opacity-100 mt-4"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                    <div className="space-y-2 mb-4">
                      {cart.map((item) => (
                        <div
                          key={getItemId(item)}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-gray-600 truncate mr-2">
                            {item.name || "Unnamed Product"} ×{" "}
                            {item.quantity || 0}
                          </span>
                          <span className="font-medium">
                            $
                            {((item.price || 0) * (item.quantity || 0)).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          ${getTotalPrice().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (8.5%)</span>
                        <span className="font-medium">
                          ${(getTotalPrice() * 0.085).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="p-6 pt-0 space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={loadingItems.size > 0 || isProcessingCheckout}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {isProcessingCheckout && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    <span>
                      {isProcessingCheckout
                        ? "Processing..."
                        : loadingItems.size > 0
                        ? "Updating Cart..."
                        : "Proceed to Checkout"}
                    </span>
                  </span>
                  {!isProcessingCheckout && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                </button>

                <button
                  onClick={() => setIsModalOpen()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
                  disabled={isProcessingCheckout}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal;
