import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";

// Lazy load desktop/mobile navbars
const DesktopNavbar = lazy(() => import("./DesktopNavbar"));
const MobileNavbar = lazy(() => import("./MobileNavbar"));

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // 1️⃣ Screen‐size detector
  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // 2️⃣ Throttled & guarded scroll handler
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

  // Menu data
  const menuItems = [
    {
      title: "Services",
      link: "/services",
      submenu: [
        // Home Services
        {
          name: "Groceries",
          description: "Fresh produce from trusted local markets",
          link: "/providers/Groceries",
        },
        {
          name: "Interior Design",
          description: "Home styling and decoration services",
          link: "/providers/Interior Design",
        },
        {
          name: "Domestic Staffing",
          description: "Hire verified house helps and cleaners",
          link: "/providers/Domestic Staffing",
        },

        // Payments & Utilities
        {
          name: "Utility Payments",
          description: "Settle electricity and water bills easily",
          link: "/providers/Utility Payments",
        },
        {
          name: "Water Bill Payments",
          description: "Pay for water services from anywhere",
          link: "/providers/Water Bill Payments",
        },
        {
          name: "School Fee Payments",
          description: "Seamless payments for school fees",
          link: "/providers/School Fee Payments",
        },

        // Lifestyle
        {
          name: "Traditional Clothing",
          description: "Authentic Gomesi, Kanzu, and more",
          link: "/providers/Traditional Clothing",
        },
        {
          name: "Holiday Lets",
          description: "Book short-term stays and vacation homes",
          link: "/providers/Holiday Lets",
        },
        {
          name: "Arts & Crafts",
          description: "Handmade cultural pieces and crafts",
          link: "/providers/Arts & Crafts",
        },
        // {
        //   name: "Fashion Services",
        //   description: "Contemporary and traditional fashion",
        //   link: "/providers/Fashion Services",
        // },
        // {
        //   name: "Hotel Booking",
        //   description: "Find premium accommodations fast",
        //   link: "/providers/Hotel Booking",
        // },

        // Health & Wellness
        // {
        //   name: "Medical Care",
        //   description: "Access quality healthcare professionals",
        //   link: "/providers/Medical Care",
        // },
        // {
        //   name: "Health Insurance",
        //   description: "Get health coverage from trusted providers",
        //   link: "/providers/Health Insurance",
        // },

        // // Real Estate & Property
        // {
        //   name: "Properties for Sale",
        //   description: "Explore premium real estate listings",
        //   link: "/providers/Properties for Sale",
        // },
        // {
        //   name: "Rental Properties",
        //   description: "Verified rentals and rent-to-own options",
        //   link: "/providers/Rental Properties",
        // },
        // {
        //   name: "Land Acquisition",
        //   description: "Secure land listings and transactions",
        //   link: "/providers/Land Acquisition",
        // },
        // {
        //   name: "Property Management",
        //   description: "Professional management and maintenance",
        //   link: "/providers/Property Management",
        // },

        // // Financial Services
        // {
        //   name: "Money Transfer Services",
        //   description: "Best rates for sending money abroad",
        //   link: "/providers/Money Transfer Services",
        // },
        // {
        //   name: "Mortgage Services",
        //   description: "Diaspora-focused mortgage solutions",
        //   link: "/providers/Mortgage Services",
        // },
        // {
        //   name: "Banking Services",
        //   description: "Banking products tailored for you",
        //   link: "/providers/Banking Services",
        // },
        // {
        //   name: "Rent Collection",
        //   description: "Collect rent safely and efficiently",
        //   link: "/providers/Rent Collection",
        // },

        // // Technology & Communication
        // {
        //   name: "Tech Supplies",
        //   description: "Laptops, phones, and accessories",
        //   link: "/providers/Tech Supplies",
        // },
        // {
        //   name: "Telecom Services",
        //   description: "Mobile money and connectivity options",
        //   link: "/providers/Telecom Services",
        // },

        // // Professional Services
        // {
        //   name: "Construction Services",
        //   description: "Hire certified builders and contractors",
        //   link: "/providers/Construction Services",
        // },
        // {
        //   name: "Hardware Suppliers",
        //   description: "Order building materials with ease",
        //   link: "/providers/Hardware Suppliers",
        // },
        // {
        //   name: "Agricultural Services",
        //   description: "Farming tools and management services",
        //   link: "/providers/Agricultural Services",
        // },
        // {
        //   name: "Event Management",
        //   description: "Plan events with full-service support",
        //   link: "/providers/Event Management",
        // },
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

  // Search helper
  const performSearch = (query) => {
    const allItems = [
      ...menuItems.flatMap((cat) =>
        cat.submenu.map((item) => ({ ...item, category: cat.title }))
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
