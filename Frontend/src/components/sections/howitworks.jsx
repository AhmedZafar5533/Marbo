import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaGlobeAfrica,
  FaStore,
  FaCreditCard,
  FaUserCheck,
  FaHandshake,
} from "react-icons/fa";

// Modern color palette
const colors = {
  primary: "#E50000",
  secondary: "#FFCC00",
  darkRed: "#CC0000",
  lightRed: "#FF4D4D",
  dark: "#222222",
  light: "#FFFFFF",
  gray: "#F0F0F0",
  border: "#EFEFEF",
  cardBackground: "rgba(255, 255, 255, 0.8)",
  cardBorder: "rgba(230, 0, 0, 0.2)",
  mutedText: "#6C757D",
};

const steps = [
  {
    title: "Global Connection Hub",
    description:
      "MarboGlobal bridges continents, connecting diasporans worldwide with trusted providers from home—bringing distant services right to your fingertips.",
    icon: <FaGlobeAfrica />,
    category: "global network",
  },
  {
    title: "Quick Seamless Registration",
    description:
      "Join in minutes! Whether you're abroad seeking home services or a provider ready to expand globally, our streamlined signup process gets you connected instantly.",
    icon: <FaUserPlus />,
    category: "easy access",
  },
  {
    title: "Verified & Trusted Partners",
    description:
      "Shop with confidence through our rigorous verification system—every provider is thoroughly vetted for quality, reliability, and authentic service delivery.",
    icon: <FaUserCheck />,
    category: "security",
  },
  {
    title: "Personalized Service Selection",
    description:
      "Browse, compare, and select from an extensive marketplace of home-based services and products—all customized to meet your specific needs and preferences.",
    icon: <FaStore />,
    category: "marketplace",
  },
  {
    title: "Direct Payments, No Middlemen",
    description:
      "Pay service providers directly with our secure payment system—eliminating extra fees and ensuring your money reaches the right hands every time.",
    icon: <FaCreditCard />,
    category: "transactions",
  },
  {
    title: "Family-Assisted Purchasing",
    description:
      "Enable loved ones back home to select items while you handle payment from abroad—perfect for gifts, necessities, and supporting family from a distance.",
    icon: <FaHandshake />,
    category: "collaboration",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const autoAdvanceTimerRef = useRef(null);

  // Function to advance to the next step
  const goToNextStep = () => {
    setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  // Function to go to a specific step
  const goToStep = (stepIndex) => {
    setActiveStep(stepIndex);
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = setInterval(goToNextStep, 4000);
    }
  };

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Set up intersection observer to detect when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsInView(entry.isIntersecting);

        // Start/stop auto-advancing based on visibility
        if (entry.isIntersecting && !isPaused) {
          autoAdvanceTimerRef.current = setInterval(goToNextStep, 3000);
        } else if (autoAdvanceTimerRef.current) {
          clearInterval(autoAdvanceTimerRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      observer.disconnect();
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, [isMobile, isInView, isPaused]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16  px-4 relative"
      style={{
        background: `linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)`
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {!isMobile && (
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-block text-sm font-semibold px-4 py-2 mb-4 rounded-lg"
              style={{
                background: `${colors.primary}10`,
                color: colors.primary
              }}
            >
              EXPERIENCE MARBO GLOBAL
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: colors.dark }}>
              How it <span style={{ color: colors.primary }}>Works</span>
            </h2>

            <p className="max-w-2xl mx-auto text-base md:text-lg opacity-75" style={{ color: colors.dark }}>
              Our platform simplifies global connections through an intuitive process designed for both service providers and customers worldwide.
            </p>
          </motion.div>

          {/* Improved Progress Bar */}
          <div className="relative mb-16 max-w-3xl mx-auto">
            {/* Background Track */}
            <div
              className="absolute top-1/2 left-0 right-0 h-2 rounded-full -translate-y-1/2"
              style={{ background: `${colors.gray}` }}
            ></div>

            {/* Progress Fill */}
            <motion.div
              className="absolute top-1/2 left-0 h-2 rounded-full -translate-y-1/2 transition-all duration-500"
              style={{
                background: `linear-gradient(90deg, ${colors.darkRed}, ${colors.primary})`,
                width: `${((activeStep + 1) / steps.length) * 100}%`,
                boxShadow: `0 0 10px ${colors.primary}40`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>

            {/* Step Indicators */}
            <div className="relative z-10 flex justify-between items-center">
              {steps.map((step, index) => (
                <motion.button
                  name="step-button"
                  key={index}
                  className="relative group"
                  onClick={() => goToStep(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer`}
                    style={{
                      backgroundColor: index <= activeStep ? colors.primary : colors.light,
                      color: index <= activeStep ? colors.light : colors.dark,
                      border: `2px solid ${index <= activeStep ? colors.primary : colors.border}`,
                      boxShadow: index <= activeStep
                        ? `0 10px 20px -5px ${colors.primary}50`
                        : `0 5px 15px -5px rgba(0,0,0,0.1)`
                    }}
                  >
                    <div className="text-xl">
                      {index === activeStep ? step.icon : index + 1}
                    </div>
                  </div>

                  {/* Animated tooltip */}
                  <div
                    className="absolute -bottom-10 left-27 transform -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      backgroundColor: index <= activeStep ? colors.primary : colors.dark,
                      color: colors.light,
                      boxShadow: `0 5px 15px rgba(0,0,0,0.1)`,
                      transform: 'translate(-50%, 10px)',
                    }}
                  >
                    {step.title}
                    <div
                      className="absolute -top-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2"
                      style={{
                        backgroundColor: index <= activeStep ? colors.primary : colors.dark
                      }}
                    ></div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Area - Desktop Version (Creatively Redesigned) */}
          <div className="relative min-h-[550px] mt-16">
            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden -z-10">
              <div
                className="absolute top-10 right-20 w-64 h-64 rounded-full opacity-10"
                style={{ background: `radial-gradient(circle, ${colors.lightRed}, transparent)` }}
              ></div>
              <div
                className="absolute bottom-10 left-40 w-40 h-40 rounded-full opacity-10"
                style={{ background: `radial-gradient(circle, ${colors.secondary}, transparent)` }}
              ></div>
            </div>

            {/* Main Content Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
              key={`step-${activeStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ boxShadow: "0 30px 60px -15px rgba(0,0,0,0.1)" }}
            >
              {/* Top Progress Bar */}
              <div className="h-1 bg-gray-100 relative">
                <motion.div
                  className="h-full"
                  style={{ background: colors.primary }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>

              <div className="grid grid-cols-12 gap-0">
                {/* Left Side - Content */}
                <div className="col-span-7 p-12">
                  <div className="flex items-center mb-8">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mr-4"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.darkRed})`,
                        color: colors.light,
                        boxShadow: `0 10px 20px -5px ${colors.primary}40`
                      }}
                    >
                      {steps[activeStep].icon}
                    </div>

                    <div>
                      <div
                        className="text-sm font-semibold mb-1 uppercase tracking-wider"
                        style={{ color: colors.primary }}
                      >
                        Step {activeStep + 1} - {steps[activeStep].category}
                      </div>
                      <h3 className="text-3xl font-bold" style={{ color: colors.dark }}>
                        {steps[activeStep].title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-lg leading-relaxed mb-10"
                    style={{ color: `${colors.dark}CC` }}
                  >
                    {steps[activeStep].description}
                  </p>

                  {/* Key Benefits */}
                  <div className="mb-10">
                    <div className="flex items-center mb-4">
                      <div
                        className="w-8 h-1 mr-3 rounded-full"
                        style={{ background: colors.primary }}
                      ></div>
                      <div className="text-lg font-semibold" style={{ color: colors.dark }}>Key Benefits</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Fast & Seamless Integration",
                        "24/7 Global Connectivity",
                        "Secure Transactions",
                        "Personalized Experience"
                      ].map((benefit, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center px-4 py-3 rounded-lg"
                          style={{
                            background: i % 2 === 0 ? `${colors.primary}10` : `${colors.secondary}20`,
                            border: `1px solid ${i % 2 === 0 ? `${colors.primary}20` : `${colors.secondary}30`}`
                          }}
                          whileHover={{ y: -3, boxShadow: "0 10px 20px -5px rgba(0,0,0,0.07)" }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs"
                            style={{
                              background: i % 2 === 0 ? colors.primary : colors.secondary,
                              color: colors.light
                            }}
                          >
                            ✓
                          </div>
                          <div className="text-sm font-medium">{benefit}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}

                  <div className="flex items-center gap-4">
                    <a href="/signup" >
                      <motion.button
                        name="signup"
                        className="px-6 py-3 rounded-lg font-medium text-sm"
                        style={{
                          background: colors.primary,
                          color: colors.light
                        }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: `0 10px 20px -5px ${colors.primary}40`
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Get Started Now
                      </motion.button>
                    </a>

                    <div className="flex-1 border-t border-gray-200"></div>

                    {/* <button
                      className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg"
                      style={{
                        border: `1px solid ${colors.border}`,
                        color: colors.dark
                      }}
                    >
                      Watch Demo
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </button> */}
                  </div>
                </div>

                {/* Right Side - Visual */}
                <div
                  className="col-span-5 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}30)`
                  }}
                >
                  {/* Pattern Background */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(${colors.darkRed}70 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>

                  <div className="flex items-center justify-center h-full p-8">
                    <motion.div
                      className="relative"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {/* Main Icon Container */}
                      <div
                        className="relative w-64 h-64 rounded-full flex items-center justify-center z-10"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.darkRed})`,
                          boxShadow: `0 20px 40px -10px ${colors.primary}50`
                        }}
                      >
                        <div className="text-8xl text-white">
                          {steps[activeStep].icon}
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white opacity-20"></div>
                          <div className="absolute bottom-15 left-5 w-10 h-10 rounded-full bg-white opacity-10"></div>
                        </div>

                        {/* Orbiting elements */}
                        <motion.div
                          className="absolute -right-5 top-1/2 transform -translate-y-1/2 w-14 h-14 rounded-full bg-white flex items-center justify-center"
                          style={{ boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ background: colors.secondary }}
                          >
                            <span className="text-white text-sm">{activeStep + 1}</span>
                          </div>
                        </motion.div>
                      </div>

                      {/* Status Indicator */}
                      <div
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg"
                        style={{ color: colors.primary }}
                      >
                        {["Starting", "In Progress", "Almost Done", "Complete", "Ready", "Launched"][activeStep]}
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 py-4">
                    <motion.button
                      name="previous"
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: colors.light,
                        color: colors.primary
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => goToStep(activeStep === 0 ? steps.length - 1 : activeStep - 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                      </svg>
                    </motion.button>

                    <motion.button
                      name="next"
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        background: colors.light,
                        color: colors.primary
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => goToStep(activeStep === steps.length - 1 ? 0 : activeStep + 1)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step Indicators */}
            <div className="flex justify-center mt-10">
              {steps.map((_, index) => (
                <motion.button
                  name="step-indicator"
                  key={index}
                  onClick={() => goToStep(index)}
                  className="mx-1 flex flex-col items-center group"
                >
                  <div
                    className="w-2 h-2 rounded-full mb-1 transition-all duration-300"
                    style={{
                      background: index === activeStep ? colors.primary : colors.gray,
                      transform: index === activeStep ? 'scale(1.5)' : 'scale(1)',
                    }}
                  ></div>
                  <div
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ color: index === activeStep ? colors.primary : colors.dark }}
                  >
                    {index + 1}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>



        </div>
      )}

      {/* Mobile Version - Timeline */}
      {isMobile && (
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div
              className="inline-block text-sm font-semibold px-4 py-2 mb-4 rounded-lg"
              style={{
                background: `${colors.primary}10`,
                color: colors.primary
              }}
            >
              EXPERIENCE MARBO GLOBAL
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: colors.dark }}>
              How it <span style={{ color: colors.primary }}>Works</span>
            </h2>

            <p className="max-w-2xl mx-auto text-base md:text-lg opacity-75" style={{ color: colors.dark }}>
              Our platform simplifies global connections through an intuitive process designed for both service providers and customers worldwide.
            </p>
          </motion.div>

          {/* Mobile Timeline View */}
          <div className="relative">
            {/* The Timeline Connector Line */}
            <div
              className="absolute left-9 top-0 bottom-0 w-1 z-0"
              style={{ background: `linear-gradient(to bottom, ${colors.primary}30, ${colors.primary}10, transparent)` }}
            ></div>

            {/* Steps Container */}
            <motion.div
              className="space-y-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-start group"
                  variants={itemVariants}
                  ref={(el) => (stepRefs.current[index] = el)}
                >
                  {/* Icon Circle */}
                  <div
                    className="flex-shrink-0 w-18 h-18 rounded-full flex items-center justify-center text-3xl absolute left-0 z-10 transform group-hover:scale-105 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.lightRed})`,
                      color: colors.light,
                      boxShadow: `0 8px 25px -5px ${colors.primary}50`,
                      width: "72px",
                      height: "72px"
                    }}
                  >
                    {/* Step Number Inside Icon Circle */}
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-white font-bold text-xs rounded-full flex items-center justify-center shadow-md border border-red-100" style={{ color: colors.primary }}>
                      {index + 1}
                    </span>
                    {step.icon}
                  </div>

                  {/* Content Card */}
                  <div className="w-full pl-24">
                    <motion.div
                      className="p-6 rounded-xl shadow-lg border backdrop-blur-md relative overflow-hidden transition-all duration-300 group-hover:shadow-xl"
                      style={{
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.cardBorder,
                      }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      {/* Inner glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>

                      {/* Category Badge */}
                      <span
                        className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-medium capitalize z-10 relative"
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          color: colors.primary
                        }}
                      >
                        {step.category}
                      </span>

                      <h3 className="text-xl font-semibold mb-2 z-10 relative" style={{ color: colors.dark }}>
                        {step.title}
                      </h3>

                      <p className="text-base leading-relaxed z-10 relative" style={{ color: colors.mutedText }}>
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: colors.dark }}>
              Ready to Experience MarboGlobal?
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                name="get-started"
                className="px-8 py-4 rounded-lg font-medium"
                style={{
                  background: colors.primary,
                  color: colors.light
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: `0 10px 20px -5px ${colors.primary}50`
                }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Now
              </motion.button>

              <motion.button
                name="learn-more"
                className="px-8 py-4 rounded-lg font-medium"
                style={{
                  background: colors.light,
                  color: colors.primary,
                  border: `2px solid ${colors.primary}`
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)'
                }}
                whileTap={{ scale: 0.97 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default HowItWorks;