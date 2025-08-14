import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useServiceStore } from "../../../Store/servicesStore";

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
    const checkScreen = () => setIsMobile(window.innerWidth < 768);

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
    Groceries: {
      description: "Fresh produce and essentials from trusted local markets",
      tags: ["food", "supermarket", "fruits", "vegetables", "essentials"],
    },
    "Utility Payments": {
      description: "Pay electricity, gas, and utility bills with ease",
      tags: ["electricity", "gas", "water", "bills", "payment"],
    },
    "Water Bill Payments": {
      description: "Convenient water service payments from anywhere",
      tags: ["water", "bill", "payment", "utilities"],
    },
    "Interior Design": {
      description: "Professional home styling and decoration services",
      tags: ["home", "interior", "decoration", "design", "furniture"],
    },
    "Traditional Clothing": {
      description: "Authentic Gomesi, Kanzu, and cultural attire",
      tags: ["fashion", "clothing", "traditional", "attire", "garments"],
    },
    "Holiday Lets": {
      description: "Book short-term stays and vacation rental homes",
      tags: ["vacation", "rental", "holiday", "accommodation", "travel"],
    },
    "Arts & Crafts": {
      description: "Handmade cultural pieces and artisan crafts",
      tags: ["crafts", "art", "handmade", "cultural", "decor"],
    },
    "Fashion Services": {
      description: "Contemporary and traditional fashion design",
      tags: ["fashion", "design", "style", "clothing", "apparel"],
    },
    "Hotel Booking": {
      description: "Find and book premium accommodations quickly",
      tags: ["hotel", "booking", "stay", "accommodation", "travel"],
    },
    "Medical Care": {
      description: "Access quality healthcare professionals and services",
      tags: ["doctor", "health", "clinic", "hospital", "medical"],
    },
    "Domestic Staffing": {
      description: "Hire verified house helps, cleaners, and staff",
      tags: ["staff", "domestic", "house help", "cleaning", "services"],
    },
    "Properties for Sale": {
      description: "Explore premium real estate listings and investments",
      tags: ["property", "sale", "real estate", "investment", "house"],
    },
    "Rental Properties": {
      description: "Verified rental homes and rent-to-own options",
      tags: ["property", "rental", "house", "lease", "rent"],
    },
    "Land Acquisition": {
      description: "Secure land listings and property transactions",
      tags: ["land", "purchase", "real estate", "plot", "investment"],
    },
    "Property Management": {
      description: "Professional property management and maintenance",
      tags: ["property", "management", "maintenance", "house", "rent"],
    },
    "School Fee Payments": {
      description: "Seamless and secure school fee transactions",
      tags: ["school", "education", "fees", "payment", "tuition"],
    },
    "Mortgage Services": {
      description: "Diaspora-focused mortgage and loan solutions",
      tags: ["mortgage", "loan", "finance", "banking", "home"],
    },
    "Banking Services": {
      description: "Banking products tailored for your needs",
      tags: ["banking", "finance", "account", "loan", "payment"],
    },
    "Rent Collection": {
      description: "Efficient and secure rental income collection",
      tags: ["rent", "collection", "property", "finance", "payment"],
    },
    "Tech Supplies": {
      description: "Laptops, smartphones, and tech accessories",
      tags: ["tech", "gadgets", "electronics", "computer", "smartphone"],
    },
    "Telecom Services": {
      description: "Mobile money and telecommunications solutions",
      tags: ["telecom", "mobile", "phone", "internet", "communication"],
    },
    "Construction Services": {
      description: "Certified builders and construction contractors",
      tags: ["construction", "builders", "contractor", "building", "home"],
    },
    "Hardware Suppliers": {
      description: "Quality building materials and construction supplies",
      tags: ["hardware", "construction", "tools", "building", "materials"],
    },
    "Agricultural Services": {
      description: "Farming tools, equipment, and management services",
      tags: ["agriculture", "farming", "equipment", "tools", "crops"],
    },
    "Event Management": {
      description: "Full-service event planning and coordination",
      tags: ["event", "planning", "party", "wedding", "management"],
    },
    "Health Insurance": {
      description: "Comprehensive health coverage from trusted providers",
      tags: ["insurance", "health", "medical", "coverage", "policy"],
    },
    "Money Transfer Services": {
      description: "Best rates for international money transfers",
      tags: ["money", "transfer", "remittance", "finance", "payment"],
    },
  };

  const generateDynamicSubmenu = () => {
    if (!frontEndServices || !Array.isArray(frontEndServices)) {
      return [];
    }

    return frontEndServices.slice(0, 8).map((service) => {
      const info = serviceDescriptions[service] || {};
      return {
        name: service,
        description:
          info.description || `Professional ${service.toLowerCase()} services`,
        tags: info.tags || [], // NEW: attach related tags
        link: `/providers/${service}`,
      };
    });
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

  const performSearch = (query) => {
    const allItems = [
      ...menuItems.flatMap((cat) =>
        cat.submenu && cat.submenu.length > 0
          ? cat.submenu.map((item) => ({
              ...item,
              category: cat.title,
            }))
          : []
      ),
      {
        name: "About Us",
        description: "Learn more about our company",
        link: "/",
        category: "Company",
        tags: ["about", "company", "info"],
      },
      {
        name: "Contact",
        description: "Get in touch with our team",
        link: "/contact-us",
        category: "Company",
        tags: ["contact", "email", "phone", "support"],
      },
      {
        name: "FAQ",
        description: "Frequently asked questions",
        link: "/faq",
        category: "Support",
        tags: ["faq", "help", "questions", "support"],
      },
    ];

    if (!query.trim()) return [];

    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.tags &&
          item.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
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
