import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Share2,
  Check,
  Clock,
  MapPin,
  Star,
  Eye,
  Shield,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Calendar,
  Info,
  CheckCircle,
  XCircle,
  Users,
  Ship,
  Briefcase,
  Languages,
  MessageSquare,
  MapPinned,
} from "lucide-react";
import { useCartStore } from "../../Store/cartStore";
import { useReviewStore } from "../../Store/reviewsStore";
import { useParams } from "react-router-dom";
import { useTourStore } from "../../Store/tourStore";

// A fallback image in case no images are found in the data
const fallbackGalleryImages = [
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
];

export default function TourDetailPage() {
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [tourDetails, setTourDetails] = useState(null);

  const [quantityToBook, setQuantityToBook] = useState(1);
  const [startingDate, setStartingDate] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = useParams();
  const { getDetailsById: getTourById, details: fetchedTour } = useTourStore();
  const { addToCart } = useCartStore();
  const { setisModelOpen } = useReviewStore();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);

  useEffect(() => {
    if (id) {
      getTourById(id);
    }
  }, [getTourById, id]);

  useEffect(() => {
    if (fetchedTour) {
      setTourDetails(fetchedTour);
      if (fetchedTour.images && fetchedTour.images.length > 0) {
        setActiveImage(fetchedTour.images[0].imageUrl);
        setCurrentImageIndex(0);
      }
    }
  }, [fetchedTour]);

  const totalPrice = useMemo(() => {
    if (!tourDetails?.price) return 0;
    return tourDetails.price * quantityToBook;
  }, [tourDetails, quantityToBook]);

  const getAllImages = () => {
    if (!tourDetails?.images?.length) return fallbackGalleryImages;
    return tourDetails.images.map((img) => img.imageUrl);
  };

  const openLightbox = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const addToCartHandler = async () => {
    if (!tourDetails || !startingDate) {
      alert("Please select a starting date before booking.");
      return;
    }

    const cartItem = {
      price: totalPrice,
      serviceId: tourDetails.serviceId,
      category: tourDetails.type,
      productId: tourDetails._id,
      typeOf: "Tour",
      name: tourDetails.title,
      imageUrl: tourDetails.images[0]?.imageUrl || "",
      quantity: quantityToBook,
      subDetails: {
        location: tourDetails.location,
        duration: tourDetails.duration,
        pickupSpot: tourDetails.pickupSpot || "Not specified",
        startingDate,
        people: quantityToBook,
      },
    };
    addToCart(cartItem);
  };

  const nextImage = () => {
    const allImages = getAllImages();
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    setCurrentImageIndex(nextIndex);
    setActiveImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    const allImages = getAllImages();
    const prevIndex =
      currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setActiveImage(allImages[prevIndex]);
  };

  const allImages = getAllImages();

  if (!tourDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading tour details...</p>
      </div>
    );
  }

  const renderKeyDetails = () => {
    const details = [];
    if (tourDetails.duration)
      details.push({
        icon: Clock,
        label: "Duration",
        value: tourDetails.duration,
      });
    if (tourDetails.location)
      details.push({
        icon: MapPin,
        label: "Location",
        value: tourDetails.location,
      });
    if (tourDetails.maxGuests)
      details.push({
        icon: Users,
        label: "Max Guests",
        value: tourDetails.maxGuests,
      });
    if (tourDetails.speciality)
      details.push({
        icon: Briefcase,
        label: "Speciality",
        value: tourDetails.speciality,
      });
    if (tourDetails.languages?.length)
      details.push({
        icon: Languages,
        label: "Languages",
        value: tourDetails.languages.join(", "),
      });
    if (tourDetails.shipName)
      details.push({ icon: Ship, label: "Ship", value: tourDetails.shipName });
    if (tourDetails.pickupSpot)
      details.push({
        icon: MapPinned,
        label: "Pickup Spot",
        value: tourDetails.pickupSpot,
      });

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Key Details</h3>
        <div className="grid grid-cols-2 gap-6">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <detail.icon
                size={20}
                className="text-red-600 mt-1 flex-shrink-0"
              />
              <div>
                <p className="text-sm text-gray-500">{detail.label}</p>
                <p className="font-medium text-gray-800">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
              <img
                src={activeImage || allImages[0]}
                alt={tourDetails.title}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </>
              )}
              <button
                onClick={() => openLightbox(activeImage)}
                className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-medium flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>Zoom</span>
              </button>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>

          {/* Tour Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 capitalize">
                {tourDetails.type}
              </span>
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(tourDetails.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {tourDetails.rating?.toFixed(1)} ({tourDetails.reviews}{" "}
                  reviews)
                </span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900">
              {tourDetails.title}
            </h1>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(totalPrice)}
              </span>
              <span className="text-gray-500 text-base">
                ({formatPrice(tourDetails.price)} per person)
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {tourDetails.description}
            </p>

            {renderKeyDetails()}

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="font-semibold text-green-700">
                Available for Booking
              </span>
            </div>

            {/* Date & Quantity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-900 mb-2"
                >
                  Select Start Date:
                </label>
                <input
                  type="date"
                  id="start-date"
                  value={startingDate}
                  onChange={(e) => setStartingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Number of People:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                  <button
                    onClick={() =>
                      setQuantityToBook(Math.max(1, quantityToBook - 1))
                    }
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[60px] border-x border-gray-300">
                    {quantityToBook}
                  </span>
                  <button
                    onClick={() => setQuantityToBook(quantityToBook + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={addToCartHandler}
                disabled={!startingDate}
                className={`w-full font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all ${
                  startingDate
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Users size={20} />
                <span>
                  {startingDate
                    ? `Book Now for ${formatPrice(totalPrice)}`
                    : "Select a date to book"}
                </span>
              </button>

              <button
                onClick={() => setisModelOpen(true)}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg border border-gray-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>View Reviews ({tourDetails.reviews})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <img
            src={lightboxImage}
            alt="Enlarged view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"
            onClick={closeLightbox}
          >
            <XCircle size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
