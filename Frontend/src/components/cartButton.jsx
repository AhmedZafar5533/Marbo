import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../Store/cartStore";
import { useEffect } from "react";

const FloatingCart = () => {
  const {
    cartQuantity,
    calculateCartQuantity,
    setIsModalOpen,
    isModalOpen,
    getCart,
    cart,
    loading,
  } = useCartStore();

  useEffect(() => {
    // Load cart data when component mounts
    getCart();
  }, [getCart]);

  useEffect(() => {
    // Recalculate quantity whenever cart changes
    calculateCartQuantity();
  }, [cart, calculateCartQuantity]);

  if (isModalOpen) return;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsModalOpen()}
        className="group relative bg-[#FD1A03] hover:bg-[#2f1d1dd7] text-white p-3 rounded-full shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-110"
        disabled={loading}
      >
        <ShoppingCart className="w-6 h-6" />
        {cartQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#FD1A03] text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
            {cartQuantity > 99 ? "99+" : cartQuantity}
          </span>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-0 bg-[#FD1A03]/80 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none">
          {cartQuantity > 0 ? `Cart (${cartQuantity})` : "View Cart"}
          {/* Tooltip arrow */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black"></div>
        </div>
      </button>
    </div>
  );
};

export default FloatingCart;
