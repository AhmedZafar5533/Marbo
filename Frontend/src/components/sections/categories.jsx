import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight, Star, Shield, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoriesAndServices = () => {
  // Modern color palette with rich gradients and vibrant accents
  const colors = {
    primary: {
      main: "#FF3B30",
      light: "#FF6E64",
      dark: "#CC2F26",
      gradient: "linear-gradient(135deg, #FF3B30, #FF6E64)"
    },
    accent: {
      yellow: "#FFD60A",
      purple: "#7A5AF8",
      teal: "#20E3B2"
    },
    neutral: {
      black: "#121212",
      white: "#FFFFFF",
      offWhite: "#F9F9F9",
      light: "#F0F0F0",
      grey: "#747474"
    }
  };

  const categories = [
    {
      title: "Arts & Crafts",
      description: "Handmade crafts with local artistry",
      image: "https://plus.unsplash.com/premium_photo-1671527298459-cea23635bd5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwYXJ0d29yayUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D",
      color: colors.accent.yellow
    },
    {
      title: "Health & Wellness",
      description: "Medical support and wellness services",
      image: "https://images.pexels.com/photos/5452232/pexels-photo-5452232.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: colors.accent.teal
    },
    {
      title: "Education",
      description: "Quality learning resources for all ages",
      image: "https://images.pexels.com/photos/7092358/pexels-photo-7092358.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: colors.accent.purple
    },
    {
      title: "Groceries",
      description: "Fresh food and essential supplies",
      image: "https://images.pexels.com/photos/7457217/pexels-photo-7457217.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: colors.accent.yellow
    },
    {
      title: "Real Estate",
      description: "Property management and transactions",
      image: "https://images.pexels.com/photos/7578890/pexels-photo-7578890.jpeg?auto=compress&cs=tinysrgb&w=600",
      color: colors.accent.teal
    },
  ];

  const services = [
    {
      title: "Artisan Crafts",
      icon: Star,
      description: "Connect with local artisans creating authentic handcrafted pieces",
      color: colors.accent.yellow,
      badge: "Popular"
    },
    {
      title: "Health Support",
      icon: Shield,
      description: "Medical consultations and wellness services for your family",
      color: colors.accent.teal
    },
    {
      title: "Education Access",
      icon: Send,
      description: "Quality tutoring and academic resources from verified providers",
      color: colors.accent.purple,
      badge: "New"
    },
  ];

  // State Management
  const [slideIndex, setSlideIndex] = useState(0);
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  // Functions for carousel
  const moveToSlide = (targetIndex) => {
    let newIndex = targetIndex;
    if (newIndex < 0) newIndex = categories.length - 1;
    if (newIndex >= categories.length) newIndex = 0;
    setSlideIndex(newIndex);
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

  // Effects
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let interval;
    if (autoplayEnabled) {
      interval = setInterval(() => moveToSlide((slideIndex + 1) % categories.length), 5000);
    }
    return () => clearInterval(interval);
  }, [slideIndex, autoplayEnabled, categories.length]);

  return (
    <div className="min-h-screen  font-sans" style={{ background: colors.neutral.offWhite }}>
      <section className="relative w-full md:mx-auto md:rounded-md md:w-[95%] py-16 px-4 mt-10 overflow-hidden" style={{ background: colors.neutral.black }}>
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500 via-red-500 to-yellow-500 opacity-70 mix-blend-overlay"></div>
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white border-opacity-20"></div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
            >
              Your Bridge To <span style={{ color: colors.primary.light }}>Home</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg max-w-xl mx-auto text-neutral-300"
            >
              Connect with verified service providers back home while living abroad. Send money, purchase goods, and support your loved ones—all from one secure platform.</motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative rounded-2xl overflow-hidden group"
              >
                {/* Card Background with Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${service.color}40, transparent)` }}></div>

                {/* Card Content */}
                <div className="relative p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="p-3 rounded-full"
                      style={{ background: `${service.color}30` }}>
                      <service.icon color={service.color} size={24} />
                    </div>

                    {service.badge && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={{ background: service.color, color: colors.neutral.black }}>
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {service.title}
                  </h3>

                  <p className="mb-6 text-neutral-300 text-sm">
                    {service.description}
                  </p>

                  <Link to="/providers">
                    <button
                      className="inline-flex items-center text-sm font-medium group"
                      style={{ color: service.color }}
                    >
                      Explore Services
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        <ChevronRight size={16} />
                      </span>
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div className="max-w-lg">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
                style={{ background: `${colors.primary.main}15`, color: colors.primary.main }}
              >
                GLOBAL MARKETPLACE
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold mb-4 tracking-tight"
                style={{ color: colors.neutral.black }}
              >
                Support From Anywhere
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-neutral-600"
              >
                Browse our extensive range of services and connect with verified providers—all while ensuring your family receives exactly what they need.
              </motion.p>
            </div>

            <div className="flex items-center space-x-2 mt-6 md:mt-0">
              <button
                onClick={() => moveToSlide(slideIndex > 0 ? slideIndex - 1 : categories.length - 1)}
                className="p-3 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Previous slide"
              >
                <ArrowLeft size={20} color={colors.neutral.black} />
              </button>
              <button
                onClick={() => moveToSlide((slideIndex + 1) % categories.length)}
                className="p-3 rounded-full text-white transition-colors"
                style={{ background: colors.primary.main }}
                aria-label="Next slide"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Modern Horizontal Scrolling Cards */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${getTransformPercentage()}%)` }}
            >
              {categories.map((category, index) => (

                <div
                  key={index}
                  className="px-3 flex-shrink-0"
                  style={{ width: `${100 / getVisibleSlides()}%` }}
                >
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="h-full rounded-2xl overflow-hidden relative group shadow-lg"
                  >
                    {/* Image with overlay */}
                    <a href="/services" className='cursor-pointer' key={index}>
                      <div
                        className="h-72 relative bg-cover bg-center"
                        style={{ backgroundImage: `url(${category.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: `linear-gradient(to top, ${category.color}90, transparent)` }}></div>

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                          <p className="text-white text-opacity-90 mb-6 text-sm hidden group-hover:block transition-all">
                            {category.description}
                          </p>
                          <button
                            className="px-4 py-2 rounded-lg text-sm font-medium transition-all group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-8  duration-300"
                            style={{
                              background: category.color,
                              color: colors.neutral.black,
                              transform: 'translateY(100%)',
                              opacity: 0,
                              transition: 'transform 0.3s ease, opacity 0.3s ease',
                              [':hover']: { transform: 'translateY(0)', opacity: 1 }
                            }}

                          >
                            Connect Now
                          </button>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                </div>

              ))}
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => moveToSlide(index)}
                  className={`h-2 rounded-full transition-all ${slideIndex === index ? 'w-8' : 'w-2'}`}
                  style={{
                    background: slideIndex === index ? colors.primary.main : colors.neutral.light
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className=" pb-5 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl overflow-hidden relative">
            {/* Gradient background */}
            <div className="absolute inset-0" style={{ background: colors.primary.gradient }}></div>

            {/* Decorative patterns */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-[40px] border-white"></div>
            </div>

            {/* Content */}
            <div className="relative p-10 md:p-16 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight"
              >
                Support Your Loved Ones From Anywhere
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg max-w-2xl mx-auto mb-10 text-white text-opacity-90"
              >
                Join thousands of diasporans who provide for their families back home through our secure marketplace.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link to="/redirect">
                  <button className="px-8 py-4 bg-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:translate-y-1"
                    style={{ color: colors.primary.main }}>
                    Join Now
                  </button>
                </Link>
                <Link to="/contact-us">
                  <button className="px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:bg-white/10 transition-all"
                    style={{ borderColor: colors.neutral.white, color: colors.neutral.white }}>
                    Contact Us
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesAndServices;