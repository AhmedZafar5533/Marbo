import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoriesAndServices = () => {
  const categories = [
    {
      title: "Arts & Crafts",
      description: "Handmade and creative works for all occasions.",
      image: "https://plus.unsplash.com/premium_photo-1671527298459-cea23635bd5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VzdG9tJTIwYXJ0d29yayUyMHNlcnZpY2V8ZW58MHx8MHx8fDA%3D",
    },
    {
      title: "Health & Wellness",
      description: "Medical, fitness, and mental well-being services.",
      image: "https://images.pexels.com/photos/5452232/pexels-photo-5452232.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Education",
      description: "Tutoring, courses, and educational resources.",
      image: "https://images.pexels.com/photos/7092358/pexels-photo-7092358.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Construction",
      description: "Building, renovation, and maintenance services.",
      image: "https://images.pexels.com/photos/8817828/pexels-photo-8817828.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Groceries",
      description: "Fresh produce and daily essentials at your doorstep.",
      image: "https://images.pexels.com/photos/7457217/pexels-photo-7457217.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Real Estate",
      description: "Buy, sell, or rent properties easily.",
      image: "https://images.pexels.com/photos/7578890/pexels-photo-7578890.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Electronics",
      description: "Latest gadgets and tech solutions.",
      image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Hotels & Accommodation",
      description: "Comfortable stays for every budget.",
      image: "https://images.pexels.com/photos/7820382/pexels-photo-7820382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Events & Entertainment",
      description: "Plan and enjoy memorable events.",
      image: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Bill Payments",
      description: "Convenient and secure bill payment services.",
      image: "https://images.pexels.com/photos/7621131/pexels-photo-7621131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  const services = [
    {
      title: "Custom Artwork",
      highlight: "Art",
      description: "Bespoke paintings and handcrafted designs.",
      icon: "M12 2L2 22h20L12 2zm0 3.75L18.5 20h-13L12 5.75z",
      badge: "Popular"
    },
    {
      title: "Medical Consultation",
      highlight: " Health",
      description: "Expert medical advice and online consultations.",
      icon: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 17l-4-4h3V9h2v4h3l-4 4z"
    },
    {
      title: "Online Courses",
      highlight: " Education",
      description: "Learn new skills from expert instructors.",
      icon: "M21 6h-3V3h-2v3H8V3H6v3H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM3 18V8h18v10H3z",
      badge: "New"
    },
  ];

  // State Management
  const [slideIndex, setSlideIndex] = useState(Math.floor(categories.length / 2));
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

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
    let interval;
    if (autoplayEnabled) {
      interval = setInterval(() => moveToSlide(slideIndex + 1), 5000);
    }
    return () => clearInterval(interval);
  }, [slideIndex, autoplayEnabled]);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#FD1A03]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-[#FD1A03]/10 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#FCE6A6]/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>


      {/* Services Section - with glass morphism effect */}
      <section className="relative z-10 py-10 px-6 bg-gradient-to-b from-white to-[#FCE6A6]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1 bg-[#FD1A03]/10 text-[#FD1A03] rounded-full text-sm font-semibold mb-4"
            >
              OUR SERVICES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6 text-[#646965]"
            >
              Premium Services For You
              <div className="h-1 w-24 bg-[#FD1A03] rounded-full mx-auto mt-6"></div>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-[#646965]/80 max-w-2xl mx-auto"
            >
              We offer a wide range of professional services tailored to meet your specific needs.
              Our expert team ensures the highest quality service every time.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-[#646965]/10 group"
              >
                <div className="relative p-8 md:p-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FD1A03] to-[#ec5f4f] rounded-2xl shadow-lg group-hover:rounded-3xl transition-all duration-300">
                    <svg className="w-10 h-10 text-white" viewBox="0 0 24 24">
                      <path d={service.icon} fill="currentColor" />
                    </svg>
                  </div>

                  {service.badge && (
                    <span className="absolute top-6 right-6 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] rounded-full uppercase">
                      {service.badge}
                    </span>
                  )}

                  <h3 className="text-2xl font-bold mt-8 mb-4 text-[#646965] group-hover:text-[#FD1A03] transition-colors">
                    {service.title.split(service.highlight)[0]}
                    <span className="text-[#FD1A03]">{service.highlight}</span>
                    {service.title.split(service.highlight)[1]}
                  </h3>

                  <p className="text-[#646965]/80 mb-8 min-h-[3rem]">
                    {service.description}
                  </p>
                  <Link to={'/providers'} >
                    <button className="cursor-pointer group relative inline-flex items-center justify-center px-8 py-3 text-[#646965] border-2 border-[#646965]/30 rounded-full font-semibold text-sm overflow-hidden hover:bg-[#FCE6A6]/30 transition-all duration-300">
                      <span className="relative z-10 group-hover:text-[#FD1A03] transition-colors">
                        Browse More
                      </span>
                      <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform z-10" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section - with improved carousel */}
      <section className="relative z-10 py-10 md:px-6 bg-gradient-to-t from-white to-[#FCE6A6]/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block px-4 py-1 bg-[#FD1A03]/10 text-[#FD1A03] rounded-full text-sm font-semibold mb-4"
            >
              EXPLORE CATEGORIES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-6 text-[#646965]"
            >
              Browse Categories
              <div className="h-1 w-24 bg-[#FD1A03] rounded-full mx-auto mt-6"></div>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-[#646965]/80 max-w-2xl mx-auto"
            >
              Discover our extensive range of categories designed to cater to your every need.
              Find exactly what you're looking for with our intuitive browsing experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-4 mt-8 mb-12"
            >
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${autoplayEnabled ? 'bg-[#FD1A03] text-white' : 'bg-white text-[#646965] border border-[#646965]/30'}`}
                onClick={() => setAutoplayEnabled(true)}
              >
                Auto-play On
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!autoplayEnabled ? 'bg-[#FD1A03] text-white' : 'bg-white text-[#646965] border border-[#646965]/30'}`}
                onClick={() => setAutoplayEnabled(false)}
              >
                Auto-play Off
              </button>
            </motion.div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <div className="overflow-hidden px-6 md:px-10">
                <motion.div
                  className="flex transition-transform duration-700 ease-out"
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
                      className="px-4 flex-shrink-0 pt-3"
                      style={getCardStyle(index)}
                    >
                      <div className="bg-white/60 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl border border-[#646965]/10 group h-full">
                        <div
                          className="h-64 bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${category.image})` }}
                        >
                          <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                            <h3 className="text-white text-2xl font-bold">{category.title}</h3>
                          </div>
                        </div>
                        <div className="p-8">
                          <p className="text-[#646965]/80 mb-6">{category.description}</p>
                          <button className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] text-white rounded-full font-semibold text-sm hover:shadow-lg transition-all group">
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

            {/* Carousel Navigation - improved */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-1/2 -translate-y-1/2 -left-4 md:left-0 w-12 h-12 bg-white/80 backdrop-blur-lg rounded-full flex items-center justify-center border border-[#646965]/10 hover:bg-[#FD1A03] hover:text-white transition-all z-10 shadow-lg"
              onClick={() => moveToSlide(slideIndex - 1)}
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-1/2 -translate-y-1/2 -right-4 md:right-0 w-12 h-12 bg-white/80 backdrop-blur-lg rounded-full flex items-center justify-center border border-[#646965]/10 hover:bg-[#FD1A03] hover:text-white transition-all z-10 shadow-lg"
              onClick={() => moveToSlide(slideIndex + 1)}
            >
              <ArrowRight className="w-6 h-6" />
            </motion.button>

            {/* Carousel Dots - animated */}
            <div className="flex justify-center mt-12 space-x-2">
              {categories.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-3 rounded-full bg-[#646965]/30 transition-all duration-300
                    ${slideIndex === index ? 'w-8 bg-[#FD1A03]' : 'w-3'}`}
                  onClick={() => moveToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="relative z-10 py-10 px-6 bg-gradient-to-b from-[#FCE6A6]/20 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-[#FD1A03]/90 to-[#ec5f4f]/90 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['Playfair_Display'] mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-white/90">
                Join thousands of satisfied customers who have experienced our premium services.
                Sign up today and discover the difference.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to={"/redirect"}>
                  <button className="px-8 py-4 cursor-pointer bg-white text-[#FD1A03] rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    Get Started
                  </button>
                </Link>
                <Link to={"/contact-us"}>
                  <button className="px-8 cursor-pointer py-4 border-2 border-white/80 text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesAndServices;
