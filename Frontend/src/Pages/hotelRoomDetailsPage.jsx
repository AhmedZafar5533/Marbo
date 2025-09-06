import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Bed,
  Bath,
  Home,
  Clock,
  Shield,
  Info,
  Star,
  Heart,
  Share2,
  Camera,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Tv,
  Coffee,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Menu,
  Plus,
  Minus,
  Eye,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useHotelRoomStore } from "../../Store/hotelRoomStore";
import { useCartStore } from "../../Store/cartStore";
import LoadingSpinner from "../components/LoadingSpinner";

const RoomDetailPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const imageContainerRef = useRef(null);

  // Get room details and loading state from store
  const { getRoomDeatils, loading, roomDetails } = useHotelRoomStore();
  const { addToCart } = useCartStore();
  const { id } = useParams();

  // Fetch room details when component mounts or id changes
  useEffect(() => {
    if (id) {
      getRoomDeatils(id);
    }
  }, [id, getRoomDeatils]);

  // Load images when room data is available
  useEffect(() => {
    if (roomDetails?.images?.length > 0) {
      const loadImage = (src, index) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded((prev) => ({ ...prev, [index]: true }));
        };
        img.onerror = () => {
          setImagesLoaded((prev) => ({ ...prev, [index]: false }));
        };
        img.src = src;
      };

      // Load current image and adjacent images
      const imagesToLoad = [
        currentImageIndex,
        (currentImageIndex + 1) % roomDetails.images.length,
        (currentImageIndex - 1 + roomDetails.images.length) %
          roomDetails.images.length,
      ];

      imagesToLoad.forEach((index) => {
        if (imagesLoaded[index] === undefined) {
          loadImage(roomDetails.images[index].imageUrl, index);
        }
      });
    }
  }, [currentImageIndex, roomDetails?.images, imagesLoaded]);

  // Show loading spinner while data is being fetched
  if (loading || !roomDetails) {
    return <LoadingSpinner />;
  }

  // Safe access to room properties with defaults
  const room = {
    images: roomDetails.images || [],
    title: roomDetails.title || "Room Title",
    serviceName: roomDetails.serviceName || "Hotel Name",
    serviceLocation: roomDetails.serviceLocation || "Location",
    maxGuests: roomDetails.maxGuests || 2,
    bedType: roomDetails.bedType || "double",
    size: roomDetails.size || 25,
    sizeUnit: roomDetails.sizeUnit || "sqm",
    roomType: roomDetails.roomType || "standard",
    availability: roomDetails.availability || "available",
    description: roomDetails.description || "Room description not available.",
    features: roomDetails.features || [],
    price: roomDetails.price || 100,
    cleaningFee: roomDetails.cleaningFee || 25,
    serviceFee: roomDetails.serviceFee || 15,
    rating: roomDetails.rating || 4.9,
    reviewCount: roomDetails.reviewCount || 67,
  };

  // Don't render if no images available
  if (!room.images.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No images available
          </h2>
          <p className="text-gray-600">
            This room doesn't have any photos yet.
          </p>
        </div>
      </div>
    );
  }

  const imageUrls = room.images.map((img) => img.imageUrl);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageUrls.length) % imageUrls.length
    );
  };

  const getAvailabilityStatus = () => {
    switch (room.availability) {
      case "available":
        return {
          text: "Available",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        };
      case "booked":
        return {
          text: "Booked",
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: X,
        };
      case "maintenance":
        return {
          text: "Maintenance",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: Clock,
        };
      default:
        return {
          text: "Available",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        };
    }
  };

  const availabilityStatus = getAvailabilityStatus();
  const StatusIcon = availabilityStatus.icon;

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const days = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    return room.price * days + room.cleaningFee + room.serviceFee;
  };

  const getDaysDifference = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
  };

  const validateForm = () => {
    const errors = {};

    if (!checkInDate) {
      errors.checkInDate = "Check-in date is required";
    }

    if (!checkOutDate) {
      errors.checkOutDate = "Check-out date is required";
    }

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        errors.checkInDate = "Check-in date cannot be in the past";
      }

      if (checkOut <= checkIn) {
        errors.checkOutDate = "Check-out date must be after check-in date";
      }
    }

    if (guestCount < 1 || guestCount > room.maxGuests) {
      errors.guestCount = `Guest count must be between 1 and ${room.maxGuests}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = async () => {
    if (room.availability !== "available") {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsAddingToCart(true);

    try {
      const cartItem = {
        price: calculateTotal(),
        serviceId: roomDetails.serviceId || id,
        category: roomDetails.category || "hotel",
        productId: id || null,
        name: room.title,
        typeOf: "Hotel Room",
        imageUrl: imageUrls[0] || "",
        quantity: 1,
        subDetails: {
          checkInDate,
          checkOutDate,
          guestCount,
          numberOfNights: getDaysDifference(),
          pricePerNight: room.price,
          cleaningFee: room.cleaningFee,
          serviceFee: room.serviceFee,
          location: `${room.serviceName}, ${room.serviceLocation}`,
          maxGuests: room.maxGuests,
          bedType: room.bedType,
          roomType: room.roomType,
          size: `${room.size} ${room.sizeUnit}`,
        },
      };

      await addToCart(cartItem);
      console.log("Added to cart:", cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="relative bg-gray-100">
        <div className="absolute top-0 w-full z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center ml-auto space-x-3">
                {imageUrls.length > 0 && (
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="hidden sm:flex items-center space-x-2 px-3 py-2 border border-white/70 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Photos</span>
                  </button>
                )}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-2 border border-white/70 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>
                <button className="p-2 border border-white/70 rounded-lg text-white hover:bg-white/20 transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative">
          <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] overflow-hidden bg-gray-200">
            <div className="relative w-full h-full group">
              {imagesLoaded[currentImageIndex] ? (
                <img
                  src={imageUrls[currentImageIndex]}
                  alt="Room"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>
              )}

              {/* Image Navigation - Desktop */}
              {imageUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="hidden md:flex absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white items-center justify-center rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="hidden md:flex absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white items-center justify-center rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Image Indicators */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Room Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium capitalize">
                  {room.roomType}
                </span>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {room.rating} · {room.reviewCount} reviews
                  </span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 ${availabilityStatus.bgColor} rounded-full`}
                >
                  <StatusIcon
                    className={`w-4 h-4 ${availabilityStatus.textColor}`}
                  />
                  <span
                    className={`text-sm font-medium ${availabilityStatus.textColor}`}
                  >
                    {availabilityStatus.text}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {room.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                <span>
                  {room.serviceName} • {room.serviceLocation}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Users className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold">{room.maxGuests}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Bed className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bed Type</p>
                    <p className="font-semibold capitalize">{room.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Home className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold">
                      {room.size} {room.sizeUnit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Star className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">{room.rating}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this room
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Features */}
            {room.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Room features & amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(showAllFeatures
                    ? room.features
                    : room.features.slice(0, 8)
                  ).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span className="text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
                {room.features.length > 8 && (
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="mt-6 px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    {showAllFeatures
                      ? "Show less"
                      : `Show all ${room.features.length} features`}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ${room.price}
                  </span>
                  <span className="text-gray-600 ml-1">/ night</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      formErrors.checkInDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.checkInDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.checkInDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                      formErrors.checkOutDate
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.checkOutDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.checkOutDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Guest Count */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guests
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="px-3 py-2 hover:bg-gray-50 rounded-l-lg border-r"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center py-2 text-gray-800 font-medium">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setGuestCount(Math.min(room.maxGuests, guestCount + 1))
                    }
                    className="px-3 py-2 hover:bg-gray-50 rounded-r-lg border-l"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {formErrors.guestCount && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.guestCount}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              {checkInDate && checkOutDate && (
                <div className="mb-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      ${room.price} × {getDaysDifference()} nights
                    </span>
                    <span>${room.price * getDaysDifference()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Cleaning fee</span>
                    <span>${room.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Service fee</span>
                    <span>${room.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || room.availability !== "available"}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {isAddingToCart ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <p className="text-center text-gray-600 text-sm mt-3">
                You won't be charged until checkout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl">
            <img
              src={imageUrls[currentImageIndex]}
              alt="Room view"
              className="w-full h-auto rounded-lg"
            />
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Image indicators inside modal */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;
