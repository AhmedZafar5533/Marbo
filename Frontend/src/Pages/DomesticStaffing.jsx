import React, { useState } from "react";
import { useDomesticStaffingStore } from "../../Store/domesticStaffingStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { AlertCircle } from "lucide-react";
import { useReviewStore } from "../../Store/reviewsStore";
import { useCartStore } from "../../Store/cartStore";

const DomesticStaffingService = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [serviceDetails, setServiceDetails] = useState(null);
  const { id } = useParams();
  const { setisModelOpen } = useReviewStore();

  const { getAllDomesticStaffing, domesticStaffing, loading, serviceData } =
    useDomesticStaffingStore();
  const { addToCart } = useCartStore();

  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      title: "Professional Housekeeping",
      description: "Meticulous attention to detail in every room",
    },
    {
      url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop",
      title: "Childcare Excellence",
      description: "Safe, nurturing environment for your children",
    },
    {
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      title: "Culinary Mastery",
      description: "Restaurant-quality meals in your home",
    },
    {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      title: "Elder Care",
      description: "Compassionate care for your loved ones",
    },
    {
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      title: "Transportation Services",
      description: "Professional chauffeur services",
    },
    {
      url: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
      title: "Estate Management",
      description: "Complete property coordination",
    },
  ];

  const openModal = () => {
    setisModelOpen();
  };

  useEffect(() => {
    if (!id) return;
    getAllDomesticStaffing(id);
  }, [id, getAllDomesticStaffing]);

  const getServiceColor = () => {
    // No 'type' parameter needed anymore
    const gradientColors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-purple-500 to-purple-600",
      "from-indigo-500 to-indigo-600",
      "from-red-500 to-red-600",
      "from-pink-500 to-pink-600", // Added more options for variety
      "from-teal-500 to-teal-600",
      "from-cyan-500 to-cyan-600",
      "from-lime-500 to-lime-600",
      "from-amber-500 to-amber-600",
    ];

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * gradientColors.length);

    // Return the color at the random index
    return gradientColors[randomIndex];
  };
  // Helper function to get schedule color
  const getScheduleColor = (days) => {
    const dayCount = parseInt(days);
    if (dayCount <= 3) return "from-blue-500 to-blue-600";
    if (dayCount <= 6) return "from-green-500 to-green-600";
    return "from-purple-500 to-purple-600";
  };

  const calculatePrice = () => {
    if (!selectedService || !selectedSchedule || !domesticStaffing) return 0;

    const service = domesticStaffing.find((s) => s._id === selectedService);
    if (!service) return 0;

    const schedule = service.schedule.find((s) => s.name === selectedSchedule);
    if (!schedule) return 0;

    return schedule.rate;
  };

  const addToCartHandler = () => {
    // Validate that both service and schedule are selected
    if (!selectedService || !selectedSchedule) {
      alert("Please select both a service and schedule before adding to cart");
      return;
    }

    // Find the selected service
    const selectedServiceData = domesticStaffing.find(
      (s) => s._id === selectedService
    );
    if (!selectedServiceData) {
      alert("Selected service not found");
      return;
    }

    // Find the selected schedule within the service
    const selectedScheduleData = selectedServiceData.schedule.find(
      (schedule) => schedule.name === selectedSchedule
    );
    if (!selectedScheduleData) {
      alert("Selected schedule not found");
      return;
    }
    console.log(serviceData.image.url);
    // Gather all the required data
    const cartItem = {
      price: selectedScheduleData.rate,
      serviceId: id,
      productId: selectedService,
      selectedScheduleName: selectedSchedule,
      imageUrl: serviceData.image.url,
      name: selectedServiceData.type,
      typeOf: serviceData?.serviceName || "Staffing",
    };
    addToCart(cartItem);

    console.log("Adding to cart:", cartItem);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!loading && domesticStaffing.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center animate-fade-in">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            No Services Found
          </h2>
          <p className="text-slate-500">
            We couldn't find any domestic staffing services at the moment.
            Please check back later.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16 relative">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-200 mb-6 shadow-lg">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-700">
                Trusted & Verified
              </span>
            </div>
            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-slate-800 via-red-800 to-orange-800 bg-clip-text text-transparent mb-6 leading-tight">
              {serviceData.serviceName}
              <br />
              {/* <span className="text-5xl">Staffing Services</span> */}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {serviceData.description}
            </p>
          </div>
        </section>

        {/* Vendor Info Card */}
        <section className="mb-16">
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">HS</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {serviceData.vendorName}
                  </h2>
                  <div className="flex items-center gap-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 bg-yellow-400 rounded-sm"
                          ></div>
                        ))}
                      </div>
                      <span className="ml-1 font-semibold">4.9 Rating</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
                <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                  Vendor Details
                </button>
                <button
                  onClick={openModal}
                  className="bg-gradient-to-r border-2 border-red-600 text-black px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Reviews
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Service Selection */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-800 mb-4">
              Step 1: Choose Your Service
            </h3>
            <p className="text-xl text-slate-600">
              Select the type of professional staff you need
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domesticStaffing.map((service, index) => (
              <div
                key={service._id}
                className={`group cursor-pointer transition-all duration-500 hover:-translate-y-3 ${
                  selectedService === service._id
                    ? "bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-2xl scale-105"
                    : "bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white hover:shadow-2xl"
                }`}
                onClick={() => setSelectedService(service._id)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="rounded-2xl p-6 h-full">
                  <div
                    className={`mb-4 group-hover:scale-110 transition-transform duration-300 ${
                      selectedService === service._id ? "scale-110" : ""
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                        selectedService === service._id
                          ? "from-white/20 to-white/10"
                          : getServiceColor(service.type)
                      } flex items-center justify-center shadow-lg`}
                    >
                      <span
                        className={`text-2xl font-bold ${
                          selectedService === service._id
                            ? "text-white"
                            : "text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>
                  </div>
                  <h4
                    className={`text-xl font-bold mb-2 ${
                      selectedService === service._id
                        ? "text-white"
                        : "text-slate-800"
                    }`}
                  >
                    {service.type}
                  </h4>
                  <p
                    className={`mb-4 ${
                      selectedService === service._id
                        ? "text-red-100"
                        : "text-slate-600"
                    }`}
                  >
                    {service.description}
                  </p>
                  <div
                    className={`text-sm font-semibold ${
                      selectedService === service._id
                        ? "text-white"
                        : "text-red-600"
                    }`}
                  >
                    Starting from $
                    {Math.min(...service.schedule.map((s) => s.rate))}/week
                  </div>
                  {selectedService === service._id && (
                    <div className="mt-4 flex items-center text-white">
                      <div className="w-5 h-5 bg-white rounded-full mr-2 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="font-semibold">Selected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Schedule Selection */}
        {selectedService && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-slate-800 mb-4">
                Step 2: Select Your Schedule
              </h3>
              <p className="text-xl text-slate-600">
                Choose how many days per week you need service
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {domesticStaffing
                .find((s) => s._id === selectedService)
                ?.schedule.map((schedule) => (
                  <div
                    key={schedule.name}
                    className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 ${
                      selectedSchedule === schedule.name
                        ? "bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-2xl scale-105 border-2 border-red-300"
                        : "bg-white/90 backdrop-blur-xl border-2 border-white/50 hover:border-red-300"
                    }`}
                    onClick={() => setSelectedSchedule(schedule.name)}
                  >
                    <div className="rounded-3xl p-8">
                      <div className="text-center mb-6">
                        <div
                          className={`w-max h-12 mx-auto p-4 mb-4 rounded-xl bg-gradient-to-br  ${
                            selectedSchedule === schedule.name
                              ? "from-white/20 to-white/10"
                              : getScheduleColor(schedule.days)
                          } flex items-center justify-center`}
                        >
                          <span className="text-white font-bold text-lg">
                            {schedule.days}
                          </span>
                        </div>
                        <h4
                          className={`text-2xl font-bold mb-2 ${
                            selectedSchedule === schedule.name
                              ? "text-white"
                              : "text-slate-800"
                          }`}
                        >
                          {schedule.name}
                        </h4>
                        <p
                          className={`text-lg ${
                            selectedSchedule === schedule.name
                              ? "text-red-100"
                              : "text-slate-600"
                          }`}
                        >
                          {schedule.days} days per week
                        </p>
                        <p
                          className={`text-sm ${
                            selectedSchedule === schedule.name
                              ? "text-red-200"
                              : "text-slate-500"
                          }`}
                        >
                          ${schedule.rate}/week
                        </p>
                      </div>
                      <ul
                        className={`text-left mt-4 mb-6 space-y-2 ${
                          selectedSchedule === schedule.name
                            ? "text-red-100"
                            : "text-slate-700"
                        }`}
                      >
                        {schedule.includedThings.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <svg
                              className={`w-5 h-5 mr-3 ${
                                selectedSchedule === schedule.name
                                  ? "text-white"
                                  : "text-pink-500"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="text-center">
                        <p
                          className={`text-sm ${
                            selectedSchedule === schedule.name
                              ? "text-red-100"
                              : "text-slate-600"
                          }`}
                        >
                          {schedule.description}
                        </p>
                      </div>
                      {selectedSchedule === schedule.name && (
                        <div className="text-center mt-4">
                          <div className="bg-white/20 rounded-lg p-3">
                            <span className="text-white font-bold">
                              ✓ Selected
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Dynamic Pricing Display */}
        {selectedService && selectedSchedule && (
          <section className="mb-16">
            <div className="bg-gradient-to-r from-rose-500 to-red-500 rounded-3xl p-12 text-white text-center">
              <h3 className="text-4xl font-bold mb-4">Your Custom Package</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-6xl font-black mb-2">
                    ${calculatePrice()}
                  </div>
                  <div className="text-xl text-rose-100">per week</div>
                </div>
                <div className="text-left">
                  <div className="mb-2">
                    <span className="font-semibold">Service:</span>{" "}
                    {
                      domesticStaffing.find((s) => s._id === selectedService)
                        ?.type
                    }
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Schedule:</span>{" "}
                    {selectedSchedule}
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Days:</span>{" "}
                    {
                      domesticStaffing
                        .find((s) => s._id === selectedService)
                        ?.schedule.find((sch) => sch.name === selectedSchedule)
                        ?.days
                    }{" "}
                    days/week
                  </div>
                  <button
                    onClick={addToCartHandler}
                    className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Image Gallery */}
        {/* <section className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-800 mb-4">
              See Our Work in Action
            </h3>
            <p className="text-xl text-slate-600">
              Professional excellence captured in every moment
            </p>
          </div>
          <div className="relative">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <img
                  src={galleryImages[currentImageIndex].url}
                  alt={galleryImages[currentImageIndex].title}
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">
                    {galleryImages[currentImageIndex].title}
                  </h4>
                  <p className="text-lg text-gray-200">
                    {galleryImages[currentImageIndex].description}
                  </p>
                </div>

    
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <span className="text-xl font-bold">‹</span>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <span className="text-xl font-bold">›</span>
                </button>
              </div>

              <div className="flex justify-center mt-6 gap-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-red-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section> */}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DomesticStaffingService;
