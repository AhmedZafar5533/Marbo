import { useState, useEffect, lazy, Suspense, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Star,
  Shield,
  Send,
  ShoppingCart,
  CreditCard,
  Droplets,
  PaintBucket,
  Shirt,
  Home,
  Palette,
  Camera,
  Bed,
  Heart,
  Users,
  Building,
  MapPin,
  GraduationCap,
  Banknote,
  Smartphone,
  Wrench,
  Hammer,
  Wheat,
  Calendar,
  Phone,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useServiceStore } from "../../../Store/servicesStore";
import { FaGlobe } from "react-icons/fa";

// Global image cache to track loaded images across component remounts
const imageCache = new Set();

// Improved LazyImage component with cache
const LazyImage = ({ src, alt, className, loading = "lazy" }) => {
  const [loaded, setLoaded] = useState(imageCache.has(src));

  useEffect(() => {
    if (loaded) {
      imageCache.add(src);
    }
  }, [loaded, src]);

  return (
    <>
      {!loaded && (
        <div className="h-full w-full bg-gray-200 animate-pulse absolute inset-0"></div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          loaded ? "opacity-100" : "opacity-0"
        } transition-opacity duration-300`}
        loading={loading}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};

const CategoriesAndServices = () => {
  const { frontEndServices, fetchFrontendServices, loading } =
    useServiceStore();

  const colors = {
    primary: {
      main: "#FF3B30",
      light: "#FF6E64",
      dark: "#CC2F26",
      gradient: "linear-gradient(135deg, #FF3B30, #FF6E64)",
    },
    accent: {
      yellow: "#FFD60A",
      purple: "#7A5AF8",
      teal: "#20E3B2",
      orange: "#FF8C00",
      blue: "#007AFF",
      green: "#34C759",
    },
    neutral: {
      black: "#121212",
      white: "#FFFFFF",
      offWhite: "#F9F9F9",
      light: "#F0F0F0",
      grey: "#747474",
    },
  };

  // Service metadata mapping
  const serviceMetadata = {
    Groceries: {
      description:
        "Fresh food and essential supplies delivered to your loved ones",
      icon: ShoppingCart,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.green,
      type: "Groceries",
    },
    "Utility Payments": {
      description: "Pay electricity, gas, and other utility bills securely",
      icon: CreditCard,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.blue,
      type: "Utility Payments",
    },
    "Water Bill Payments": {
      description: "Keep water services running with timely bill payments",
      icon: Droplets,
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.teal,
      type: "Water Bills",
    },
    "Interior Design": {
      description: "Transform living spaces with professional interior design",
      icon: PaintBucket,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.purple,
      type: "Interior Design",
    },
    "Traditional Clothing": {
      description: "Authentic cultural attire and traditional garments",
      icon: Shirt,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.yellow,
      type: "Traditional Clothing",
    },
    "Holiday Lets": {
      description: "Comfortable vacation rentals and holiday accommodations",
      icon: Home,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.orange,
      type: "Holiday Lets",
    },
    "Arts & Crafts": {
      description: "Handmade crafts with local artistry and cultural heritage",
      icon: Palette,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.yellow,
      type: "Arts & Crafts",
    },
    "Fashion Services": {
      description: "Custom tailoring and fashion design services",
      icon: Camera,
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.purple,
      type: "Fashion Services",
    },
    "Hotel Booking": {
      description: "Comfortable accommodations and hotel reservations",
      icon: Bed,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.blue,
      type: "Hotel Booking",
    },
    "Medical Care": {
      description: "Quality healthcare services and medical consultations",
      icon: Heart,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.teal,
      type: "Medical Care",
    },
    "Domestic Staffing": {
      description: "Reliable household staff and domestic service providers",
      icon: Users,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.green,
      type: "Domestic Staffing",
    },
    "Properties for Sale": {
      description: "Find and purchase the perfect property investment",
      icon: Building,
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.orange,
      type: "Properties For Sale",
    },
    "Rental Properties": {
      description: "Secure rental properties for long-term investments",
      icon: Home,
      image:
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.blue,
      type: "Rental Properties",
    },
    "Land Acquisition": {
      description: "Purchase land for development or investment purposes",
      icon: MapPin,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.green,
      type: "Land Acquisition",
    },
    "Property Management": {
      description: "Professional property maintenance and management services",
      icon: Building,
      image:
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.purple,
      type: "Property Management",
    },
    "School Fee Payments": {
      description: "Secure educational fee payments for students",
      icon: GraduationCap,
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.yellow,
      type: "School Fee Payments",
    },
    "Mortgage Services": {
      description: "Home financing and mortgage assistance services",
      icon: Banknote,
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.blue,
      type: "Mortgage Services",
    },
    "Banking Services": {
      description: "Complete banking solutions and financial services",
      icon: CreditCard,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.teal,
      type: "Banking Services",
    },
    "Rent Collection": {
      description:
        "Professional rent collection and property income management",
      icon: DollarSign,
      image:
        "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.green,
      type: "Rent Collection",
    },
    "Tech Supplies": {
      description: "Latest technology equipment and electronic supplies",
      icon: Smartphone,
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.blue,
      type: "Tech Supplies",
    },
    "Telecom Services": {
      description: "Telecommunications and internet connectivity services",
      icon: Phone,
      image:
        "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.purple,
      type: "Telecom Services",
    },
    "Construction Services": {
      description: "Professional construction and building services",
      icon: Hammer,
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.orange,
      type: "Construction Services",
    },
    "Hardware Suppliers": {
      description: "Quality hardware and construction material suppliers",
      icon: Wrench,
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.yellow,
      type: "Hardware Suppliers",
    },
    "Agricultural Services": {
      description: "Farming support and agricultural development services",
      icon: Wheat,
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.green,
      type: "Agricultural Services",
    },
    "Event Management": {
      description: "Professional event planning and management services",
      icon: Calendar,
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.purple,
      type: "Event Management",
    },
    "Health Insurance": {
      description: "Comprehensive health insurance and medical coverage",
      icon: Shield,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.teal,
      type: "Health Insurance",
    },
    "Money Transfer Services": {
      description: "Secure and fast money transfer services worldwide",
      icon: Send,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&auto=format&fit=crop&q=60",
      color: colors.accent.blue,
      type: "Money Transfer",
    },
    "Tours": {
      description: "Guided tours and travel experiences",
      icon: FaGlobe,
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.orange,
      type: "Travel & Leisure",
    },
  };

  // Use a much more lightweight animation approach instead of framer-motion
  const fadeInAnimation = "transition-all duration-500 ease-out";

  const getProcessedServices = () => {
    if (!frontEndServices || frontEndServices.length === 0) return [];

    return frontEndServices.map((service) => ({
      ...service,
      ...serviceMetadata[service],
      title: service,
      // Fallback values if service not found in metadata
      description:
        serviceMetadata[service]?.description ||
        "Professional services to support your needs",
      icon: serviceMetadata[service]?.icon || Star,
      image:
        serviceMetadata[service]?.image ||
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&auto=format&fit=crop&q=60",
      color: serviceMetadata[service]?.color || colors.accent.blue,
      type:
        serviceMetadata[service]?.type ||
        service.title.toLowerCase().replace(/\s+/g, "-"),
    }));
  };

  // Get first 3 services for the main section
  const getMainServices = () => {
    const processed = getProcessedServices();
    return processed.slice(0, 3);
  };

  // Get 5 services for the slider section (different from main section)
  const getSliderServices = () => {
    const processed = getProcessedServices();
    return processed.slice(3, 8); // Skip first 3 and take next 5
  };

  // State Management - using more performant approach
  const [slideIndex, setSlideIndex] = useState(0);
  const [width, setWidth] = useState(1200);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Track visible slides to optimize loading
  const visibleSlidesRef = useRef(new Set());

  const sliderServices = getSliderServices();

  // Functions for carousel
  const moveToSlide = (targetIndex) => {
    let newIndex = targetIndex;
    if (newIndex < 0) newIndex = sliderServices.length - 1;
    if (newIndex >= sliderServices.length) newIndex = 0;
    setSlideIndex(newIndex);

    // Pre-load adjacent slides
    updateVisibleSlides(newIndex);
  };

  const getVisibleSlides = () => {
    if (width > 1200) return 3;
    if (width > 768) return 2;
    return 1;
  };

  const getTransformPercentage = () => {
    const visibleSlides = getVisibleSlides();
    const slideWidth = 100 / visibleSlides;
    return slideIndex * slideWidth;
  };

  // Update tracking of visible slides to optimize image loading
  const updateVisibleSlides = (index) => {
    const visibleSet = new Set();
    const numVisible = getVisibleSlides();
    const buffer = 1; // Load 1 slide before and after visible slides

    // Add current slide and buffer slides to visible set
    for (let i = index - buffer; i <= index + numVisible - 1 + buffer; i++) {
      if (i >= 0 && i < sliderServices.length) {
        visibleSet.add(i);
      }
    }

    visibleSlidesRef.current = visibleSet;
  };

  // Effects - with performance optimizations
  useEffect(() => {
    // Only run client-side
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);

      // Initial visible slides setup
      updateVisibleSlides(slideIndex);

      // Debounced resize handler
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setWidth(window.innerWidth);
          updateVisibleSlides(slideIndex);
        }, 100);
      };

      window.addEventListener("resize", handleResize);

      // IntersectionObserver for lazy loading
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      const section = document.getElementById("categories-section");
      if (section) observer.observe(section);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);
        observer.disconnect();
      };
    }
  }, [slideIndex]);

  // Optimized autoplay with throttling
  useEffect(() => {
    let interval;
    if (autoplayEnabled && isInView && sliderServices.length > 0) {
      interval = setInterval(
        () => moveToSlide((slideIndex + 1) % sliderServices.length),
        5000
      );
    }
    return () => clearInterval(interval);
  }, [slideIndex, autoplayEnabled, sliderServices.length, isInView]);

  // Preload visible slides on initial load
  useEffect(() => {
    // Preload current and adjacent slides
    updateVisibleSlides(slideIndex);
  }, []);

  const mainServices = getMainServices();

  if (loading) {
    return (
      <div
        className="min-h-screen font-sans flex items-center justify-center"
        style={{ background: colors.neutral.offWhite }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (!loading && frontEndServices.length === 0) {
    return (
      <div
        className="flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 font-sans"
        style={{ background: colors.neutral.offWhite }}
      >
        <div className="text-center max-w-md bg-white rounded-3xl shadow-xl border border-red-100 p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-red-100 rounded-2xl mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M12 21C6.477 21 2 16.523 2 11S6.477 1 12 1s10 4.477 10 10-4.477 10-10 10z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Services Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn’t find any matching services at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: colors.neutral.offWhite }}
    >
      <section
        className="relative w-full md:mx-auto md:rounded-md md:w-[95%] py-16 px-4 mt-10 overflow-hidden"
        style={{ background: colors.neutral.black }}
      >
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-red-500 to-yellow-500 opacity-70 mix-blend-overlay"></div>
          {/* Simplified grid for better performance */}
          <div className="grid grid-cols-4 grid-rows-4 h-full w-full">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="border-[0.5px] border-white border-opacity-20"
              ></div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in`}
            >
              Your Bridge To{" "}
              <span style={{ color: colors.primary.light }}>Home</span>
            </h2>
            <p
              className={`text-lg max-w-xl mx-auto text-neutral-300 ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in-delay`}
            >
              Connect with verified service providers back home while living
              abroad. Send money, purchase goods, and support your loved
              ones—all from one secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden group ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in-stagger-${index}`}
                >
                  {/* Card Background with Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800"></div>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${service.color}40, transparent)`,
                    }}
                  ></div>

                  {/* Card Content */}
                  <div className="relative p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div
                        className="p-3 rounded-full"
                        style={{ background: `${service.color}30` }}
                      >
                        <IconComponent color={service.color} size={24} />
                      </div>

                      {index === 0 && (
                        <span
                          className="px-3 py-1 text-xs font-semibold rounded-full"
                          style={{
                            background: service.color,
                            color: colors.neutral.black,
                          }}
                        >
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white">
                      {service.title}
                    </h3>

                    <p className="mb-6 text-neutral-300 text-sm">
                      {service.description}
                    </p>

                    <Link to={`/providers/${service.type}`}>
                      <button
                        name={service.type}
                        className="inline-flex items-center text-center text-sm font-medium group cursor-pointer"
                        style={{ color: service.color }}
                      >
                        Explore Services
                        <span className="ml-2 transition-transform group-hover:translate-x-1">
                          <ChevronRight size={16} />
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section id="categories-section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div className="max-w-lg">
              <span
                className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in`}
                style={{
                  background: `${colors.primary.main}15`,
                  color: colors.primary.main,
                }}
              >
                GLOBAL MARKETPLACE
              </span>
              <h2
                className={`text-3xl md:text-4xl font-bold mb-4 tracking-tight ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in-delay`}
                style={{ color: colors.neutral.black }}
              >
                Support From Anywhere
              </h2>
              <p
                className={`text-neutral-600 ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in-delay-2`}
              >
                Browse our extensive range of services and connect with verified
                providers—all while ensuring your family receives exactly what
                they need.
              </p>
            </div>

            {sliderServices.length > 1 && (
              <div className="flex items-center space-x-2 mt-6 md:mt-0">
                <button
                  name="prev"
                  onClick={() =>
                    moveToSlide(
                      slideIndex > 0
                        ? slideIndex - 1
                        : sliderServices.length - 1
                    )
                  }
                  className="p-3 rounded-full hover:bg-neutral-100 transition-colors"
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={20} color={colors.neutral.black} />
                </button>
                <button
                  name="next"
                  onClick={() =>
                    moveToSlide((slideIndex + 1) % sliderServices.length)
                  }
                  className="p-3 rounded-full text-white transition-colors"
                  style={{ background: colors.primary.main }}
                  aria-label="Next slide"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Modern Horizontal Scrolling Cards with lazy loading */}
          {sliderServices.length > 0 && (
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${getTransformPercentage()}%)`,
                }}
              >
                {sliderServices.map((service, index) => (
                  <div
                    key={index}
                    className="px-3 flex-shrink-0"
                    style={{ width: `${100 / getVisibleSlides()}%` }}
                  >
                    <div className="h-full rounded-2xl overflow-hidden relative group shadow-lg hover:-translate-y-2 transition-all duration-300">
                      <Link
                        to={`/providers/${service.type}`}
                        className="cursor-pointer block h-72 relative"
                      >
                        <LazyImage
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: `linear-gradient(to top, ${service.color}90, transparent)`,
                          }}
                        ></div>

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">
                            {service.title}
                          </h3>
                          <p className="text-white text-opacity-90 mb-6 text-sm hidden group-hover:block transition-all">
                            {service.description}
                          </p>

                          <button
                            name={service.type}
                            className="px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                            style={{
                              background: service.color,
                              color: colors.neutral.black,
                            }}
                          >
                            Connect Now
                          </button>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Dots */}
              {sliderServices.length > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {sliderServices.map((_, index) => (
                    <button
                      key={index}
                      name={`dot-${index}`}
                      onClick={() => moveToSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        slideIndex === index ? "w-8" : "w-2"
                      }`}
                      style={{
                        background:
                          slideIndex === index
                            ? colors.primary.main
                            : colors.neutral.light,
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="pb-5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative">
            {/* Gradient background */}
            <div
              className="absolute inset-0"
              style={{ background: colors.primary.gradient }}
            ></div>

            {/* Simplified decorative patterns for better performance */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
            </div>

            {/* Content */}
            <div className="relative p-10 md:p-16 text-center">
              <h2
                className={`text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in`}
              >
                Support Your Loved Ones From Anywhere
              </h2>

              <p
                className={`text-lg max-w-2xl mx-auto mb-10 text-white text-opacity-90 ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in-delay`}
              >
                Join thousands of diasporans who provide for their families back
                home through our secure marketplace.
              </p>

              <div
                className={`flex flex-wrap justify-center gap-4 ${fadeInAnimation} opacity-0 translate-y-4 animate-fade-in-delay-2`}
              >
                <Link to="/signup">
                  <button
                    name="signup"
                    className="px-8 py-4 bg-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:translate-y-1"
                    style={{ color: colors.primary.main }}
                  >
                    Join Now
                  </button>
                </Link>
                <Link to="/contact-us">
                  <button
                    name="contact"
                    className="px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:bg-white/10 transition-all"
                    style={{
                      borderColor: colors.neutral.white,
                      color: colors.neutral.white,
                    }}
                  >
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animation without needing framer-motion */}
      <style>
        {`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.1s;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.2s;
        }
        
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.3s;
        }
        
        .animate-fade-in-stagger-0 {
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.1s;
        }
        
        .animate-fade-in-stagger-1 {
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.2s;
        }
        
        .animate-fade-in-stagger-2 {
          animation: fadeIn 0.5s forwards;
          animation-delay: 0.3s;
        }
      `}
      </style>
    </div>
  );
};

export default CategoriesAndServices;
