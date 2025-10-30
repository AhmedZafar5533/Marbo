import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  X,
  ShoppingCart,
  Eye,
  Shield,
  Calendar,
  AlertCircle,
  Droplet,
  Tag,
  Lock,
  CheckCircle,
  Star,
} from "lucide-react";
import { useCartStore } from "../../Store/cartStore";
import { useReviewStore } from "../../Store/reviewsStore";
import { useOilOfferStore } from "../../Store/OilOfferStore";
import { useParams, useNavigate } from "react-router-dom";

// Mock reviews until real backend reviews are connected
const mockReviews = [
  {
    id: 1,
    name: "John Carter",
    rating: 5,
    date: "3 days ago",
    comment:
      "Great price and super easy to redeem the voucher at the pump. Will definitely buy again!",
    avatar: "JC",
  },
  {
    id: 2,
    name: "Maria Garcia",
    rating: 5,
    date: "1 week ago",
    comment:
      "The process was seamless. Bought 200 liters and saved a lot. The app is very user-friendly.",
    avatar: "MG",
  },
];

export default function OilOfferDetailPage() {
  const [litersToBuy, setLitersToBuy] = useState("");
  const [validationError, setValidationError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const { getOffer, offerDetail, loading } = useOilOfferStore();
  const { cart, addToCart, updateCartItem } = useCartStore();
  const { setisModelOpen } = useReviewStore();

  useEffect(() => {
    if (id) {
      getOffer(id);
    }
  }, [getOffer, id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);

  const handleLitersChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setLitersToBuy(value);
      validateLiters(value, offerDetail);
    }
  };

  const validateLiters = (value, offer) => {
    if (!offer) return;
    const numValue = parseFloat(value);

    if (!value) {
      setValidationError("");
      return;
    }
    if (isNaN(numValue) || numValue <= 0) {
      setValidationError("Please enter a valid amount.");
    } else if (numValue > offer.maxLimit) {
      setValidationError(`Maximum purchase is ${offer.maxLimit} liters.`);
    } else {
      setValidationError("");
    }
  };

  const openLightbox = () => {
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  // ✅ Add a single voucher with total liters and price
  const addToCartHandler = () => {
    validateLiters(litersToBuy, offerDetail);
    if (validationError || !litersToBuy || parseFloat(litersToBuy) <= 0) return;

    const liters = parseFloat(litersToBuy);
    const totalCost = offerDetail.pricePerLiter;

    const existingItem = cart.find(
      (item) =>
        item.offerId === offerDetail._id &&
        item.typeOf === "Fuel Voucher" &&
        item.unit === "Liters"
    );

    if (existingItem) {
      // Update existing voucher (add liters & price)
      const updatedQuantity = existingItem.quantity + liters;
      const updatedPrice = updatedQuantity * offerDetail.pricePerLiter;

      updateCartItem(existingItem.offerId, {
        quantity: updatedQuantity,
        price: updatedPrice,
      });

      alert(
        `Updated your voucher for ${offerDetail.name} to ${updatedQuantity} liters.`
      );
    } else {
      // Add new single voucher
      const productToAdd = {
        name: `${offerDetail.name} - ${liters}L Voucher`,
        price: totalCost,
        productId: offerDetail._id,
        quantity: liters,
        typeOf: "Fuel Voucher",
        imageUrl: offerDetail.image?.imageUrl,
        offerId: offerDetail._id,
        serviceId: offerDetail.serviceId,
        subDetails: {
          unit: "Liters",
          voucherValidity: offerDetail.voucherValidity + " month(s)",
        },
      };

      addToCart(productToAdd);
      alert(
        `${liters} liters of ${offerDetail.name} added as a single voucher to your cart!`
      );
    }
  };

  if (loading || !offerDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading Offer Details...</p>
      </div>
    );
  }

  const reviewCount = mockReviews.length + 37;
  const totalPrice =
    litersToBuy > 0 && !validationError
      ? parseFloat(litersToBuy) * offerDetail.pricePerLiter
      : 0;

  const canPurchase = !validationError && parseFloat(litersToBuy) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Offers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div>
            <div className="relative aspect-video bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={offerDetail.image?.imageUrl}
                alt={offerDetail.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={openLightbox}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-medium flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>View Fullscreen</span>
              </button>
            </div>
          </div>

          {/* Offer Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <Tag size={14} className="mr-2" />
                {offerDetail.type || "Fuel Voucher Offer"}
              </span>
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  4.8 ({reviewCount} reviews)
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {offerDetail.name}
              </h1>
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(offerDetail.pricePerLiter)}
                <span className="text-lg text-gray-500 font-normal">
                  {" "}
                  / liter
                </span>
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {offerDetail.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <Droplet className="mx-auto text-blue-500 mb-2" size={24} />
                <p className="text-sm text-gray-600">Max Purchase</p>
                <p className="font-bold text-gray-900">
                  {offerDetail.maxLimit} Liters
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <Calendar className="mx-auto text-green-500 mb-2" size={24} />
                <p className="text-sm text-gray-600">Voucher Validity</p>
                <p className="font-bold text-gray-900">
                  {offerDetail.voucherValidity} Month(s)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount to Purchase
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={litersToBuy}
                  onChange={handleLitersChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-lg focus:ring-4 transition-all ${
                    validationError
                      ? "border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  placeholder="e.g., 50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  Liters
                </span>
              </div>
              {validationError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {validationError}
                </p>
              )}
            </div>

            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
              <span className="font-semibold text-lg text-gray-900">
                Total Price
              </span>
              <span className="font-bold text-2xl text-red-600">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={addToCartHandler}
                disabled={!canPurchase}
                className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  canPurchase
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart size={20} />
                <span>Purchase Voucher</span>
              </button>
              <button
                onClick={() => setisModelOpen(true)}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>View Reviews ({reviewCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-200 mt-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield size={20} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Verified Offer</p>
            <p className="text-xs text-gray-500 mt-1">From a trusted partner</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Instant Voucher</p>
            <p className="text-xs text-gray-500 mt-1">
              Available after purchase
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock size={20} className="text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Secure Payment</p>
            <p className="text-xs text-gray-500 mt-1">Encrypted transaction</p>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-lg transition-colors"
            onClick={closeLightbox}
          >
            <X size={24} />
          </button>
          <img
            src={offerDetail.image?.imageUrl}
            alt="Enlarged view"
            className="max-w-screen-lg max-h-screen object-contain"
          />
        </div>
      )}
    </div>
  );
}
