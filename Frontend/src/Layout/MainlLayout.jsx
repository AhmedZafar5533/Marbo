import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/footer";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useReviewStore } from "../../Store/reviewsStore";
import ReviewsModal from "../components/Modals/ReviewsModal";
import FloatingCart from "../components/cartButton";
import { useCartStore } from "../../Store/cartStore";
import CartModal from "../components/cartModal";

export default function MainLayout() {
  const [showButton, setShowButton] = useState(false);
  const { setisModelOpen, isModelOpen } = useReviewStore();
  const { isModalOpen: isCartModelOpen } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.pageYOffset > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {isModelOpen && <ReviewsModal />}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed cursor-pointer bottom-6 left-6 bg-[#FD1A03] text-white px-3 py-3 rounded-full shadow-lg hover:bg-[#fd0303d7] transition z-[90]"
        >
          <ChevronUp size={24} />
        </button>
      )}
      {isCartModelOpen && <CartModal />}

      <FloatingCart></FloatingCart>
    </>
  );
}
