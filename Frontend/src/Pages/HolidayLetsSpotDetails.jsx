import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  User,
  MessageCircle,
  Key,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  Award,
  Sparkles,
  Phone,
  Mail,
  Check,
  ShoppingCart,
  AlertCircle,
} from "lucide-react";
import { useHolidayLetsStore } from "../../Store/holidayLetsStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCartStore } from "../../Store/cartStore";

const PropertyDetailPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { id } = useParams();

  const { getProperty, property, loading } = useHolidayLetsStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    getProperty(id);
  }, [id, getProperty]);

  if (loading) return <LoadingSpinner />;

  if (!property && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Home className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property not found
          </h2>
          <p className="text-gray-600">
            The property you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const imageUrls = property.images?.map((img) => img.imageUrl) || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageUrls.length) % imageUrls.length
    );
  };

  const getAvailabilityStatus = () => {
    switch (property.availability) {
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
          text: "Unknown",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Info,
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
    return (
      property.pricePerNight * days +
      (property.cleaningFee || 0) +
      (property.securityDeposit || 0)
    );
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

    if (guestCount < 1 || guestCount > property.maxGuests) {
      errors.guestCount = `Guest count must be between 1 and ${property.maxGuests}`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddToCart = async () => {
    if (property.availability !== "available") {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsAddingToCart(true);

    try {
      // Construct cart item
      const cartItem = {
        price: calculateTotal(), // total amount including fees
        serviceId: property.serviceId, // assuming service is the property
        category: property.category || "property",
        productId: id || null, // optional
        name: property.title,
        typeOf: "Holiday Spot",
        imageUrl: imageUrls[0] || "",
        quantity: 1,
        subDetails: {
          checkInDate,
          checkOutDate,
          guestCount,
          numberOfNights: getDaysDifference(),
          pricePerNight: property.pricePerNight,
          cleaningFee: property.cleaningFee || 0,
          securityDeposit: property.securityDeposit || 0,
          location: `${property.city}, ${property.stateRegion}, ${property.country}`,
          maxGuests: property.maxGuests,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
        },
      };
      const success = await addToCart(cartItem);

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
              </div>
            </div>
          </div>
        </div>

        {/* The Hero Image Section now sits at the base of the relative container,
    allowing the absolute-positioned header to float on top of it.
    No changes were needed for this section.
  */}
        <div className="relative">
          <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] overflow-hidden bg-gray-200">
            {imageUrls.length > 0 ? (
              <div className="relative w-full h-full group">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt="Property"
                  className="w-full h-full object-cover"
                />

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
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">No Images Available</p>
                </div>
              </div>
            )}
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
            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {property.propertyType?.charAt(0).toUpperCase() +
                    property.propertyType?.slice(1)}
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
                    5.0 · 89 reviews
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
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                <span>
                  {property.city}, {property.stateRegion}, {property.country}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Users className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold">{property.maxGuests}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Bed className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Bath className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Home className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold">
                      {property.propertySize} {property.sizeUnit}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this place
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {property.description}
              </p>

              {property.accessDescription && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Key className="w-5 h-5 mr-2 text-red-500" />
                    Getting around
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.accessDescription}
                  </p>
                </div>
              )}

              {property.hostInteraction && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-red-500" />
                    Host interaction
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.hostInteraction}
                  </p>
                </div>
              )}
            </div>

            {/* Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  What this place offers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(showAllAmenities
                    ? property.features
                    : property.features.slice(0, 8)
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
                {property.features.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                    className="mt-6 px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    {showAllAmenities
                      ? "Show less"
                      : `Show all ${property.features.length} amenities`}
                  </button>
                )}
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Where you'll be
              </h3>
              <div className="space-y-1 text-gray-700 mb-6">
                <p className="font-semibold">{property.addressLine1}</p>
                {property.addressLine2 && <p>{property.addressLine2}</p>}
                <p>
                  {property.city}, {property.stateRegion} {property.postalCode}
                </p>
                <p className="font-medium">{property.country}</p>
              </div>
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-600" />
                  </div>
                  {property.mapLink ? (
                    <a
                      href={property.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      View on Map
                    </a>
                  ) : (
                    <p className="text-gray-600">Map location not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    ${property.pricePerNight}
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
                      setGuestCount(
                        Math.min(property.maxGuests, guestCount + 1)
                      )
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
                      ${property.pricePerNight} × {getDaysDifference()} nights
                    </span>
                    <span>${property.pricePerNight * getDaysDifference()}</span>
                  </div>
                  {property.cleaningFee > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Cleaning fee</span>
                      <span>${property.cleaningFee}</span>
                    </div>
                  )}
                  {property.securityDeposit > 0 && (
                    <div className="flex justify-between text-gray-700">
                      <span>Security deposit</span>
                      <span>${property.securityDeposit}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={
                  isAddingToCart || property.availability !== "available"
                }
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
              alt="Property view"
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

export default PropertyDetailPage;
