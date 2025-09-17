import React, { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Star,
  Users,
  Clock,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useTourStore } from "../../Store/tourStore";
import { useParams, Link } from "react-router-dom";
import { useServiceStore } from "../../Store/servicesStore";
import LoadingSpinner from "../components/LoadingSpinner";

const CountrySelectionPopup = ({
  onSelectCountry,
  availableCountries,
  serviceName,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome to {serviceName}
        </h2>
        <p className="text-gray-600 mb-8">
          Please select a country to explore our exclusive tours and services.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {availableCountries.map((country) => (
            <button
              key={country}
              onClick={() => onSelectCountry(country)}
              className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const TourWebsite = ({ videoUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [activeTab, setActiveTab] = useState("tours");
  const [tourType, setTourType] = useState("private");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountrySelector, setShowCountrySelector] = useState(true);
  const { id } = useParams();

  console.log("rendering");

  const {
    getServiceInfo,
    serviceInfo,
    loading: serviceLoading,
  } = useServiceStore();

  // Zustand store integration
  const {
    data: tabContent,
    loading: isLoading,
    getToursByType: fetchData,
    countries: availableCountries,
    fetchCountries: fetchAvailableCountries,
  } = useTourStore();

  useEffect(() => {
    getServiceInfo(id);
  }, [getServiceInfo, id]);

  useEffect(() => {
    fetchAvailableCountries(id);
  }, [fetchAvailableCountries, id]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountrySelector(false);
    setActiveTab("tours");
    setTourType("private");
  };

  const handleScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!selectedCountry) return;

    let type = activeTab;
    if (activeTab === "tours") {
      console.log(selectedCountry, tourType);
      fetchData(selectedCountry, tourType, id);
    } else {
      fetchData(selectedCountry, type, id);
    }
  }, [activeTab, selectedCountry, tourType, fetchData, id]);

  const { averageRating, totalReviewsCount } = useMemo(() => {
    if (!tabContent || tabContent.length === 0)
      return { averageRating: "N/A", totalReviewsCount: 0 };

    const totalRating = tabContent.reduce((acc, item) => acc + item.rating, 0);
    const totalReviews = tabContent.reduce(
      (acc, item) => acc + item.reviews,
      0
    );

    return {
      averageRating: (totalRating / tabContent.length).toFixed(1),
      totalReviewsCount: totalReviews,
    };
  }, [tabContent]);

  if (serviceLoading || !serviceInfo) {
    return <LoadingSpinner />;
  }

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-600 mt-8">Loading {activeTab}...</p>
      );
    }

    if (tabContent.length === 0) {
      const tabName =
        activeTab === "properties" ? "luxury properties" : activeTab;
      return (
        <p className="text-center text-gray-600 mt-8">
          There are no {tabName} available in {selectedCountry}.
        </p>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {tabContent.map((item) => {
          switch (item.category) {
            case "privateTours": // Handling potential variations
            case "smallGroupTour":
              return (
                <TourCard
                  key={item._id} // Use _id from MongoDB
                  tour={item}
                  tourType={item.tourType} // Use tourType from the data
                  onSelect={() => setSelectedTour(item)}
                />
              );
            case "luxuryProperties":
              return <PropertyCard key={item._id} property={item} />;
            case "guides":
              return <GuideCard key={item._id} guide={item} />;
            case "cruises":
              return <CruiseCard key={item._id} cruise={item} />;
            default:
              return null;
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showCountrySelector && (
        <CountrySelectionPopup
          onSelectCountry={handleCountrySelect}
          availableCountries={availableCountries}
          serviceName={serviceInfo ? serviceInfo.serviceName : "Our Service"}
        />
      )}

      {/* Hero Section (No changes here, remains the same) */}
      <section
        id="home"
        className="h-[80vh] flex items-center relative overflow-hidden"
      >
        {/* Header */}
        <header className="absolute top-0 left-0 w-full z-30 p-3">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo + Title */}
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 text-white p-2 rounded-md shadow-md">
                <MapPin className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-white tracking-wide">
                {serviceInfo?.serviceName || "Wanderlust Tours"}
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-5 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
              <div className="flex items-center gap-1 text-sm text-white">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold">
                  {serviceInfo?.rating || 0}
                </span>
                <span className="hidden lg:inline text-gray-300">
                  ({totalReviewsCount} reviews)
                </span>
              </div>
              <button
                onClick={() => handleScrollTo("reviews")}
                className="text-white hover:text-red-300 transition-colors text-sm font-medium"
              >
                Reviews
              </button>
              <button
                onClick={() => setShowCountrySelector(true)}
                className="bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors text-sm"
              >
                {selectedCountry || "Select Country"}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white bg-black/30 p-2 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden mt-3 bg-black/80 backdrop-blur-lg rounded-lg p-4 shadow-lg">
              <div className="flex flex-col items-start space-y-3">
                <button
                  onClick={() => {
                    setShowCountrySelector(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors w-full text-left"
                >
                  Change Country: {selectedCountry || "None"}
                </button>
                <button
                  onClick={() => handleScrollTo("reviews")}
                  className="text-white px-4 py-2 hover:bg-white/10 rounded-full w-full text-left"
                >
                  Reviews
                </button>
                <div className="flex items-center gap-2 text-sm text-white px-4">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold">{averageRating}</span>
                  <span>({totalReviewsCount} reviews)</span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Background Video / Image */}
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                serviceInfo
                  ? serviceInfo.image.url
                  : "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80"
              })`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 to-red-700/30 z-10"></div>

        {/* Hero Text */}
        <div className="max-w-7xl mx-auto px-6 z-20 relative text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
            Discover Your Next
            <span className="block text-red-300">Adventure</span>
          </h2>
          <p className="text-lg md:text-xl text-red-100 mb-10 leading-relaxed max-w-2xl drop-shadow">
            {serviceInfo
              ? serviceInfo.description
              : "Explore exclusive tours and experiences tailored just for you."}
          </p>
        </div>

        {/* Bouncing Arrow */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
          <button
            onClick={() => handleScrollTo("next-section")}
            className="animate-bounce text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="tours" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Our Services in {selectedCountry}
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From private experiences to luxury accommodations, we offer
              everything for your perfect journey.
            </p>
          </div>

          {/* Service Tabs (No changes here, remains the same) */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-full p-2 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("tours")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "tours"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Tours
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "properties"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Luxury Properties
              </button>
              <button
                onClick={() => setActiveTab("guides")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "guides"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Expert Guides
              </button>
              <button
                onClick={() => setActiveTab("cruises")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeTab === "cruises"
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Luxury Cruises
              </button>
            </div>
          </div>

          {activeTab === "tours" && (
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-full p-1 flex">
                <button
                  onClick={() => setTourType("private")}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    tourType === "private"
                      ? "bg-red-600 text-white shadow-md"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  Private Tours
                </button>
                <button
                  onClick={() => setTourType("group")}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    tourType === "group"
                      ? "bg-red-600 text-white shadow-md"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  Small Group Tours
                </button>
              </div>
            </div>
          )}

          {renderTabContent()}
        </div>
      </section>

      {/* Tour Modal (Updated to handle backend data structure) */}
      {/* {selectedTour && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedTour.images[0]?.imageUrl} // Use the first image from the images array
                alt={selectedTour.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedTour(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 p-2 rounded-full hover:bg-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              <h4 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedTour.title}
              </h4>
              <p className="text-gray-600 mb-6">{selectedTour.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-red-600 mr-2" />
                  <span>{selectedTour.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-red-600 mr-2" />
                  <span>{selectedTour.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                  <span>
                    {selectedTour.rating} ({selectedTour.reviews} reviews)
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-red-600 mr-2" />
                  <span>{selectedTour.maxGuests}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-red-600">
                    ${selectedTour.price}
                  </span>
                  <span className="text-gray-600 ml-2">per person</span>
                </div>
                <button className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

// The card components are now updated to use the fields from your Mongoose schema.
// For example, `image` is now `images[0]?.imageUrl`.

const TourCard = ({ tour, tourType, onSelect }) => (
  <div
    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
    onClick={onSelect}
  >
    <div className="relative overflow-hidden">
      <img
        src={tour.images[0]?.imageUrl}
        alt={tour.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        ${tour.price}
      </div>
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-red-600 px-3 py-1 rounded-full text-xs font-semibold uppercase">
        {tourType === "private" ? "Private" : "Small Group"}
      </div>
      <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur rounded-full px-3 py-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-semibold">{tour.rating}</span>
        <span className="ml-1 text-sm text-gray-600">({tour.reviews})</span>
      </div>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h4>
      <p className="text-gray-600 mb-4">{tour.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-red-600" />
          {tour.location}
        </div>
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-1 text-red-600" />
          {tour.maxGuests}
        </div>
      </div>
      <Link to={`/service/tours/details/${tour._id}`}>
        <button className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center group">
          View Details{" "}
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  </div>
);

const PropertyCard = ({ property }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
    <div className="relative overflow-hidden">
      <img
        src={property.images[0]?.imageUrl}
        alt={property.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        ${property.price}/night
      </div>
      <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur rounded-full px-3 py-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-semibold">{property.rating}</span>
        <span className="ml-1 text-sm text-gray-600">({property.reviews})</span>
      </div>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h4>
      <p className="text-gray-600 mb-4">{property.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-red-600" />
          {property.location}
        </div>
      </div>
      <Link to={`/service/tour/${tour._id}`}>
        <button className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center group">
          Book Property{" "}
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  </div>
);

const GuideCard = ({ guide }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
    <div className="relative overflow-hidden">
      <img
        src={guide.images[0]?.imageUrl}
        alt={guide.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        ${guide.price}/day
      </div>
      <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur rounded-full px-3 py-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-semibold">{guide.rating}</span>
        <span className="ml-1 text-sm text-gray-600">({guide.reviews})</span>
      </div>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-1">{guide.title}</h4>
      <p className="text-red-600 font-semibold text-sm mb-3">
        {guide.speciality}
      </p>
      <p className="text-gray-600 mb-4">{guide.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-red-600" />
          {guide.location}
        </div>
      </div>
      <Link to={`/service/tour/${guide._id}`}>
        <button className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center group">
          Hire Guide{" "}
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  </div>
);

const CruiseCard = ({ cruise }) => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
    <div className="relative overflow-hidden">
      <img
        src={cruise.images[0]?.imageUrl}
        alt={cruise.title}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
        ${cruise.price}
      </div>
      <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur rounded-full px-3 py-1">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-semibold">{cruise.rating}</span>
        <span className="ml-1 text-sm text-gray-600">({cruise.reviews})</span>
      </div>
    </div>
    <div className="p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-2">{cruise.title}</h4>
      <p className="text-gray-600 mb-4">{cruise.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1 text-red-600" />
          {cruise.location}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1 text-red-600" />
          {cruise.duration}
        </div>
      </div>
      <Link to={`/service/tour/${tour._id}`}>
        <button className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors flex items-center justify-center group">
          Book Cruise{" "}
          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </div>
  </div>
);

export default TourWebsite;
