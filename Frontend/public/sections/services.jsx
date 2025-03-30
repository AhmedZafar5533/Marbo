import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  DollarSign,
  CheckCircle,
  TagIcon,
  SlidersHorizontal,
  ChevronDown,
  Heart,
   Stethoscope, BookOpen, Home, ShoppingBag, Building,

} from "lucide-react";
import { useServiceStore } from '../../../Store/servicesStore';
import LoadingSpinner from '../LoadingSpinner';
import { Link } from 'react-router-dom';



const PopularServices = () => {
  const services = [
    
    {
      title: "Medical Consultation",
      description: "Connect with qualified healthcare professionals for medical advice",
      icon: <Stethoscope className="w-6 h-6 text-emerald-600" />,
      color: "from-emerald-500 to-teal-500"
    },
    
    {
      title: "Home Renovation",
      description: "Transform your space with trusted home improvement specialists",
      icon: <Home className="w-6 h-6 text-amber-600" />,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Grocery Delivery",
      description: "Get fresh groceries delivered to your doorstep in no time",
      icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
      color: "from-green-500 to-lime-500"
    },

  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 inline-block text-transparent bg-clip-text mb-4">
            Popular Services
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Connect with qualified professionals and find the perfect solution for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <div className="p-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 mb-5 text-sm">
                  {service.description}
                </p>

                <a
                  href="#"
                  className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors group-hover:translate-x-1 duration-300"
                >
                  <span>Find providers</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



const ServicesCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  const services = [
    {
      id: 1,
      title: "Custom Artwork",
      category: "Art",
      description: "Bespoke paintings and handcrafted designs.",
      link: "https://plus.unsplash.com/premium_photo-1671527298459-cea23635bd5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwYXJ0d29yayUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      title: "Medical Consultation",
      category: "Health",
      description: "Expert medical advice and online consultations.",
      link: "https://plus.unsplash.com/premium_photo-1661769175296-fd6e9de8b0df?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Online Courses",
      category: "Education",
      description: "Learn new skills from expert instructors.",
      link: "https://images.unsplash.com/photo-1588912914074-b93851ff14b8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Home Renovation",
      category: "Construction",
      description: "High-quality home remodeling services.",
      link: "https://plus.unsplash.com/premium_photo-1682974931688-7e8859add0f8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      title: "Grocery Delivery",
      category: "Groceries",
      description: "Get your daily essentials delivered fast.",
      link: "https://plus.unsplash.com/premium_photo-1682144120790-1461fd602bc9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 6,
      title: "Property Listings",
      category: "Real Estate",
      description: "Find your dream home with ease.",
      link: "https://images.unsplash.com/photo-1498373419901-52eba931dc4f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

  // Get the list of services to display
  const displayServices = useMemo(() => {
    if (services.length <= 5) return services;
    return services.slice(0, 5);
  }, [services]);

  // Navigation functions
  const goToNext = () => {
    setActiveIndex((prevIndex) => {
      // Ensure we wrap correctly to the first slide without empty slide
      return (prevIndex + 1) % displayServices.length;
    });
  };

  const goToPrev = () => {
    setActiveIndex((prevIndex) => {
      return prevIndex === 0 ? displayServices.length - 1 : prevIndex - 1;
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
        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] text-left  "
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayServices.map((service, index) => {
          const meta = generateServiceMeta(service);
          const isActive = index === activeIndex;

          return (
            <div
              key={service.id}
              className={`absolute w-full h-full ${isActive ? 'opacity-100 z-10 visible' : 'opacity-0 invisible'
                } transition-opacity duration-1000 ease-in-out ${service.className || ''}`}
            >
              <div className="flex h-full relative">
                <div className="absolute inset-0 md:left-0 bottom-0 w-full md:w-[60%] lg:w-[45%] z-[5] p-4 md:p-6 lg:p-10 flex flex-col justify-end md:ml-10">
                  <div className="inline-block text-violet-400 text-xs md:text-sm font-bold mb-2 md:mb-3 uppercase tracking-wider bg-violet-950/50 py-1 px-3 rounded-full">
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
                      <span className="bg-purple-600/20 text-white py-1 px-2 rounded-md text-xs font-semibold border border-purple-600/30">
                        {meta.clientCount}+ clients
                      </span>
                    </div>
                    <div>
                      <span className="bg-pink-500/20 text-white py-1 px-2 rounded-md text-xs font-semibold border border-pink-500/30">
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
                    <button className="rounded-full py-2 md:py-3 px-4 md:px-6 lg:px-8 font-semibold text-sm md:text-base cursor-pointer flex items-center transition duration-300 bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-lg hover:shadow-xl hover:from-purple-800 hover:to-pink-700 hover:transform hover:-translate-y-0.5">
                      <span>Learn More</span>
                    </button>
                    <button className="rounded-full py-2 md:py-3 px-4 md:px-6 lg:px-8 font-semibold text-sm md:text-base cursor-pointer flex items-center transition duration-300 bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:transform hover:-translate-y-0.5 hover:shadow-lg backdrop-blur-sm">
                      Get a Quote <span className="ml-1 md:ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                </div>

                <div className="absolute inset-0 w-full h-full">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out w-full h-full after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-r after:from-slate-900/95 after:via-slate-900/85 after:to-slate-900/40 after:z-[1]"
                    style={{
                      backgroundImage: service.link
                        ? `url(${service.link})`
                        : `url(/api/placeholder/800/400?text=${encodeURIComponent(service.title)})`,
                      animation: isActive ? 'zoomIn 8s ease-out forwards' : 'none'
                    }}
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
              className="bg-black/30 text-white w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center cursor-pointer transition duration-300 hover:bg-purple-700 hover:scale-105 backdrop-blur-sm border border-white/10"
              onClick={goToPrev}
              aria-label="Previous service"
            >
              <span className="text-base lg:text-xl">←</span>
            </button>
            <button
              className="bg-black/30 text-white w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center cursor-pointer transition duration-300 hover:bg-purple-700 hover:scale-105 backdrop-blur-sm border border-white/10"
              onClick={goToNext}
              aria-label="Next service"
            >
              <span className="text-base lg:text-xl">→</span>
            </button>
          </div>
        )}



        {/* Indicator dots */}
        <div className="absolute left-1/2 bottom-4 -translate-x-1/2 flex flex-row gap-2 z-10">
          {displayServices.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${index === activeIndex
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 scale-125 shadow-lg shadow-purple-600/50'
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

  const [services, setServicesData] = useState([]);

  const { getAllServices, allServices, loading } = useServiceStore()

  // State for filters
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get unique categories
  const categories = [...new Set(services.map(service => service.category))];

  // Filter handlers
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    getAllServices()
  }, [])

  useEffect(() => {
    if (allServices.length > 0) {
      setServicesData(allServices)
    }
  }, [allServices])


  const toggleAvailability = (status) => {
    setSelectedAvailability(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Reset all filters
  const handleResetAll = () => {
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSelectedCategories([]);
    setSelectedAvailability([]);
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const priceMatch = service.price >= priceRange[0] && service.price <= priceRange[1];
    const ratingMatch = service.rating >= minRating;
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(service.category);
    const availabilityMatch = selectedAvailability.length === 0 || selectedAvailability.includes(service.status);

    return priceMatch && ratingMatch && categoryMatch && availabilityMatch;
  });

  if (loading)
    return <LoadingSpinner></LoadingSpinner>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 font-sans">
      <ServicesCarousel></ServicesCarousel>
      <PopularServices></PopularServices>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {services.length > 0 ? (

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">

            {/* Desktop Filters */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 sticky top-24 border border-indigo-100/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    Filters
                  </h2>
                  <button onClick={handleResetAll} className="text-indigo-700 text-xs font-semibold hover:text-purple-700 transition-colors py-1 px-3 bg-indigo-50 rounded-full">
                    Reset All
                  </button>
                </div>

                {/* Price Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <DollarSign size={16} className="mr-2 text-indigo-600" />
                    Price Range
                  </h3>
                  <div className="px-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-600 bg-indigo-50 px-2 py-1 rounded-md">${priceRange[0]}</span>
                      <span className="text-xs font-bold text-gray-600 bg-indigo-50 px-2 py-1 rounded-md">${priceRange[1]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-lg accent-indigo-700"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Star size={16} className="mr-2 text-indigo-600" />
                    Minimum Rating
                  </h3>
                  <div className="grid grid-cols-6 gap-1">
                    {[0, 1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`h-9 flex items-center justify-center rounded-lg transition-all ${minRating === rating
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {rating || 'All'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Clock size={16} className="mr-2 text-indigo-600" />
                    Availability
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['Available', 'Booked'].map(status => (
                      <button
                        key={status}
                        onClick={() => toggleAvailability(status)}
                        className={`p-2 border rounded-lg flex items-center justify-center text-sm ${selectedAvailability.includes(status)
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {status === 'Available' ? (
                          <CheckCircle size={14} className="mr-1 text-green-500" />
                        ) : (
                          <Clock size={14} className="mr-1 text-amber-500" />
                        )}
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories Filter */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <TagIcon size={16} className="mr-2 text-indigo-600" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`desktop-category-${index}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="h-5 w-5 rounded-md border-gray-300 text-indigo-700"
                        />
                        <label htmlFor={`desktop-category-${index}`} className="ml-3 text-sm text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="mt-6 lg:mt-0 lg:col-span-9">
              {/* Mobile Filters Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden w-full mb-6 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-md flex items-center justify-center"
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
              </button>

              {/* Mobile Filters Modal */}
              {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                  <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                  <div className="relative ml-auto w-full max-w-xs h-full bg-white p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                        Filters
                      </h2>
                      <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-500" />
                      </button>
                    </div>

                    {/* Mobile Filters Content */}
                    <div className="space-y-6">
                      {/* Price Filter */}
                      <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <DollarSign size={16} className="mr-2 text-indigo-600" />
                          Price Range
                        </h3>
                        <div className="px-2">
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-gray-600 bg-indigo-50 px-2 py-1 rounded-md">${priceRange[0]}</span>
                            <span className="text-xs font-bold text-gray-600 bg-indigo-50 px-2 py-1 rounded-md">${priceRange[1]}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="2000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full h-2 bg-gradient-to-r from-indigo-300 to-purple-300 accent-indigo-700"
                          />
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <Star size={16} className="mr-2 text-indigo-600" />
                          Minimum Rating
                        </h3>
                        <div className="grid grid-cols-6 gap-1">
                          {[0, 1, 2, 3, 4, 5].map(rating => (
                            <button
                              key={rating}
                              onClick={() => setMinRating(rating)}
                              className={`h-9 flex items-center justify-center rounded-lg ${minRating === rating
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                : 'bg-white border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                              {rating || 'All'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Availability Filter */}
                      <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <Clock size={16} className="mr-2 text-indigo-600" />
                          Availability
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {['Available', 'Booked'].map(status => (
                            <button
                              key={status}
                              onClick={() => toggleAvailability(status)}
                              className={`p-2 border rounded-lg flex items-center justify-center text-sm ${selectedAvailability.includes(status)
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Categories Filter */}
                      <div className="mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                          <TagIcon size={16} className="mr-2 text-indigo-600" />
                          Categories
                        </h3>
                        <div className="space-y-2">
                          {categories.map((category, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`mobile-category-${index}`}
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="h-5 w-5 rounded-md border-gray-300 text-indigo-700"
                              />
                              <label htmlFor={`mobile-category-${index}`} className="ml-3 text-sm text-gray-700">
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reset Button */}
                      <button
                        onClick={handleResetAll}
                        className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-white backdrop-blur-sm rounded-xl shadow-sm">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-indigo-700">{filteredServices.length}</span> services found
                  </p>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-white border border-indigo-100 rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                    <option>Most Popular</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Highest Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-50 group"
                  >
                    <div className="relative">
                      <img
                        src={service.image.url}
                        alt={service.serviceName}
                        className="h-48 w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex space-x-2">
                        <button className="bg-white p-2 rounded-full shadow-lg hover:bg-pink-50 transition-colors">
                          <Heart size={18} className="text-gray-400 hover:text-pink-500 transition-colors" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className={`font-medium text-xs inline-block px-3 py-1 rounded-full text-white bg-gradient-to-r from-green-500 to-emerald-500`
                          // ${service.status === 'Available'
                          //   ? 
                          // 'bg-gradient-to-r from-green-500 to-emerald-500'
                          //   : 'bg-gradient-to-r from-amber-500 to-orange-500'
                          //   }
                        }>
                          Available
                        </div>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                          {service.category}
                        </span>
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
                          <Star size={14} className="text-amber-500 fill-amber-500" />
                          <span className="ml-1 text-sm font-medium text-amber-700">4.9</span>
                          <span className="ml-1 text-xs text-amber-600">(123)</span>
                        </div>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-gray-900 line-clamp-1">{service.serviceName}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{service.description}</p>

                      {/* <div className="mt-4 flex items-center">
                      <div className="relative">
                        <img
                          src={service.vendor.image}
                          alt={service.vendor.name}
                          className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                        />
                      </div>
                      <span className="ml-2 text-xs font-medium text-gray-700">{service.vendor.name}</span>
                    </div> */}

                      <div className="mt-5 flex items-center justify-between">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-lg">
                          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                            ${service.price}
                          </span>
                        </div>
                        <Link to={`/view/${service._id}`} >
                          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center shadow-md hover:shadow-lg transition-all duration-300">
                            View Details
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No results
              {filteredServices.length === 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                  <div className="flex justify-center">
                    <FileSearch size={64} className="text-indigo-300" />
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-gray-800">No Results Found</h3>
                  <p className="text-gray-500 mt-2">No services match your current filters.</p>
                  <button className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300">
                    Clear Filters
                  </button>
                </div>
              )} */}

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg border border-indigo-600 text-white shadow-md">
                    1
                  </button>
                  <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm">
                    2
                  </button>
                  <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm">
                    3
                  </button>
                  <button className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 shadow-sm">
                    <ChevronRight size={16} />
                  </button>
                </nav>
              </div>
            </div>
          </div>

        ) : <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Services Found</h2>
            <p className="text-lg text-gray-600">
              We couldn’t find any services. Please try again later.
            </p>
          </div>
        </div>
        }
      </main >
    </div >
  );
};

export default ServiceMarketplace;