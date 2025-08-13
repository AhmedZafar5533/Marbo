import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useServiceStore } from "../../../Store/servicesStore";

// Lazy load desktop/mobile navbars
const DesktopNavbar = lazy(() => import("./DesktopNavbar"));
const MobileNavbar = lazy(() => import("./MobileNavbar"));

// Loading Skeleton Component
const NavbarSkeleton = ({ isScrolled }) => (
  <div
    className={`bg-white transition-shadow duration-300 ${
      isScrolled ? "shadow-lg" : "shadow-md"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 lg:h-20">
        {/* Logo Skeleton */}
        <div className="flex items-center">
          <div className="w-32 h-8 bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-200 rounded-md animate-pulse bg-[length:200%_100%] animate-shimmer" />
        </div>

        {/* Desktop Menu Skeleton */}
        <div className="hidden lg:flex items-center space-x-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-20 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer" />
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full animate-pulse bg-[length:200%_100%] animate-shimmer" />
            </div>
          ))}
        </div>

        {/* CTA Buttons Skeleton */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="w-20 h-9 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-md animate-pulse bg-[length:200%_100%] animate-shimmer" />
          <div className="w-24 h-9 bg-gradient-to-r from-indigo-200 via-indigo-100 to-indigo-200 rounded-md animate-pulse bg-[length:200%_100%] animate-shimmer" />
        </div>

        {/* Mobile Menu Button Skeleton */}
        <div className="lg:hidden">
          <div className="w-6 h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse bg-[length:200%_100%] animate-shimmer" />
        </div>
      </div>
    </div>
  </div>
);

// Error State Component
const NavbarError = ({ onRetry, isScrolled }) => (
  <div
    className={`bg-white transition-shadow duration-300 ${
      isScrolled ? "shadow-lg" : "shadow-md"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16 lg:h-20">
        {/* Logo - Always show */}
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            YourLogo
          </Link>
        </div>

        {/* Basic Menu (fallback) */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/contact-us"
            className="text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Contact
          </Link>
          <button
            onClick={onRetry}
            className="text-sm text-indigo-600 hover:text-indigo-700 underline transition-colors"
            title="Retry loading services"
          >
            Retry Services
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/signin"
            className="text-gray-700 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="text-gray-700 hover:text-indigo-600 transition-colors"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const lastScrollY = useRef(0);
  const { frontEndServices, fetchFrontendServices, loading } =
    useServiceStore();

  useEffect(() => {
    fetchFrontendServices();
  }, [fetchFrontendServices]);

  // Retry handler
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchFrontendServices();
  };

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled((prev) => {
            const next = y >= 35;
            return prev === next ? prev : next;
          });
          lastScrollY.current = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Service descriptions mapping
  const serviceDescriptions = {
    Groceries: "Fresh produce and essentials from trusted local markets",
    "Utility Payments": "Pay electricity, gas, and utility bills with ease",
    "Water Bill Payments": "Convenient water service payments from anywhere",
    "Interior Design": "Professional home styling and decoration services",
    "Traditional Clothing": "Authentic Gomesi, Kanzu, and cultural attire",
    "Holiday Lets": "Book short-term stays and vacation rental homes",
    "Arts & Crafts": "Handmade cultural pieces and artisan crafts",
    "Fashion Services": "Contemporary and traditional fashion design",
    "Hotel Booking": "Find and book premium accommodations quickly",
    "Medical Care": "Access quality healthcare professionals and services",
    "Domestic Staffing": "Hire verified house helps, cleaners, and staff",
    "Properties for Sale":
      "Explore premium real estate listings and investments",
    "Rental Properties": "Verified rental homes and rent-to-own options",
    "Land Acquisition": "Secure land listings and property transactions",
    "Property Management": "Professional property management and maintenance",
    "School Fee Payments": "Seamless and secure school fee transactions",
    "Mortgage Services": "Diaspora-focused mortgage and loan solutions",
    "Banking Services": "Banking products tailored for your needs",
    "Rent Collection": "Efficient and secure rental income collection",
    "Tech Supplies": "Laptops, smartphones, and tech accessories",
    "Telecom Services": "Mobile money and telecommunications solutions",
    "Construction Services": "Certified builders and construction contractors",
    "Hardware Suppliers":
      "Quality building materials and construction supplies",
    "Agricultural Services":
      "Farming tools, equipment, and management services",
    "Event Management": "Full-service event planning and coordination",
    "Health Insurance": "Comprehensive health coverage from trusted providers",
    "Money Transfer Services": "Best rates for international money transfers",
  };

  // Generate dynamic submenu based on frontEndServices
  const generateDynamicSubmenu = () => {
    if (!frontEndServices || !Array.isArray(frontEndServices)) {
      return [];
    }
    return frontEndServices.slice(0, 8).map((service) => ({
      name: service,
      description:
        serviceDescriptions[service] ||
        `Professional ${service.toLowerCase()} services`,
      link: `/providers/${service}`,
    }));
  };

  // Fallback menu items (when services fail to load)
  const fallbackMenuItems = [
    {
      title: "Services",
      link: "/services",
      submenu: [
        {
          name: "All Services",
          description: "Browse all available services",
          link: "/services",
        },
      ],
    },
    {
      title: "Boost now",
      link: "/pricing",
      submenu: [],
    },
    {
      title: "Contact Us",
      link: "/contact-us",
      submenu: [],
    },
  ];

  // Menu data with dynamic services or fallback
  const menuItems = !frontEndServices
    ? fallbackMenuItems
    : [
        {
          title: "Services",
          link: "/services",
          submenu: generateDynamicSubmenu(),
        },
        {
          title: "Boost now",
          link: "/pricing",
          submenu: [],
        },
        {
          title: "Contact Us",
          link: "/contact-us",
          submenu: [],
        },
      ];

  // Search helper
  const performSearch = (query) => {
    const allItems = [
      ...menuItems.flatMap((cat) =>
        // Only include submenu items if submenu exists and has items
        cat.submenu && cat.submenu.length > 0
          ? cat.submenu.map((item) => ({ ...item, category: cat.title }))
          : []
      ),
      {
        name: "About Us",
        description: "Learn more about our company",
        link: "/",
        category: "Company",
      },
      {
        name: "Contact",
        description: "Get in touch with our team",
        link: "/contact-us",
        category: "Company",
      },
      {
        name: "FAQ",
        description: "Frequently asked questions",
        link: "/faq",
        category: "Support",
      },
    ];

    if (!query.trim()) return [];
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Initial blank placeholder while we detect screen size
  if (isMobile === null) {
    return <div className="h-16 bg-indigo-50 shadow-md" aria-hidden="true" />;
  }

  // Show loading skeleton while services are loading
  if (loading && !frontEndServices) {
    return (
      <nav
        className="sticky top-0 inset-x-0 z-50"
        role="navigation"
        aria-label="Main Navigation"
      >
        <NavbarSkeleton isScrolled={isScrolled} />
      </nav>
    );
  }

  if (!frontEndServices && retryCount > 0) {
    return (
      <nav
        className="sticky top-0 inset-x-0 z-50"
        role="navigation"
        aria-label="Main Navigation"
      >
        <NavbarError onRetry={handleRetry} isScrolled={isScrolled} />
      </nav>
    );
  }

  return (
    <nav
      className={`sticky top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-md"
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <Suspense
        fallback={
          <div
            className={`bg-white ${
              isScrolled ? "h-16 lg:h-24" : "h-18 lg:h-24"
            }`}
            aria-hidden="true"
          />
        }
      >
        {isMobile ? (
          <MobileNavbar
            menuItems={menuItems}
            performSearch={performSearch}
            isScrolled={isScrolled}
          />
        ) : (
          <DesktopNavbar
            menuItems={menuItems}
            performSearch={performSearch}
            isScrolled={isScrolled}
          />
        )}
      </Suspense>
    </nav>
  );
};

export default Navbar;
