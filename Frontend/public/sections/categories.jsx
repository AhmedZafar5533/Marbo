import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const CategoriesAndServices = () => {
  const categories = [
    { title: "Arts & Crafts", description: "Handmade and creative works for all occasions.", image: "/api/placeholder/400/320" },
    { title: "Health & Wellness", description: "Medical, fitness, and mental well-being services.", image: "/api/placeholder/400/320" },
    { title: "Education", description: "Tutoring, courses, and educational resources.", image: "/api/placeholder/400/320" },
    { title: "Construction", description: "Building, renovation, and maintenance services.", image: "/api/placeholder/400/320" },
    { title: "Groceries", description: "Fresh produce and daily essentials at your doorstep.", image: "/api/placeholder/400/320" },
    { title: "Real Estate", description: "Buy, sell, or rent properties easily.", image: "/api/placeholder/400/320" },
    { title: "Electronics", description: "Latest gadgets and tech solutions.", image: "/api/placeholder/400/320" },
    { title: "Hotels & Accommodation", description: "Comfortable stays for every budget.", image: "/api/placeholder/400/320" },
    { title: "Events & Entertainment", description: "Plan and enjoy memorable events.", image: "/api/placeholder/400/320" },
    { title: "Bill Payments", description: "Convenient and secure bill payment services.", image: "/api/placeholder/400/320" }
  ];

  const services = [
    { title: "Custom Artwork", highlight: "Art", description: "Bespoke paintings and handcrafted designs.", icon: "M12 2L2 22h20L12 2zm0 3.75L18.5 20h-13L12 5.75z" },
    { title: "Medical Consultation", highlight: " Health", description: "Expert medical advice and online consultations.", icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 17l-4-4h3V9h2v4h3l-4 4z" },
    { title: "Online Courses", highlight: " Education", description: "Learn new skills from expert instructors.", icon: "M21 6h-3V3h-2v3H8V3H6v3H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM3 18V8h18v10H3z" },
  ];

  // State Management
  const [slideIndex, setSlideIndex] = useState(Math.floor(categories.length / 2));
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [autoplayInterval, setAutoplayInterval] = useState(null);

  // Carousel Controls
  const moveToSlide = (targetIndex) => {
    let newIndex = targetIndex;
    if (newIndex < 0) newIndex = categories.length - 1;
    if (newIndex >= categories.length) newIndex = 0;
    setSlideIndex(newIndex);
  };

  // Responsive Calculations
  const getVisibleSlides = () => {
    if (width > 1200) return 3;
    if (width > 768) return 2;
    return 1;
  };

  const getTransformPercentage = () => {
    const visibleSlides = getVisibleSlides();
    const slideWidth = 100 / visibleSlides;
    const middleOffset = visibleSlides === 3 ? 1 : 0;
    return (slideIndex - middleOffset) * slideWidth;
  };

  const getCardStyle = (index) => {
    const distance = Math.abs(slideIndex - index);
    return {
      width: `${100 / getVisibleSlides()}%`,
      opacity: 1 - (distance * 0.3),
      transform: `scale(${1 - (distance * 0.1)})`,
      filter: `blur(${distance * 2}px)`,
      zIndex: categories.length - distance
    };
  };

  // Effects
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => moveToSlide(slideIndex + 1), 5000);
    return () => clearInterval(interval);
  }, [slideIndex]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#FCE6A6] to-[#FFFFFF] text-[#646965] overflow-hidden">
    {/* Decorative Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#FD1A03]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-[#FD1A03]/10 rounded-full blur-3xl animate-pulse delay-500" />
    </div>

    {/* Services Section */}
    <section className="z-10 py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold font-['Playfair_Display'] text-center mb-10 relative text-[#646965]"
        >
          Our Services
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-24 h-1 bg-[#FD1A03] rounded-full"></div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1
              }}
              viewport={{ once: true }}
              className="bg-white backdrop-blur-lg rounded-2xl overflow-hidden border border-[#646965]/20 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="relative p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FD1A03] to-[#FD1A03]/80 rounded-full shadow-2xl">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24">
                    <path d={service.icon} fill="currentColor" />
                  </svg>
                </div>

                {service.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-[#FD1A03] to-[#FD1A03]/80 rounded-full uppercase">
                    {service.badge}
                  </span>
                )}

                <h3 className="text-2xl font-semibold my-6 text-[#646965]">
                  {service.title.split(service.highlight)[0]}
                  <span className="text-[#FD1A03]">{service.highlight}</span>
                  {service.title.split(service.highlight)[1]}
                </h3>

                <p className="text-sm text-[#646965]/80 mb-6 h-16 overflow-hidden">
                  {service.description}
                </p>

                <button className="group relative inline-flex items-center justify-center px-8 py-3 text-[#646965] border-2 border-[#646965]/30 rounded-full font-semibold text-sm overflow-hidden hover:bg-[#FCE6A6]/20 transition-all">
                  <span className="relative z-10 group-hover:text-[#FD1A03] transition-colors">
                    Learn More
                  </span>
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform z-10" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="relative z-10 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold font-['Playfair_Display'] text-center mb-10 relative text-[#646965]"
        >
          Browse Categories
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-24 h-1 bg-[#FD1A03] rounded-full"></div>
        </motion.h2>

        <div className="relative group">
          <AnimatePresence mode="wait">
            <div className="overflow-hidden">
              <motion.div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${getTransformPercentage()}%)` }}
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        delay: index * 0.1
                      }
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="px-4 flex-shrink-0"
                    style={getCardStyle(index)}
                  >
                    <div className="bg-white/60 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-[#646965]/20 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div
                        className="h-64 bg-cover bg-center transform transition-transform duration-500 hover:scale-110"
                        style={{ backgroundImage: `url(${category.image})` }}
                      />
                      <div className="p-6 text-center">
                        <h3 className="text-2xl font-semibold mb-3 text-[#646965]">{category.title}</h3>
                        <p className="text-sm text-[#646965]/80 mb-5 h-12 overflow-hidden">{category.description}</p>
                        <button className="group relative inline-flex items-center justify-center px-8 py-3 bg-[#FD1A03] text-white rounded-full font-semibold text-sm hover:bg-[#FD1A03]/80 transition-all">
                          View Services
                          <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </AnimatePresence>

          {/* Carousel Navigation */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-12 h-12 bg-white/50 backdrop-blur-lg rounded-full flex items-center justify-center border-2 border-[#646965]/20 hover:bg-[#FCE6A6]/50 transition-all z-10"
            onClick={() => moveToSlide(slideIndex - 1)}
          >
            <ArrowLeft className="w-6 h-6 text-[#FD1A03]" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-1/2 -translate-y-1/2 right-0 w-12 h-12 bg-white/50 backdrop-blur-lg rounded-full flex items-center justify-center border-2 border-[#646965]/20 hover:bg-[#FCE6A6]/50 transition-all z-10"
            onClick={() => moveToSlide(slideIndex + 1)}
          >
            <ArrowRight className="w-6 h-6 text-[#FD1A03]" />
          </motion.button>

          {/* Carousel Dots */}
          <div className="flex justify-center mt-12 space-x-2">
            {categories.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-3 h-3 rounded-full bg-[#646965]/30 transition-all 
              ${slideIndex === index ? 'w-8 bg-[#FD1A03]' : ''}`}
                onClick={() => moveToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default CategoriesAndServices;