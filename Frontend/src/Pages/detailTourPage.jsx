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
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Award,
  Package,
  Calendar,
  Info,
  CheckCircle,
  XCircle,
  Users,
  Ship,
  Briefcase,
  Languages,
  MessageSquare,
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
  console.log("rendering");
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState("");
  const [tourDetails, setTourDetails] = useState(null);

  const [quantityToBook, setQuantityToBook] = useState(1);
  const [startingDate, setStartingDate] = useState(""); // State for the date picker
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { id } = useParams();

  // Assuming your store is set up to fetch a tour by ID now
  const { getDetailsById: getTourById, details: fetchedTour } = useTourStore();

  const { addToCart } = useCartStore();
  const { setisModelOpen } = useReviewStore();

  // Format price to currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);
  };

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

  // Calculate total price dynamically based on quantity
  const totalPrice = useMemo(() => {
    if (!tourDetails?.price) return 0;
    return tourDetails.price * quantityToBook;
  }, [tourDetails, quantityToBook]);

  const getAllImages = () => {
    if (
      !tourDetails ||
      !tourDetails.images ||
      tourDetails.images.length === 0
    ) {
      return fallbackGalleryImages;
    }
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
      price: totalPrice, // Send the calculated total price
      serviceId: tourDetails.serviceId,
      category: tourDetails.type,
      productId: tourDetails._id,
      typeOf: "Tour",
      name: tourDetails.title,
      imageUrl: tourDetails.images[0]?.imageUrl || "",
      quantity: quantityToBook, // This represents the number of people
      subDetails: {
        location: tourDetails.location,
        duration: tourDetails.duration,
        startingDate: startingDate, // Include the selected start date
        people: quantityToBook, // Explicitly add the number of people
      },
    };
    addToCart(cartItem);
    // You could add a success notification here
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

  // Helper to render key details based on tour type
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
    if (tourDetails.languages && tourDetails.languages.length > 0)
      details.push({
        icon: Languages,
        label: "Languages",
        value: tourDetails.languages.join(", "),
      });
    if (tourDetails.shipName)
      details.push({
        icon: Ship,
        label: "Ship",
        value: tourDetails.shipName,
      });

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Key Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <detail.icon
                size={18}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              <img
                src={activeImage || allImages[0]}
                alt={tourDetails.title}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronLeft size={20} className="text-gray-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                  >
                    <ChevronRight size={20} className="text-gray-600" />
                  </button>
                </>
              )}
              <button
                onClick={() => openLightbox(activeImage)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-all text-sm font-medium flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>Zoom</span>
              </button>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            </div>
          </div>

          {/* Tour Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 capitalize">
                  {tourDetails.type}
                </span>
              </div>
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

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {tourDetails.title}
              </h1>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(totalPrice)}
                </span>
                {quantityToBook > 0 && (
                  <span className="text-gray-500 text-base">
                    ({formatPrice(tourDetails.price)} per person)
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                {tourDetails.description}
              </p>
            </div>

            {renderKeyDetails()}

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-semibold text-green-700">
                  Available for Booking
                </span>
              </div>
            </div>

            {/* Date and Quantity Section */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-4 border">
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
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Number of People:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
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
                className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-3 ${
                  startingDate
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
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
                className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg border border-gray-300 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageSquare size={20} />
                <span>View Reviews ({tourDetails.reviews})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                What's Included
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "gallery"
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("gallery")}
              >
                Gallery
              </button>
            </nav>
          </div>
          <div className="mt-8">
            {activeTab === "overview" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(tourDetails.includes || tourDetails.amenities)?.map(
                    (feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    )
                  ) || (
                    <p className="text-gray-500">
                      No specific inclusions listed.
                    </p>
                  )}
                </div>
              </div>
            )}
            {activeTab === "gallery" && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => openLightbox(img)}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 py-8 border-y border-gray-200 mt-12">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield size={20} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Verified Service
            </p>
            <p className="text-xs text-gray-500 mt-1">Authentic guarantee</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              Instant Confirmation
            </p>
            <p className="text-xs text-gray-500 mt-1">Book with confidence</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info size={20} className="text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">24/7 Support</p>
            <p className="text-xs text-gray-500 mt-1">We're here to help</p>
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
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          />
          <button
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={closeLightbox}
          >
            <XCircle size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
