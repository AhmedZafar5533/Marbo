import React, { useState, useEffect, useMemo, useRef } from "react";


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
        className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] text-left"
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

// Main ServicesPage Component
const ServicesPage = () => {
  // Sample services data (would typically come from props or API)
  const services = [
    {
      id: 1,
      title: "Strategic Consulting",
      description: "Expert guidance to help your business navigate challenges and achieve sustainable growth through strategic planning and execution.",
      category: "Business",
      icon: "triangle",
      link: "/services/consulting",
      estimatedTime: "4-6 weeks",
      clientCount: 345,
      satisfaction: 95
    },
    {
      id: 2,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing solutions to boost your online presence, reach your target audience, and drive conversions.",
      category: "Marketing",
      icon: "download",
      link: "/services/marketing",
      estimatedTime: "3-5 weeks",
      clientCount: 520,
      satisfaction: 92
    },
    {
      id: 3,
      title: "Web Development",
      description: "Custom web development services to create responsive, user-friendly websites that represent your brand and meet your business needs.",
      category: "Technology",
      icon: "calendar",
      link: "/services/web-development",
      estimatedTime: "6-8 weeks",
      clientCount: 430,
      satisfaction: 97
    },
    {
      id: 4,
      title: "Product Design",
      description: "Innovative product design services that blend aesthetics with functionality to create products that stand out in the market.",
      category: "Design",
      icon: "home",
      link: "/services/product-design",
      estimatedTime: "5-7 weeks",
      clientCount: 280,
      satisfaction: 94
    },
    {
      id: 5,
      title: "E-commerce Solutions",
      description: "End-to-end e-commerce solutions to help you set up, manage, and grow your online store with ease and efficiency.",
      category: "Retail",
      icon: "shopping-cart",
      link: "/services/ecommerce",
      estimatedTime: "4-6 weeks",
      clientCount: 315,
      satisfaction: 93
    }
  ];

  // Function to render the appropriate icon based on the icon name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "triangle":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          </svg>
        );
      case "download":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        );
      case "calendar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      case "home":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        );
      case "shopping-cart":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <ServicesCarousel services={services} />
      </header>

      <section className="bg-white py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-8 relative">
              Building Bridges
              <br />
              Between You And
              <br />
              Customers
              <div className="absolute bottom-[-20px] left-0 w-20 h-1 bg-gradient-to-r from-purple-800 to-pink-500 rounded-full" />
            </h1>
            <p className="text-slate-600 text-xl mb-12">
              Business ideas at the right price. Challenge everything. Keeping
              advertising standards high. Research based advertising for the bulls.
            </p>
            <div className="flex items-center gap-8">
              <button className="bg-gradient-to-r from-purple-800 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow">
                Get Started
              </button>
              <div className="flex items-center gap-5">
                <p className="text-slate-600 text-sm">
                  Manage your business.
                  <br />
                  The professional way.
                </p>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="/api/placeholder/600/500"
              alt="Business Services"
              className="rounded-xl shadow-xl relative z-10"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-70 z-0"></div>
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-70 z-0"></div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We offer a comprehensive range of services designed to help your business grow and succeed in today's competitive marketplace.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 flex flex-col"
              >
                <div className="w-12 h-12 text-purple-600 mb-6">
                  {renderIcon(service.icon)}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                <p className="text-slate-600 mb-6 flex-grow">{service.description}</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {service.estimatedTime}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {service.satisfaction}% satisfaction
                  </span>
                </div>
                <a
                  href={service.link}
                  className="text-purple-600 font-semibold flex items-center hover:text-purple-800 transition-colors"
                >
                  Learn more <span className="ml-2">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-slate-900 to-purple-900 py-24 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your business?</h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            Get in touch with our team of experts today and discover how we can help you achieve your business goals.
          </p>
          <div className="flex justify-center gap-6">
            <button className="bg-white text-purple-900 px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-shadow">
              Schedule a Consultation
            </button>
            <button className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors">
              View All Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServicesPage;