import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/footer";
import { ChevronUp } from "lucide-react";
import { useState, useEffect, lazy, Suspense } from "react";
import { useReviewStore } from "../../Store/reviewsStore";
import { useCartStore } from "../../Store/cartStore";
import CookieBanner from "../components/cookieConsent";

const ReviewsModal = lazy(() => import("../components/Modals/ReviewsModal"));
const FloatingCart = lazy(() => import("../components/cartButton"));
const CartModal = lazy(() => import("../components/cartModal"));

export default function MainLayout() {
  const [showButton, setShowButton] = useState(false);
  const { isModelOpen } = useReviewStore();
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

  const pathname = window.location.pathname;

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      {pathname !== "/checkout" && (
        <Suspense fallback={null}>
          {isModelOpen && <ReviewsModal />}
          {isCartModelOpen && <CartModal />}
          <FloatingCart />
        </Suspense>
      )}

      {/* Scroll to Top Button */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed cursor-pointer bottom-6 left-6 bg-[#FD1A03] text-white px-3 py-3 rounded-full shadow-lg hover:bg-[#fd0303d7] transition z-[90]"
        >
          <ChevronUp size={24} />
        </button>
      )}
      <CookieBanner />
    </>
  );
}
