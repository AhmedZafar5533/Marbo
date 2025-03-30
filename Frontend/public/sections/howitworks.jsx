import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaShoppingCart,
  FaLock,
  FaStore,
  FaCreditCard,
  FaUserCheck,
  FaClipboardCheck,
  FaHandshake
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

// Custom color palette
const colors = {
  primary: '#FD1A03',    // Vibrant red
  background: '#FFFFFF', // White
  text: '#646965',       // Muted gray-green
  accent: '#FCE6A6'      // Soft yellow
};

const steps = [
  {
    title: "Service Overview",
    description: "Marbo Global is a comprehensive service marketplace connecting skilled professionals with clients for a wide range of service solutions.",
    icon: <FaHandshake />,
    category: "services",
    color: colors.primary
  },
  {
    title: "Sign Up for Services",
    description: "Register as a service provider or client in just a few steps. Our streamlined onboarding process gets you started quickly.",
    icon: <FaUserPlus />,
    category: "services",
    color: colors.text
  },
  {
    title: "Provider Verification",
    description: "Complete verification and document uploads to build trust and ensure reliability in your service offerings.",
    icon: <FaUserCheck />,
    category: "services",
    color: colors.accent
  },
  {
    title: "Choose Service Plan",
    description: "Service providers select from various plans (Basic, Premium, VIP) to unlock enhanced features and better visibility.",
    icon: <FaStore />,
    category: "services",
    color: colors.primary
  },
  {
    title: "Browse & Engage",
    description: "Clients can explore a diverse range of services, compare options, and select the best solution for their needs.",
    icon: <FaShoppingCart />,
    category: "services",
    color: colors.text
  },
  {
    title: "Payment Processing",
    description: "Our integrated payment gateways ensure secure and efficient processing of service payments.",
    icon: <FaCreditCard />,
    category: "services",
    color: colors.accent
  },
  {
    title: "Secure Transactions",
    description: "Experience safe and seamless service transactions with robust security measures for your peace of mind.",
    icon: <FaLock />,
    category: "services",
    color: colors.primary
  }
];

const HowItWorks = () => {
  const pathRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (pathRef.current && !isMobile) {
      const path = pathRef.current;
      const pathLength = path.getTotalLength();

      const existingParticles = containerRef.current.querySelectorAll('.path-particle');
      existingParticles.forEach(p => p.remove());

      const createParticles = () => {
        for (let i = 0; i < 5; i++) {
          const particle = document.createElement('div');
          particle.className = 'path-particle';
          containerRef.current.appendChild(particle);

          const startPercent = Math.random() * 100;
          animateParticle(particle, startPercent, pathLength, path);
        }
      };

      createParticles();
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, [isMobile]);

  const animateParticle = (particle, startPercent, pathLength, path) => {
    let percent = startPercent;

    const animate = () => {
      percent = (percent + 0.2) % 100;
      const point = path.getPointAtLength((percent / 100) * pathLength);

      particle.style.left = `${point.x}px`;
      particle.style.top = `${point.y}px`;
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.boxShadow = `0 0 15px 5px ${colors.primary}60`;

      requestAnimationFrame(animate);
    };

    animate();
  };

  const getStepBackgroundColor = (step, index) => {
    const baseColor = step.color || colors.primary;
    return `${baseColor}${activeStep === index ? '20' : '10'}`;
  };

  return (
    <section
      className="relative py-20 px-4 md:px-8 overflow-hidden"
      ref={containerRef}
      style={{
        background: `linear-gradient(to bottom, ${colors.background}, ${colors.accent}20)`,
        color: colors.text
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none ">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full opacity-20"
            style={{
              background: colors.accent,
              width: index % 2 === 0 ? '15rem' : '10rem',
              height: index % 2 === 0 ? '15rem' : '10rem',
              top: index === 0 ? '-5%' : index === 1 ? '90%' : index === 2 ? '30%' : '60%',
              left: index % 2 === 0 ? '-5%' : '90%',
              transform: 'translate(-50%, -50%)'
            }}
          ></div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto ">
        {/* Header section */}
        <div className="text-center mb-16 relative ">
          <motion.div
            className="inline-block font-semibold mb-2 px-4 py-1 rounded-full"
            style={{
              backgroundColor: `${colors.primary}20`,
              color: colors.primary
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Simple Process, Powerful Results
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative"
            style={{ color: colors.text }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            How Marbo Global Works
          </motion.h2>

          <motion.p
            className="max-w-2xl mx-auto text-lg"
            style={{ color: `${colors.text}CC` }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our streamlined marketplace connects vendors and buyers through an intuitive platform designed for global commerce.
          </motion.p>
        </div>

        {/* Desktop curved path layout */}
        {!isMobile && (
          <div className="relative max-w-full md:max-w-[1100px] h-[1600px] mx-auto hidden md:block">
            <svg
              className="absolute top-0 left-0 w-full h-full z-[1]"
              viewBox="0 0 1000 1600"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={colors.accent} stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path
                ref={pathRef}
                d="M500,0 C650,220 350,440 500,660 C650,880 350,1100 500,1320 C650,1540 500,1600 500,1600"
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="4"
                strokeDasharray="10,10"
                className="stroke-linecap-round"
                filter="url(#glow)"
              />
            </svg>

            {/* Steps along the curved path */}
            <div className="relative h-full w-full z-[3]">
              {steps.map((step, index) => {
                const position = (index / (steps.length - 1)) * 100;
                const isLeft = index % 2 === 0;

                return (
                  <motion.div
                    className={`
                    absolute w-[300px] md:w-[420px] flex items-center transition-all duration-300 ease-in-out 
                    rounded-2xl
                    ${isLeft ? 'left-[10px] md:left-[40px]' : 'right-[10px] md:right-[40px]'} 
                    ${isLeft ? 'flex-row' : 'flex-row-reverse'}
                  `}
                    key={index}
                    style={{ top: `${position}%` }}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -100 : 100,
                      scale: 0.8
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      scale: 1
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.15,
                      type: "spring",
                      stiffness: 50
                    }}
                    onMouseEnter={() => setActiveStep(index)}
                    onMouseLeave={() => setActiveStep(null)}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    {/* Step number */}
                    <div 
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm z-20"
                      style={{
                        backgroundColor: `${colors.accent}40`,
                        color: colors.text
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Icon container */}
                    <div className="flex-shrink-0 relative z-10">
                      <motion.div
                        className={`
                        w-[70px] h-[70px] md:w-[90px] md:h-[90px] flex items-center justify-center 
                        rounded-full text-2xl md:text-3xl text-white 
                        shadow-lg z-[2] mx-[10px] md:mx-[20px]
                      `}
                        style={{
                          background: `linear-gradient(135deg, ${step.color}, ${colors.accent})`,
                          boxShadow: `0 10px 30px -5px ${step.color}90`
                        }}
                        whileHover={{
                          scale: 1.1,
                          transition: { duration: 0.3 }
                        }}
                        animate={{
                          boxShadow: activeStep === index
                            ? [`0 0 20px 5px ${step.color}60`, `0 15px 35px -5px ${step.color}90`]
                            : `0 10px 30px -5px ${step.color}80`
                        }}
                      >
                        {step.icon}
                      </motion.div>
                    </div>

                    {/* Content card */}
                    <motion.div
                      className="
                      bg-white p-6 md:p-8 rounded-2xl shadow-xl 
                      flex-grow backdrop-blur-sm 
                      border
                      relative overflow-hidden
                    "
                      style={{
                        borderColor: `${colors.primary}20`
                      }}
                      animate={{
                        boxShadow: activeStep === index
                          ? `0 20px 50px -10px ${colors.primary}30`
                          : `0 10px 30px -5px ${colors.primary}15`
                      }}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {/* Category badge */}
                      <div 
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${colors.accent}40`,
                          color: colors.text
                        }}
                      >
                        {step.category}
                      </div>

                      <h3 
                        className="relative z-10 text-[1.3rem] md:text-[1.6rem] font-bold mb-3 md:mb-4 mt-4"
                        style={{ color: colors.text }}
                      >
                        {step.title}
                      </h3>
                      <p 
                        className="relative z-10 text-[0.95rem] md:text-[1.05rem] leading-[1.6] md:leading-[1.8]"
                        style={{ color: `${colors.text}CC` }}
                      >
                        {step.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Animated particles along the path */}
            <style>{`
              .path-particle {
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors.primary};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                filter: blur(2px);
                z-index: 2;
                animation: pulse 2s infinite;
              }
              
              @keyframes pulse {
                0% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                100% { opacity: 0.4; transform: translate(-50%, -50%) scale(0.8); }
              }
            `}</style>
          </div>
        )}

        {/* Mobile vertical timeline layout */}
        {isMobile && (
          <div className="max-w-[95%] mx-auto md:hidden">
            <div className="relative">
              {/* Vertical line with gradient */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 z-[1]"
                style={{
                  background: `linear-gradient(to bottom, ${colors.primary}, ${colors.accent})`
                }}
              ></div>

              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative z-[2] mb-12 flex flex-col items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  onTouchStart={() => setActiveStep(index)}
                  onTouchEnd={() => setActiveStep(null)}
                >
                  {/* Step number */}
                  <div 
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm z-20"
                    style={{
                      backgroundColor: `${colors.accent}40`,
                      color: colors.text
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl mb-6 z-[3]"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}, ${colors.accent})`,
                      boxShadow: `0 8px 25px -4px ${step.color}80`
                    }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      boxShadow: activeStep === index
                        ? [`0 0 20px 5px ${step.color}60`, `0 15px 35px -5px ${step.color}90`]
                        : `0 8px 25px -4px ${step.color}80`
                    }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    className="bg-white p-6 rounded-xl w-full shadow-lg"
                    style={{
                      background: `linear-gradient(to bottom right, white, ${getStepBackgroundColor(step, index)})`,
                      borderColor: `${colors.primary}20`
                    }}
                    whileHover={{ y: -5 }}
                    animate={{
                      boxShadow: activeStep === index
                        ? `0 20px 50px -10px ${colors.primary}30`
                        : `0 10px 30px -5px ${colors.primary}15`
                    }}
                  >
                    {/* Category badge */}
                    <div 
                      className="mb-3 inline-block px-3 py-1 rounded-full text-xs font-medium capitalize"
                      style={{
                        backgroundColor: `${colors.accent}40`,
                        color: colors.text
                      }}
                    >
                      {step.category}
                    </div>

                    <h3 
                      className="text-xl font-bold mb-3"
                      style={{ color: colors.text }}
                    >
                      {step.title}
                    </h3>
                    <p 
                      className="leading-relaxed"
                      style={{ color: `${colors.text}CC` }}
                    >
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Call to action section */}
        <motion.div
          className="text-center mt-16 md:mt-75 pt-5 md:pt-16 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Ready to get started?
          </h3>
          <p 
            className="max-w-2xl mx-auto mb-8"
            style={{ color: `${colors.text}CC` }}
          >
            Join thousands of vendors and buyers already using Marbo Global to connect, sell, and shop globally.
          </p>

          <motion.button
            className="px-8 py-4 rounded-full font-medium transition-all duration-300"
            style={{
              backgroundColor: colors.primary,
              color: colors.background,
              boxShadow: `0 10px 25px -5px ${colors.primary}70`
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;