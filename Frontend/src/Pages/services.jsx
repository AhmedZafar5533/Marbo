import React, { useState, useMemo, useRef, useEffect } from "react";

import {
  FaHeartbeat,
  FaShieldAlt,
  FaStore,
  FaTools,
  FaBuilding,
  FaHome,
  FaKey,
  FaTree,
  FaUmbrellaBeach,
  FaUserTie,
  FaCalendarCheck,
  FaLaptop,
  FaTractor,
  FaGraduationCap,
  FaBolt,
  FaTint,
  FaMoneyCheckAlt,
  FaMoneyBillWave,
  FaHandshake,
  FaPiggyBank,
  FaPhoneAlt,
  FaPalette,
  FaCouch,
  FaUsers,
  FaTshirt,
  FaShoppingBag,
  FaHotel,
  FaSearch,
  FaTimes,
  FaChevronRight,
} from "react-icons/fa";
import {
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
  DollarSign,
  Smartphone,
  Phone,
  Hammer,
  Wrench,
  Wheat,
  Calendar,
  Shield,
  Send,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import "swiper/css/pagination";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { useServiceStore } from "../../Store/servicesStore";
import LoadingSpinner from "../components/LoadingSpinner";

const services = [
  {
    name: "Home Services",

    services: [
      {
        title: "Groceries",
        url: "/home",
        description:
          "Authentic fresh produce sourced directly from local markets",
        icon: <FaStore className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["groceries", "local", "markets", "fresh", "produce"],
      },

      {
        title: "Interior Design",
        url: "/home",
        description: "Inspired home design and decoration services",
        icon: <FaCouch className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-orange-500",
        tags: ["interior", "design", "home", "decoration", "services"],
      },
      {
        title: "Domestic Staffing",
        url: "/home",
        description: "Verified house helps, cleaners, and domestic workers",
        icon: <FaUsers className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["domestic", "staffing", "house help", "cleaners", "workers"],
      },
    ],
  },
  {
    name: "Payments & Utilities",

    services: [
      {
        title: "Utility Payments",
        url: "/payments",
        description: "Pay electricity and water bills for your properties",
        icon: <FaBolt className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["utilities", "payments", "electricity", "water", "bills"],
      },
      {
        title: "Water Bill Payments",
        url: "/payments",
        description: "Convenient payment solutions for water services",
        icon: <FaTint className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-red-500",
        tags: ["water", "payments", "bills", "services", "convenience"],
      },
      {
        title: "School Fee Payments",
        url: "/payments",
        description: "Seamless school fee payments and support for students",
        icon: <FaGraduationCap className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-orange-500",
        tags: ["education", "school fees", "payments", "student support"],
      },
    ],
  },
  {
    name: "Lifestyle",

    services: [
      {
        title: "Traditional Clothing",
        url: "/lifestyle",
        description: "Authentic Gomesi, Kanzu, and cultural attire",
        icon: <FaTshirt className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["traditional", "clothing", "cultural", "attire"],
      },
      {
        title: "Holiday Lets",
        url: "/lifestyle",
        description: "Book vacation homes and short-term rentals",
        icon: <FaUmbrellaBeach className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-orange-400",
        tags: ["holiday", "vacation", "lets", "rentals", "short-term"],
      },
      {
        title: "Arts & Crafts",
        url: "/lifestyle",
        description: "Authentic handmade products and artifacts",
        icon: <FaPalette className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-red-500",
        tags: ["arts", "crafts", "handmade", "artifacts"],
      },
      {
        title: "Fashion Services",
        url: "/lifestyle",
        description: "Contemporary and traditional fashion",
        icon: <FaShoppingBag className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["fashion", "services", "traditional", "contemporary"],
      },
      {
        title: "Hotel Booking",
        url: "/lifestyle",
        description: "Premium accommodation options",
        icon: <FaHotel className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["hotel", "booking", "accommodation", "travel"],
      },
    ],
  },
  {
    name: "Health & Wellness",

    services: [
      {
        title: "Medical Care",
        url: "/health",
        description:
          "Access trusted medical professionals and healthcare facilities",
        icon: <FaHeartbeat className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["healthcare", "medical", "hospitals", "care"],
      },
      {
        title: "Health Insurance",
        url: "/health",
        description:
          "Secure health coverage plans from trusted providers back home",
        icon: <FaShieldAlt className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-red-500",
        tags: ["insurance", "health", "coverage", "plans", "protection"],
      },
    ],
  },
  {
    name: "Real Estate & Property",

    services: [
      {
        title: "Properties for Sale",
        url: "/real-estate",
        description: "Premium real estate listings",
        icon: <FaHome className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["real estate", "properties", "sale", "listings"],
      },
      {
        title: "Rental Properties",
        url: "/real-estate",
        description: "Find verified rental properties and rent-to-own options",
        icon: <FaKey className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["rental", "properties", "real estate", "rent-to-own", "leasing"],
      },
      {
        title: "Land Acquisition",
        url: "/real-estate",
        description: "Verified land listings with secure transaction support",
        icon: <FaTree className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-orange-500",
        tags: [
          "land",
          "acquisition",
          "real estate",
          "listings",
          "transactions",
        ],
      },
      {
        title: "Property Management",
        url: "/real-estate",
        description: "Professional property maintenance and tenant management",
        icon: <FaUserTie className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["property", "management", "maintenance", "tenants", "services"],
      },
    ],
  },
  {
    name: "Financial Services",

    services: [
      {
        title: "Money Transfer Services",
        url: "/financial",
        description: "Get best rates for sending money internationally",
        icon: <FaMoneyBillWave className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["money", "transfer", "remittance", "services"],
      },
      {
        title: "Mortgage Services",
        url: "/financial",
        description: "Mortgage solutions for diaspora investors",
        icon: <FaHandshake className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["mortgage", "real estate", "finance", "investment", "services"],
      },
      {
        title: "Banking Services",
        url: "/financial",
        description: "Diaspora-focused banking solutions",
        icon: <FaPiggyBank className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-red-500",
        tags: ["banking", "finance", "services", "diaspora"],
      },
      {
        title: "Rent Collection",
        url: "/financial",
        description: "Secure and reliable rent collection services",
        icon: <FaMoneyCheckAlt className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-orange-500",
        tags: ["rent", "collection", "payments", "real estate", "services"],
      },
    ],
  },
  {
    name: "Technology & Communication",

    services: [
      {
        title: "Tech Supplies",
        url: "/technology",
        description:
          "Computers, phones, and telecom equipment from trusted vendors",
        icon: <FaLaptop className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: ["tech", "supplies", "computers", "phones", "telecom"],
      },
      {
        title: "Telecom Services",
        url: "/technology",
        description: "Mobile money and internet services",
        icon: <FaPhoneAlt className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["telecom", "mobile", "internet", "services"],
      },
    ],
  },
  {
    name: "Professional Services",

    services: [
      {
        title: "Construction Services",
        url: "/professional",
        description:
          "Connect with certified building professionals and contractors",
        icon: <FaBuilding className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-red-600",
        tags: [
          "construction",
          "building",
          "contractors",
          "services",
          "professionals",
        ],
      },
      {
        title: "Hardware Suppliers",
        url: "/professional",
        description:
          "Source construction materials directly from trusted suppliers",
        icon: <FaTools className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-400 to-red-500",
        tags: ["hardware", "construction", "suppliers", "materials"],
      },
      {
        title: "Agricultural Services",
        url: "/professional",
        description: "Farming equipment and professional farm management",
        icon: <FaTractor className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-600 to-red-700",
        tags: ["agriculture", "farming", "equipment", "management", "farm"],
      },
      {
        title: "Event Management",
        url: "/professional",
        description:
          "Complete event planning including traditional Mikolo services",
        icon: <FaCalendarCheck className="w-8 h-8" />,
        color: "bg-gradient-to-br from-red-500 to-orange-500",
        tags: ["event", "management", "planning", "mikolo", "services"],
      },
    ],
  },
];

const ServiceCard = ({ service }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden h-full"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-red-400 to-red-600" />

      <div className="relative p-6 h-full flex flex-col">
        {/* Icon with improved styling */}
        <div
          className={`mb-5 w-16 h-16 rounded-xl flex items-center justify-center ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}
        >
          <span className="text-white text-2xl">{service.icon}</span>
        </div>

        {/* Title with improved spacing */}
        <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-red-600 transition-colors duration-300">
          {service.title}
        </h4>

        {/* Description with better readability */}
        <p className="text-slate-600 mb-5 flex-1 text-sm leading-relaxed">
          {service.description}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA button with improved interaction */}
        <div className="mt-auto">
          <Link to={`/providers/${service.title}`}>
            <button className="inline-flex items-center cursor-pointer text-red-600 hover:text-red-800 font-medium transition-all group/cta">
              <span className="border-b border-transparent group-hover/cta:border-red-600 transition-all">
                View Providers
              </span>
              <FaChevronRight className="ml-2 w-3 h-3 transition-transform group-hover/cta:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ServicesSection = ({ frontEndServices }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredServices = useMemo(() => {
    if (!Array.isArray(frontEndServices) || frontEndServices.length === 0) {
      return [];
    }

    return services
      .map((category) => {
        const filteredCategoryServices = category.services.filter((service) =>
          frontEndServices.some(
            (fetchedService) => fetchedService === service.title
          )
        );

        return {
          ...category,
          services: filteredCategoryServices,
        };
      })
      .filter((category) => category.services.length > 0); // Only return categories with services
  }, [frontEndServices]);

  useEffect(() => {
    if (filteredServices.length > 0 && activeCategory === null) {
      setActiveCategory(filteredServices[0].name);
    } else if (
      activeCategory &&
      !filteredServices.some((cat) => cat.name === activeCategory)
    ) {
      setActiveCategory(
        filteredServices.length > 0 ? filteredServices[0].name : null
      );
    }
  }, [filteredServices, activeCategory]);

  // Additional search functionality
  const searchFilteredServices = useMemo(() => {
    if (!searchTerm.trim()) return filteredServices;

    return filteredServices
      .map((category) => ({
        ...category,
        services: category.services.filter(
          (service) =>
            service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            service.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        ),
      }))
      .filter((category) => category.services.length > 0);
  }, [filteredServices, searchTerm]);

  const displayServices = searchTerm
    ? searchFilteredServices
    : filteredServices;

  return (
    <div className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-br from-slate-50 via-red-50/20 to-orange-50/20">
      {/* Improved background pattern */}
      <div className="absolute inset-0 bg-[url('/svg/grid.svg')] bg-center opacity-40 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="w-[90%] mx-auto  lg:px-8 relative z-10">
        {/* Header section with improved animation sequence */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-red-100 text-red-700 mb-4 shadow-sm"
          >
            Our Services
          </motion.span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Bridging Borders with{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Trusted Services
            </span>
          </h2>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Connecting diasporans with a global network of trusted local
            services—empowering communities and enriching lives.
          </p>

          {/* Improved search component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="max-w-xl mx-auto mt-8 lg:mt-10"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search services or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl pl-12 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-base placeholder-gray-400 transition-all"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Category tabs - show all categories at once with improved scrolling */}
        {!searchTerm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mb-12 overflow-x-auto pb-4 scrollbar-hide no-scrollbar"
          >
            <div className="flex space-x-2 pb-2 min-w-max">
              {filteredServices.map((category, index) =>
                category.services.length > 0 ? (
                  <button
                    key={index}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === category.name
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-white text-slate-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {category.name}
                  </button>
                ) : null
              )}
            </div>
          </motion.div>
        )}

        {/* Services display with improved layout */}
        <div className="space-y-16">
          <AnimatePresence>
            {displayServices.map((category, categoryIndex) => (
              <motion.section
                key={`${category.name}-${categoryIndex}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className={`scroll-mt-24 ${
                  !searchTerm && activeCategory !== category.name
                    ? "hidden"
                    : ""
                }`}
              >
                {/* Improved category header */}
                <div className="mb-8 flex items-center">
                  <div className="h-10 w-1.5 bg-gradient-to-br from-red-500 to-red-600 rounded-r mr-4" />
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
                    {category.name}
                  </h3>
                  <div className="ml-4 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {category.services.length} services
                  </div>
                </div>

                {/* Mobile & Tablet View - Enhanced Swiper with touch swiping */}
                {/* ... Swiper implementation here */}

                {/* Desktop View - Grid layout */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <motion.div
                      key={`${service.title}-${serviceIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: serviceIndex * 0.05 }}
                    >
                      <ServiceCard
                        service={service}
                        categoryGradient={`bg-gradient-to-br from-red-500 to-red-600`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Mobile/Tablet View - Show grid here too for now */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <motion.div
                      key={`mobile-${service.title}-${serviceIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: serviceIndex * 0.05 }}
                    >
                      <ServiceCard
                        service={service}
                        categoryGradient={`bg-gradient-to-br from-red-500 to-red-600`}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state with improved visual */}
        {displayServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm mt-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-400 mb-6">
              <FaSearch className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {searchTerm
                ? "No matching services found"
                : "No services available"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchTerm
                ? "Try different search terms or browse our service categories"
                : "Services are currently being loaded or unavailable"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                View All Services
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ServicesCarousel = ({ frontEndServices = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [loadedImages, setLoadedImages] = useState({ 0: true });
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const colors = {
    accent: {
      green: "#10B981",
      blue: "#3B82F6",
      teal: "#14B8A6",
      purple: "#8B5CF6",
      yellow: "#F59E0B",
      orange: "#F97316",
    },
  };

  const serviceMetadata = {
    Groceries: {
      description:
        "Fresh food and essential supplies delivered to your loved ones",
      icon: ShoppingCart,
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.green,
      category: "Food & Essentials",
    },
    "Utility Payments": {
      description: "Pay electricity, gas, and other utility bills securely",
      icon: CreditCard,
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.blue,
      category: "Financial Services",
    },
    "Water Bill Payments": {
      description: "Keep water services running with timely bill payments",
      icon: Droplets,
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.teal,
      category: "Utility Services",
    },
    "Interior Design": {
      description: "Transform living spaces with professional interior design",
      icon: PaintBucket,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.purple,
      category: "Design & Lifestyle",
    },
    "Traditional Clothing": {
      description: "Authentic cultural attire and traditional garments",
      icon: Shirt,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.yellow,
      category: "Fashion & Culture",
    },
    "Holiday Lets": {
      description: "Comfortable vacation rentals and holiday accommodations",
      icon: Home,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.orange,
      category: "Travel & Accommodation",
    },
    "Arts & Crafts": {
      description: "Handmade crafts with local artistry and cultural heritage",
      icon: Palette,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.yellow,
      category: "Creative Services",
    },
    "Fashion Services": {
      description: "Custom tailoring and fashion design services",
      icon: Camera,
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.purple,
      category: "Fashion & Design",
    },
    "Hotel Booking": {
      description: "Comfortable accommodations and hotel reservations",
      icon: Bed,
      image:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.blue,
      category: "Hospitality",
    },
    "Medical Care": {
      description: "Quality healthcare services and medical consultations",
      icon: Heart,
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.teal,
      category: "Healthcare",
    },
    "Domestic Staffing": {
      description: "Reliable household staff and domestic service providers",
      icon: Users,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.green,
      category: "Home Services",
    },
    "Properties for Sale": {
      description: "Find and purchase the perfect property investment",
      icon: Building,
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.orange,
      category: "Real Estate",
    },
    "Rental Properties": {
      description: "Secure rental properties for long-term investments",
      icon: Home,
      image:
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.blue,
      category: "Property Investment",
    },
    "Land Acquisition": {
      description: "Purchase land for development or investment purposes",
      icon: MapPin,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.green,
      category: "Land & Development",
    },
    "Property Management": {
      description: "Professional property maintenance and management services",
      icon: Building,
      image:
        "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.purple,
      category: "Property Services",
    },
    "School Fee Payments": {
      description: "Secure educational fee payments for students",
      icon: GraduationCap,
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.yellow,
      category: "Education",
    },
    "Mortgage Services": {
      description: "Home financing and mortgage assistance services",
      icon: Banknote,
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.blue,
      category: "Financial Services",
    },
    "Banking Services": {
      description: "Complete banking solutions and financial services",
      icon: CreditCard,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.teal,
      category: "Banking",
    },
    "Rent Collection": {
      description:
        "Professional rent collection and property income management",
      icon: DollarSign,
      image:
        "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.green,
      category: "Property Management",
    },
    "Tech Supplies": {
      description: "Latest technology equipment and electronic supplies",
      icon: Smartphone,
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.blue,
      category: "Technology",
    },
    "Telecom Services": {
      description: "Telecommunications and internet connectivity services",
      icon: Phone,
      image:
        "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.purple,
      category: "Communications",
    },
    "Construction Services": {
      description: "Professional construction and building services",
      icon: Hammer,
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.orange,
      category: "Construction",
    },
    "Hardware Suppliers": {
      description: "Quality hardware and construction material suppliers",
      icon: Wrench,
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.yellow,
      category: "Construction Supplies",
    },
    "Agricultural Services": {
      description: "Farming support and agricultural development services",
      icon: Wheat,
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.green,
      category: "Agriculture",
    },
    "Event Management": {
      description: "Professional event planning and management services",
      icon: Calendar,
      image:
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.purple,
      category: "Events & Planning",
    },
    "Health Insurance": {
      description: "Comprehensive health insurance and medical coverage",
      icon: Shield,
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.teal,
      category: "Insurance",
    },
    "Money Transfer Services": {
      description: "Secure and fast money transfer services worldwide",
      icon: Send,
      image:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80",
      color: colors.accent.blue,
      category: "Financial Services",
    },
  };

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Process services from backend with metadata
  const processedServices = useMemo(() => {
    if (!frontEndServices || frontEndServices.length === 0) return [];

    return frontEndServices.slice(0, 5).map((serviceName, index) => {
      const metadata = serviceMetadata[serviceName] || {
        description: `Professional ${serviceName.toLowerCase()} services`,
        icon: Building,
        image: `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&auto=format&fit=crop&q=80`,
        color: colors.accent.blue,
        category: "Professional Services",
      };

      return {
        id: index + 1,
        title: serviceName,
        ...metadata,
        url: `/providers/${serviceName}`,
      };
    });
  }, [frontEndServices]);

  // Navigation functions
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % processedServices.length);
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? processedServices.length - 1 : prevIndex - 1
    );
  };

  // Auto-rotate the carousel
  useEffect(() => {
    if (processedServices.length === 0) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(goToNext, 6000);
    };

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };

    startAutoPlay();
    return () => stopAutoPlay();
  }, [processedServices.length, activeIndex]);

  // Mark images as loaded
  useEffect(() => {
    setLoadedImages((prev) => ({ ...prev, [activeIndex]: true }));
  }, [activeIndex]);

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      goToNext();
    }
    if (touchEnd - touchStart > 50) {
      goToPrev();
    }
  };

  if (!processedServices || processedServices.length === 0) {
    return (
      <section className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl md:text-3xl font-bold mb-4">
            No Services Available
          </div>
          <p className="text-white/70">
            Services will appear here once loaded.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full overflow-hidden relative bg-gradient-to-b from-slate-900 to-slate-800">
      <div
        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] text-left"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {processedServices.map((service, index) => {
          const IconComponent = service.icon;
          const isActive = index === activeIndex;

          const backgroundStyle = loadedImages[index]
            ? {
                backgroundImage: `url(${service.image})`,
                animation: isActive ? "zoomIn 8s ease-out forwards" : "none",
              }
            : {
                backgroundColor: service.color || "#334155",
              };

          return (
            <div
              key={service.id}
              className={`absolute w-full h-full ${
                isActive ? "opacity-100 z-10 visible" : "opacity-0 invisible"
              } transition-opacity duration-1000 ease-in-out`}
            >
              <div className="flex h-full relative">
                <div className="absolute inset-0 md:left-0 bottom-6 w-full md:w-[60%] lg:w-[50%] z-[5] p-4 md:p-6 lg:p-10 flex flex-col justify-end md:ml-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 text-xs md:text-sm font-medium uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-white relative tracking-tight">
                    {service.title}
                  </h2>

                  <p className="mb-6 md:mb-8 leading-7 md:leading-8 text-white/90 max-w-full md:max-w-[95%] text-base md:text-lg bg-black/20 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    {service.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button
                      className="group rounded-full py-3 md:py-4 px-6 md:px-8 font-semibold text-sm md:text-base cursor-pointer flex items-center justify-center transition-all duration-300 bg-white text-slate-900 hover:bg-white/90 hover:transform hover:-translate-y-1 hover:shadow-2xl shadow-lg min-w-[160px]"
                      style={{ boxShadow: `0 10px 30px ${service.color}20` }}
                      onClick={() => (window.location.href = service.url)}
                    >
                      Browse Providers
                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out w-full h-full after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-slate-900/95 after:via-slate-900/80 after:to-slate-900/30 after:z-[1]"
                    style={backgroundStyle}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation buttons */}
        {!isMobile && processedServices.length > 1 && (
          <div className="absolute z-20 w-full flex justify-between top-1/2 -translate-y-1/2 px-4">
            <button
              className="bg-black/20 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-110 backdrop-blur-sm border border-white/20 shadow-lg"
              onClick={goToPrev}
              aria-label="Previous service"
            >
              <span className="text-lg lg:text-xl">←</span>
            </button>
            <button
              className="bg-black/20 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/20 hover:scale-110 backdrop-blur-sm border border-white/20 shadow-lg"
              onClick={goToNext}
              aria-label="Next service"
            >
              <span className="text-lg lg:text-xl">→</span>
            </button>
          </div>
        )}

        {/* Indicator dots */}
        {processedServices.length > 1 && (
          <div className="absolute left-1/2 bottom-3 -translate-x-1/2 flex flex-row gap-3 z-10">
            {processedServices.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-white scale-125 shadow-lg shadow-white/30"
                    : "bg-white/30 hover:bg-white/50"
                } border-none cursor-pointer`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to service ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
};

const ServiceMarketplace = () => {
  const { frontEndServices, loading } = useServiceStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ServicesCarousel frontEndServices={frontEndServices}></ServicesCarousel>
      <ServicesSection frontEndServices={frontEndServices}></ServicesSection>
    </>
  );
};

export default ServiceMarketplace;
