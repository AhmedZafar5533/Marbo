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
  User,
  ClipboardList,
  FileText,
  DollarSign,
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
  const [guideGender, setGuideGender] = useState("any");
  const [specialInstructions, setSpecialInstructions] = useState("");
  // MODIFICATION: Add state to handle date validation errors
  const [dateError, setDateError] = useState("");

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
      category: tourDetails.category,
      productId: tourDetails._id,
      typeOf: "Tour",
      name: tourDetails.name,
      imageUrl: tourDetails.images?.[0]?.imageUrl || "",
      quantity: 1,
      subDetails: {
        location: tourDetails.location,
        numberofPeople: tourDetails.numberofPeople,
        duration: tourDetails.duration,
        pickupSpot: tourDetails.pickupSpot || "Not specified",
        startingDate,
        people: quantityToBook,
        guideGender,
        specialInstructions,
      },
    };

    if (cartItem.subDetails.specialInstructions.trim() === "") {
      delete cartItem.subDetails.specialInstructions;
    }

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

  // MODIFICATION: Add a handler to validate the selected date.
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const operatesOnDays = tourDetails.selectedDays;

    // Clear previous state
    setDateError("");
    setStartingDate("");

    // If the tour can be booked on any day, just set the date.
    if (!operatesOnDays || operatesOnDays.length === 0) {
      setStartingDate(selectedDate);
      return;
    }

    // Get the day of the week for the selected date
    const date = new Date(selectedDate);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const dayOfWeek = utcDate.getDay();
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const selectedDayName = dayNames[dayOfWeek];

    // Check if the selected day is in the list of allowed days
    const isDayValid = operatesOnDays.some(
      (validDay) => validDay.toLowerCase() === selectedDayName.toLowerCase()
    );

    if (isDayValid) {
      setStartingDate(selectedDate);
    } else {
      setDateError(
        `This tour only operates on ${operatesOnDays.join(
          ", "
        )}. Please select a valid day.`
      );
    }
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
        value: `${tourDetails.duration} days`,
      });
    if (tourDetails.location)
      details.push({
        icon: MapPin,
        label: "Location",
        value: tourDetails.location,
      });
    if (tourDetails.country)
      details.push({
        icon: MapPinned,
        label: "Country",
        value: tourDetails.country,
      });
    if (tourDetails.category)
      details.push({
        icon: Briefcase,
        label: "Category",
        value: tourDetails.category,
      });
    if (tourDetails.spokenLanguages?.length)
      details.push({
        icon: Languages,
        label: "Languages",
        value: tourDetails.spokenLanguages.join(", "),
      });
    // MODIFICATION: Use `selectedDays` for a more accurate description if available
    if (tourDetails.selectedDays && tourDetails.selectedDays.length > 0)
      details.push({
        icon: Calendar,
        label: "Operates",
        value: tourDetails.selectedDays.join(", "),
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

  const renderTabs = () => {
    const tabs = [
      { id: "overview", label: "Overview", icon: Eye },
      { id: "detailed", label: "Detailed Inclusions", icon: ClipboardList },
      { id: "itinerary", label: "Itinerary", icon: FileText },
      { id: "booking", label: "Date & Pricing", icon: DollarSign },
    ];
    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
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
                alt={tourDetails.name}
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
                {tourDetails.productType}
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
              {tourDetails.name}
            </h1>
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-red-600">
                {formatPrice(tourDetails.price)}
              </span>
              <span className="text-gray-500 text-base">per person</span>
            </div>

            {renderKeyDetails()}

            <div className="space-y-3 pt-4">
              <button
                onClick={() => setActiveTab("booking")}
                className="w-full font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
              >
                <Users size={20} />
                <span>Book Now</span>
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

        <div className="mt-12">
          {renderTabs()}
          <div className="py-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Overview</h3>
                <p className="text-gray-600 leading-relaxed">
                  {tourDetails.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                      <CheckCircle size={20} className="text-green-500 mr-2" />
                      Inclusions
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {tourDetails.inclusions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-3 flex items-center">
                      <XCircle size={20} className="text-red-500 mr-2" />
                      Exclusions
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      {tourDetails.exclusions.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "detailed" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detailed Inclusions
                </h3>
                {Object.entries(tourDetails.detailedInclusions)
                  .filter(
                    ([key, value]) => Array.isArray(value) && value.length > 0
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      <h4 className="font-semibold text-lg text-gray-800 mb-3 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                        {value.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
            {activeTab === "itinerary" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Itinerary</h3>
                <div className="space-y-8">
                  {tourDetails.itinerary.map((day) => (
                    <div key={day.day} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {day.day}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-gray-800">
                          Day {day.day}
                        </h4>
                        <p className="text-gray-600 mt-1">{day.plan}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Meals: <span className="capitalize">{day.meals}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "booking" && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Date & Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Side: Booking Form */}
                  <div className="space-y-6">
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
                        // MODIFICATION: Use `startingDate` for the value but the handler will control it
                        value={startingDate}
                        // MODIFICATION: Use the new handler for validation
                        onChange={handleDateChange}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      />
                      {/* MODIFICATION: Display the error message if it exists */}
                      {dateError && (
                        <p className="text-red-500 text-sm mt-2">{dateError}</p>
                      )}
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

                    <div>
                      <label
                        htmlFor="guide-gender"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Guide Gender Preference:
                      </label>
                      <select
                        id="guide-gender"
                        value={guideGender}
                        onChange={(e) => setGuideGender(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="any">Any</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="special-instructions"
                        className="block text-sm font-medium text-gray-900 mb-2"
                      >
                        Special Instructions:
                      </label>
                      <textarea
                        id="special-instructions"
                        rows="4"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                        placeholder="e.g., dietary restrictions, mobility concerns"
                      ></textarea>
                    </div>
                  </div>

                  {/* Right Side: Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4">
                      Booking Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per person:</span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(tourDetails.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium text-gray-900">
                          {quantityToBook} people
                        </span>
                      </div>
                      <div className="border-t border-gray-200 my-3"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                          Total Price:
                        </span>
                        <span className="text-2xl font-bold text-red-600">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={addToCartHandler}
                      disabled={!startingDate}
                      className={`w-full font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all mt-6 ${
                        startingDate
                          ? "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <Users size={20} />
                      <span>
                        {startingDate ? `Add to Cart` : "Select a date to book"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
