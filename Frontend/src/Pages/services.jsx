import React, { useState, useMemo, useRef, useEffect } from 'react';

// import { Link } from 'react-router-dom';


import {
  FaHeartbeat, FaShieldAlt, FaStore, FaTools, FaBuilding, FaHome,
  FaKey, FaTree, FaUmbrellaBeach, FaUserTie, FaCalendarCheck, FaLaptop, FaTractor,
  FaGraduationCap, FaBolt, FaTint, FaMoneyCheckAlt, FaMoneyBillWave, FaHandshake,
  FaPiggyBank, FaPhoneAlt, FaPalette, FaCouch, FaUsers, FaTshirt,
  FaBullhorn, FaShoppingBag, FaHotel, FaSearch, FaTimes, FaChevronRight, FaChevronLeft, FaChevronDown, FaHeadset



} from "react-icons/fa";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import 'swiper/css/pagination';



import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden h-full"
    >
      {/* Subtle gradient overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-red-400 to-red-600"
      />

      <div className="relative p-6 h-full flex flex-col">
        {/* Icon with improved styling */}
        <div className={`mb-5 w-16 h-16 rounded-xl flex items-center justify-center ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
          <span className="text-white text-2xl">
            {service.icon}
          </span>
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
            <span key={index} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
              {tag}
            </span>
          ))}
        </div>


        {/* CTA button with improved interaction */}
        <div className="mt-auto">
          <Link to={`/providers/${service.title}`}  >
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

const ServicesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  // Services data remains the same
  const services =
    [
      {
        name: "Home Services",

        services: [
          {
            title: "Groceries",
            url: '/home',
            description: "Authentic fresh produce sourced directly from local markets",
            icon: <FaStore className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["groceries", "local", "markets", "fresh", "produce"]
          },

          {
            title: "Interior Design",
            url: '/home',
            description: "Inspired home design and decoration services",
            icon: <FaCouch className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-orange-500",
            tags: ["interior", "design", "home", "decoration", "services"]
          },
          {
            title: "Domestic Staffing",
            url: '/home',
            description: "Verified house helps, cleaners, and domestic workers",
            icon: <FaUsers className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["domestic", "staffing", "house help", "cleaners", "workers"]
          }
        ]
      },
      {
        name: "Payments & Utilities",

        services: [
          {
            title: "Utility Payments",
            url: '/payments',
            description: "Pay electricity and water bills for your properties",
            icon: <FaBolt className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["utilities", "payments", "electricity", "water", "bills"]
          },
          {
            title: "Water Bill Payments",
            url: '/payments',
            description: "Convenient payment solutions for water services",
            icon: <FaTint className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-red-500",
            tags: ["water", "payments", "bills", "services", "convenience"]
          },
          {
            title: "School Fee Payments",
            url: '/payments',
            description: "Seamless school fee payments and support for students",
            icon: <FaGraduationCap className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-orange-500",
            tags: ["education", "school fees", "payments", "student support"]
          }
        ]
      },
      {
        name: "Lifestyle",

        services: [
          {
            title: "Traditional Clothing",
            url: '/lifestyle',
            description: "Authentic Gomesi, Kanzu, and cultural attire",
            icon: <FaTshirt className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["traditional", "clothing", "cultural", "attire"]
          },
          {
            title: "Holiday Lets",
            url: '/lifestyle',
            description: "Book vacation homes and short-term rentals",
            icon: <FaUmbrellaBeach className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-orange-400",
            tags: ["holiday", "vacation", "lets", "rentals", "short-term"]
          },
          {
            title: "Arts & Crafts",
            url: '/lifestyle',
            description: "Authentic handmade products and artifacts",
            icon: <FaPalette className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-red-500",
            tags: ["arts", "crafts", "handmade", "artifacts"]
          },
          {
            title: "Fashion Services",
            url: '/lifestyle',
            description: "Contemporary and traditional fashion",
            icon: <FaShoppingBag className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["fashion", "services", "traditional", "contemporary"]
          },
          {
            title: "Hotel Booking",
            url: '/lifestyle',
            description: "Premium accommodation options",
            icon: <FaHotel className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["hotel", "booking", "accommodation", "travel"]
          }
        ]
      },
      {
        name: "Health & Wellness",

        services: [
          {
            title: "Medical Care",
            url: '/health',
            description: "Access trusted medical professionals and healthcare facilities",
            icon: <FaHeartbeat className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["healthcare", "medical", "hospitals", "care"]
          },
          {
            title: "Health Insurance",
            url: '/health',
            description: "Secure health coverage plans from trusted providers back home",
            icon: <FaShieldAlt className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-red-500",
            tags: ["insurance", "health", "coverage", "plans", "protection"]
          }
        ]
      },
      {
        name: "Real Estate & Property",

        services: [
          {
            title: "Properties for Sale",
            url: '/real-estate',
            description: "Premium real estate listings",
            icon: <FaHome className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["real estate", "properties", "sale", "listings"]
          },
          {
            title: "Rental Properties",
            url: '/real-estate',
            description: "Find verified rental properties and rent-to-own options",
            icon: <FaKey className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["rental", "properties", "real estate", "rent-to-own", "leasing"]
          },
          {
            title: "Land Acquisition",
            url: '/real-estate',
            description: "Verified land listings with secure transaction support",
            icon: <FaTree className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-orange-500",
            tags: ["land", "acquisition", "real estate", "listings", "transactions"]
          },
          {
            title: "Property Management",
            url: '/real-estate',
            description: "Professional property maintenance and tenant management",
            icon: <FaUserTie className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["property", "management", "maintenance", "tenants", "services"]
          }
        ]
      },
      {
        name: "Financial Services",

        services: [
          {
            title: "Money Transfer Services",
            url: '/financial',
            description: "Get best rates for sending money internationally",
            icon: <FaMoneyBillWave className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["money", "transfer", "remittance", "services"]
          },
          {
            title: "Mortgage Services",
            url: '/financial',
            description: "Mortgage solutions for diaspora investors",
            icon: <FaHandshake className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["mortgage", "real estate", "finance", "investment", "services"]
          },
          {
            title: "Banking Services",
            url: '/financial',
            description: "Diaspora-focused banking solutions",
            icon: <FaPiggyBank className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-red-500",
            tags: ["banking", "finance", "services", "diaspora"]
          },
          {
            title: "Rent Collection",
            url: '/financial',
            description: "Secure and reliable rent collection services",
            icon: <FaMoneyCheckAlt className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-orange-500",
            tags: ["rent", "collection", "payments", "real estate", "services"]
          }
        ]
      },
      {
        name: "Technology & Communication",

        services: [
          {
            title: "Tech Supplies",
            url: '/technology',
            description: "Computers, phones, and telecom equipment from trusted vendors",
            icon: <FaLaptop className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["tech", "supplies", "computers", "phones", "telecom"]
          },
          {
            title: "Telecom Services",
            url: '/technology',
            description: "Mobile money and internet services",
            icon: <FaPhoneAlt className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["telecom", "mobile", "internet", "services"]
          }
        ]
      },
      {
        name: "Professional Services",

        services: [
          {
            title: "Construction Services",
            url: '/professional',
            description: "Connect with certified building professionals and contractors",
            icon: <FaBuilding className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-red-600",
            tags: ["construction", "building", "contractors", "services", "professionals"]
          },
          {
            title: "Hardware Suppliers",
            url: '/professional',
            description: "Source construction materials directly from trusted suppliers",
            icon: <FaTools className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-400 to-red-500",
            tags: ["hardware", "construction", "suppliers", "materials"]
          },
          {
            title: "Agricultural Services",
            url: '/professional',
            description: "Farming equipment and professional farm management",
            icon: <FaTractor className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-600 to-red-700",
            tags: ["agriculture", "farming", "equipment", "management", "farm"]
          },
          {
            title: "Event Management",
            url: '/professional',
            description: "Complete event planning including traditional Mikolo services",
            icon: <FaCalendarCheck className="w-8 h-8" />,
            color: "bg-gradient-to-br from-red-500 to-orange-500",
            tags: ["event", "management", "planning", "mikolo", "services"]
          },
         
        ]
      },
    ];

  const filteredServices = searchTerm
    ? services.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.services.some(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    : services;

  // Set first category as active by default
  useEffect(() => {
    if (filteredServices.length > 0 && activeCategory === null) {
      setActiveCategory(filteredServices[0].name);
    }
  }, [filteredServices, activeCategory]);

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
            Bridging Borders with{' '}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Trusted Services
            </span>
          </h2>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Connecting diasporans with a global network of trusted local services—empowering communities and enriching lives.
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
                  onClick={() => setSearchTerm('')}
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
            className="mb-12 overflow-x-auto pb-4 scrollbar-hide"
          >
            <div className="flex space-x-2 pb-2 min-w-max">
              {services.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category.name
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Services display with improved layout */}
        <div className="space-y-16">
          <AnimatePresence>
            {filteredServices.map((category, categoryIndex) => (
              <motion.section
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className={`scroll-mt-24 ${!searchTerm && activeCategory !== category.name ? 'hidden' : ''
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

                <div className="lg:hidden relative">
                  <Swiper
                    modules={[Navigation]} // Removed Pagination module
                    spaceBetween={16}
                    slidesPerView={1.2}
                    breakpoints={{
                      480: {
                        slidesPerView: 1.5,
                        spaceBetween: 16,
                      },
                      640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                      },
                      768: {
                        slidesPerView: 2.5,
                        spaceBetween: 24,
                      },
                    }}
                    className="px-2 pb-10"
                    navigation={{
                      nextEl: `.swiper-next-${categoryIndex}`,
                      prevEl: `.swiper-prev-${categoryIndex}`,
                    }}
                    grabCursor={true}
                    touchEventsTarget="container"
                    touchRatio={1.5}
                    touchAngle={45}
                    longSwipes={true}
                  >
                    {category.services.map((service, serviceIndex) => (
                      <SwiperSlide key={serviceIndex} className="!h-auto">
                        <ServiceCard
                          service={service}
                          categoryGradient={`bg-gradient-to-br from-red-500 to-red-600`}
                        />
                      </SwiperSlide>
                    ))}
                    {/* Custom navigation buttons */}
                    <div
                      className={`swiper-prev-${categoryIndex} absolute top-1/2 -translate-y-1/2 left-0 z-1 hidden md:block`}
                    >
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:bg-red-50 transition-colors">
                        <FaChevronLeft className="text-red-600 text-sm" />
                      </button>
                    </div>
                    <div
                      className={`swiper-next-${categoryIndex} absolute top-1/2 -translate-y-1/2 right-0 z-10 hidden md:block`}
                    >
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:bg-red-50 transition-colors">
                        <FaChevronRight className="text-red-600 text-sm" />
                      </button>
                    </div>
                  </Swiper>
                </div>


                {/* Desktop View - Grid layout */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <motion.div
                      key={serviceIndex}
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
        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm mt-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 text-red-400 mb-6">
              <FaSearch className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No matching services found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">Try different search terms or browse our service categories</p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              View All Services
            </button>
          </motion.div>
        )}

        {/* Added contact section at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 mt-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Become a Service Provider
              </h2>
              <p className="text-red-100 text-md">
                Join our platform and reach thousands of customers looking for your services.
              </p>
            </div>
            <a href='/signup' >
              <button className="bg-white cursor-pointer text-red-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm">
                Apply Now
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};





const ServicesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  // Use an object to track which slides have been loaded.
  const [loadedImages, setLoadedImages] = useState({ 0: true });
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const services = [
    {
      id: 1,
      title: "Custom Artwork",
      category: "Art",
      url: '/providers/lifestyle',
      description: "Bespoke paintings and handcrafted designs.",
      link: "https://plus.unsplash.com/premium_photo-1671527298459-cea23635bd5b?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Medical Consultation",
      url: '/providers/health',
      category: "Health",
      description: "Expert medical advice and online consultations.",
      link: "https://images.pexels.com/photos/5452232/pexels-photo-5452232.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    },
    {
      id: 4,
      title: "Home Renovation",
      url: '/providers/home',
      category: "Construction",
      description: "High-quality home remodeling services.",
      link: "https://images.pexels.com/photos/7092358/pexels-photo-7092358.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    },
    {
      id: 5,
      title: "Grocery Delivery",
      url: '/providers/home',
      category: "Groceries",
      description: "Get your daily essentials delivered fast.",
      link: "https://images.pexels.com/photos/7457217/pexels-photo-7457217.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    },
    {
      id: 6,
      title: "Property Listings",
      url: '/providers/real-estate',
      category: "Real Estate",
      description: "Find your dream home with ease.",
      link: "https://images.pexels.com/photos/7578890/pexels-photo-7578890.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2",
    },
  ];


  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initialize on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only display the first 5 services if more are present.
  const displayServices = useMemo(() => {
    if (services.length <= 5) return services;
    return services.slice(0, 5);
  }, [services]);

  // Navigation functions
  const goToNext = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % displayServices.length;
      return newIndex;
    });
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? displayServices.length - 1 : prevIndex - 1;
      return newIndex;
    });
  };

  // Auto-rotate the carousel with improved handling
  useEffect(() => {
    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        goToNext();
      }, 6000);
    };

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };

    startAutoPlay();

    // Reset the timer when activeIndex changes manually
    return () => stopAutoPlay();
  }, [displayServices.length, activeIndex]);

  // Mark the active slide as loaded whenever it changes.
  useEffect(() => {
    setLoadedImages((prev) => ({ ...prev, [activeIndex]: true }));
  }, [activeIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext();
    }
    if (touchEnd - touchStart > 50) {
      // Swipe right
      goToPrev();
    }
  };

  // Generate service metadata
  const generateServiceMeta = (service) => {
    return {
      category: service.category || "Consulting",
      duration: service.estimatedTime || "2-4 weeks",
      clientCount: service.clientCount || Math.floor(Math.random() * 500) + 100,
      satisfaction: service.satisfaction || Math.floor(Math.random() * 20) + 80
    };
  };

  return (
    <section className="w-full overflow-hidden relative bg-gradient-to-b from-slate-900 to-slate-800">
      <div
        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] text-left"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayServices.map((service, index) => {
          const meta = generateServiceMeta(service);
          const isActive = index === activeIndex;
          // Only apply the background image if this slide has been loaded.
          const backgroundStyle = loadedImages[index]
            ? {
              backgroundImage: service.link
                ? `url(${service.link})`
                : `url(/api/placeholder/800/400?text=${encodeURIComponent(service.title)})`,
              animation: isActive ? 'zoomIn 8s ease-out forwards' : 'none'
            }
            : {
              backgroundColor: '#333' // placeholder background color
            };

          return (
            <div
              key={service.id}
              className={`absolute w-full h-full ${isActive ? 'opacity-100 z-10 visible' : 'opacity-0 invisible'
                } transition-opacity duration-1000 ease-in-out ${service.className || ''}`}
            >
              <div className="flex h-full relative">
                <div className="absolute inset-0 md:left-0 bottom-6 w-full md:w-[60%] lg:w-[45%] z-[5] p-4 md:p-6 lg:p-10 flex flex-col justify-end md:ml-10">
                  <div className="inline-block text-red-400 text-xs md:text-sm font-bold mb-2 md:mb-3 uppercase tracking-wider bg-red-950/50 py-1 px-3 rounded-full">
                    Featured Service #{index + 1}
                  </div>

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-5 leading-tight text-white relative tracking-tight">
                    {service.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 md:gap-3 lg:gap-5 mb-4 md:mb-6 text-xs md:text-sm text-white">
                    <div className="flex items-center">
                      <span className="bg-white/10 py-1 px-2 rounded-md">{meta.category}</span>
                    </div>
                    <div className="bg-white/10 py-1 px-2 rounded-md">{meta.duration}</div>
                    <div>
                      <span className="bg-red-600/20 text-white py-1 px-2 rounded-md text-xs font-semibold border border-red-600/30">
                        {meta.clientCount}+ clients
                      </span>
                    </div>
                    <div>
                      <span className="bg-red-500/20 text-white py-1 px-2 rounded-md text-xs font-semibold border border-red-500/30">
                        {meta.satisfaction}% satisfaction
                      </span>
                    </div>
                  </div>

                  <p className="mb-4 md:mb-6 lg:mb-8 leading-6 md:leading-7 text-white/90 max-w-full md:max-w-[95%] text-sm md:text-base overflow-hidden line-clamp-2 md:line-clamp-3 bg-black/30 p-2 md:p-3 rounded-lg backdrop-blur-sm">
                    {service.description.length > 180
                      ? `${service.description.substring(0, 180)}...`
                      : service.description}
                  </p>

                  <div className="flex gap-2 md:gap-3 lg:gap-5 mt-2 md:mt-4">
                    <Link to={`${service.url}`}>
                      <button className="rounded-full py-2 md:py-3 px-4 md:px-6 lg:px-8 font-semibold text-sm md:text-base cursor-pointer flex items-center transition duration-300 bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:transform hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
                        Get a Quote <span className="ml-1 md:ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>

                      </button>
                    </Link>
                  </div>
                </div>

                <div className="absolute inset-0 w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out w-full h-full after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-slate-900/95 after:via-slate-900/85 after:to-slate-900/40 after:z-[1]"
                    style={backgroundStyle}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation buttons - show only on tablet/desktop */}
        {!isMobile && (
          <div className="absolute z-20 w-full flex justify-between top-1/2 -translate-y-1/2 px-4">
            <button
              className="bg-black/30 text-white w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center cursor-pointer transition duration-300 hover:bg-red-700 hover:scale-105 backdrop-blur-sm border border-white/10"
              onClick={goToPrev}
              aria-label="Previous service"
            >
              <span className="text-base lg:text-xl">←</span>
            </button>
            <button
              className="bg-black/30 text-white w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center cursor-pointer transition duration-300 hover:bg-red-700 hover:scale-105 backdrop-blur-sm border border-white/10"
              onClick={goToNext}
              aria-label="Next service"
            >
              <span className="text-base lg:text-xl">→</span>
            </button>
          </div>
        )}
        {/*Indicator dots */}
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex flex-row gap-2 z-10">
          {displayServices.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${index === activeIndex
                ? 'bg-gradient-to-r from-red-600 to-orange-500 scale-125 shadow-lg shadow-red-600/50'
                : 'bg-white/20'
                } border-none cursor-pointer`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to service ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes zoomIn {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
      `}</style>
    </section>
  );
};


const ServiceMarketplace = () => {
  return (
    <>
      <ServicesCarousel></ServicesCarousel>

      <ServicesSection></ServicesSection>
    </>
  )
}

export default ServiceMarketplace;