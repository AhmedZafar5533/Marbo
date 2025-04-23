import React, { useState, useEffect, useRef } from "react";

// ServicesCarousel Component with improved transitions
const ServicesCarousel = ({ services = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Use the provided services or fall back to default services
  const carouselServices = services.length > 0 ? services : [
    {
      id: 1,
      title: "Custom Artwork",
      category: "Art",
      description: "Bespoke paintings and handcrafted designs.",
      icon: "triangle",
      link: "https://plus.unsplash.com/premium_photo-1671527298459-cea23635bd5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwYXJ0d29yayUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      title: "Medical Consultation",
      category: "Health",
      description: "Expert medical advice and online consultations.",
      icon: "download",
      link: "https://plus.unsplash.com/premium_photo-1661769175296-fd6e9de8b0df?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      title: "Online Courses",
      category: "Education",
      description: "Learn new skills from expert instructors.",
      icon: "calendar",
      link: "https://images.unsplash.com/photo-1588912914074-b93851ff14b8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      title: "Home Renovation",
      category: "Construction",
      description: "High-quality home remodeling services.",
      icon: "home",
      link: "https://plus.unsplash.com/premium_photo-1682974931688-7e8859add0f8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 5,
      title: "Grocery Delivery",
      category: "Groceries",
      description: "Get your daily essentials delivered fast.",
      icon: "shopping-cart",
      link: "https://plus.unsplash.com/premium_photo-1682144120790-1461fd602bc9?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dy",
    },
    {
      id: 6,
      title: "Property Listings",
      category: "Real Estate",
      description: "Find your dream home with ease.",
      icon: "home",
      link: "https://images.unsplash.com/photo-1498373419901-52eba931dc4f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  // Select 5 random services if more are provided
  const randomServices = React.useMemo(() => {
    if (carouselServices.length <= 5) return carouselServices;
    const shuffled = [...carouselServices].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }, [carouselServices]);

  // Preload images for smoother transitions
  useEffect(() => {
    randomServices.forEach(service => {
      if (service.link) {
        const img = new Image();
        img.src = service.link;
      }
    });
  }, [randomServices]);

  // Handle auto-rotation with improved transition handling
  useEffect(() => {
    // Clear any existing timers when component unmounts or dependencies change
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    // Setup the interval for auto-rotation
    startAutoRotation();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeIndex, randomServices.length, isTransitioning]);

  const startAutoRotation = () => {
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set new timeout for auto rotation (only if not currently transitioning)
    if (!isTransitioning) {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, 5000);
    }
  };

  // Navigation functions with transition handling
  const goToNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % randomServices.length);

    // Clear transition state after animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this to your CSS transition duration
  };

  const goToPrev = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? randomServices.length - 1 : prevIndex - 1
    );

    // Clear transition state after animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this to your CSS transition duration
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === activeIndex) return;

    setIsTransitioning(true);
    setActiveIndex(index);

    // Clear transition state after animation completes
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this to your CSS transition duration
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
    <section className="w-full overflow-hidden relative bg-gray-50">
      <div className="relative w-full h-[550px] text-left">
        {randomServices.map((service, index) => {
          const meta = generateServiceMeta(service);
          return (
            <div
              key={service.id}
              className={`absolute w-full h-full transition-all duration-600 ease-in-out transform
                ${index === activeIndex
                  ? 'opacity-100 z-10 visible translate-x-0'
                  : index < activeIndex
                    ? 'opacity-0 invisible -translate-x-full'
                    : 'opacity-0 invisible translate-x-full'
                } ${service.className || ''}`}
              style={{
                transitionProperty: 'transform, opacity',
                transitionDuration: '600ms'
              }}
            >
              <div className="flex h-full relative">
                <div className="absolute left-[70px] bottom-[70px] w-[45%] z-[5] p-10 flex flex-col justify-end">
                  <div className="text-violet-600 text-sm font-bold mb-3 uppercase tracking-wider">Featured Service #{index + 1}</div>
                  <h2 className="text-5xl font-bold mb-5 leading-tight text-white relative tracking-tight">
                    {service.title}
                  </h2>

                  <div className="flex items-center gap-5 mb-6 text-sm text-white">
                    <div className="flex items-center">
                      <span>{meta.category}</span>
                    </div>
                    <span></span>
                    <div>{meta.duration}</div>
                    <span></span>
                    <div>
                      <span className="bg-white/10 text-white py-1 px-3 rounded-full text-xs font-semibold transition duration-300">
                        {meta.clientCount}+ clients
                      </span>
                    </div>
                    <span></span>
                    <div>
                      <span className="bg-purple-500/20 text-white py-1 px-3 rounded-full text-xs font-semibold border border-purple-500/30">
                        {meta.satisfaction}% satisfaction
                      </span>
                    </div>
                  </div>

                  <p className="mb-9 leading-7 text-white/90 max-w-[95%] text-base overflow-hidden line-clamp-3">
                    {service.description.length > 180
                      ? `${service.description.substring(0, 180)}...`
                      : service.description}
                  </p>

                  <div className="flex gap-5 mt-4">
                    <button className="rounded-full py-3.5 px-8 font-semibold text-base cursor-pointer flex items-center transition duration-300 bg-gradient-to-r from-purple-800 to-pink-500 text-white shadow-lg hover:transform hover:-translate-y-0.5 hover:shadow-xl">
                      <span>Learn More</span>
                    </button>
                    <button className="rounded-full py-3.5 px-8 font-semibold text-base cursor-pointer flex items-center transition duration-300 bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:transform hover:-translate-y-0.5 hover:shadow-lg">
                      Get a Quote <span className="ml-2 transition-transform duration-300 hover:translate-x-0.5">→</span>
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
                      transform: index === activeIndex ? 'scale(1.03)' : 'scale(1)',
                      transitionDelay: '300ms'
                    }}
                  >
                    {/* Background image is applied via CSS */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <button
          className={`absolute top-1/2 -translate-y-1/2 bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-10 transition duration-300 hover:bg-purple-800 hover:scale-105 left-6 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={goToPrev}
          aria-label="Previous service"
          disabled={isTransitioning}
        >
          <span className="text-xl">←</span>
        </button>
        <button
          className={`absolute top-1/2 -translate-y-1/2 bg-white/10 text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer z-10 transition duration-300 hover:bg-purple-800 hover:scale-105 right-6 ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={goToNext}
          aria-label="Next service"
          disabled={isTransitioning}
        >
          <span className="text-xl">→</span>
        </button>

        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex flex-row gap-2.5 z-10">
          {randomServices.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full ${index === activeIndex ? 'bg-purple-800 scale-125 shadow-lg shadow-indigo-500/50' : 'bg-white/20'} border-none cursor-pointer transition duration-300`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to service ${index + 1}`}
              disabled={isTransitioning}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;