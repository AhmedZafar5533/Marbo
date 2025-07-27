import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStore,
  FaCouch,
  FaUsers,
  FaBolt,
  FaTint,
  FaGraduationCap,
  FaTshirt,
  FaUmbrellaBeach,
  FaPalette,
  FaShoppingBag,
  FaHotel,
  FaHeartbeat,
  FaShieldAlt,
  FaHome,
  FaKey,
  FaTree,
  FaUserTie,
  FaMoneyBillWave,
  FaHandshake,
  FaPiggyBank,
  FaMoneyCheckAlt,
  FaLaptop,
  FaPhoneAlt,
  FaBuilding,
  FaTools,
  FaTractor,
  FaCalendarCheck,
  FaPlus,
  FaTrash,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useAdminStore } from "../../../Store/adminStore";
import LoadingSpinner from "../LoadingSpinner";

const AdminServiceManagement = () => {
  // All available services
  const allServices = [
    // Home Services
    {
      id: "groceries",
      title: "Groceries",
      description:
        "Authentic fresh produce sourced directly from local markets",
      icon: <FaStore className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["groceries", "local", "markets", "fresh", "produce"],
      category: "Home Services",
    },
    {
      id: "interior-design",
      title: "Interior Design",
      description: "Inspired home design and decoration services",
      icon: <FaCouch className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-orange-500",
      tags: ["interior", "design", "home", "decoration", "services"],
      category: "Home Services",
    },
    {
      id: "domestic-staffing",
      title: "Domestic Staffing",
      description: "Verified house helps, cleaners, and domestic workers",
      icon: <FaUsers className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["domestic", "staffing", "house help", "cleaners", "workers"],
      category: "Home Services",
    },
    // Payments & Utilities
    {
      id: "utility-payments",
      title: "Utility Payments",
      description: "Pay electricity and water bills for your properties",
      icon: <FaBolt className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["utilities", "payments", "electricity", "water", "bills"],
      category: "Payments & Utilities",
    },
    {
      id: "water-bill-payments",
      title: "Water Bill Payments",
      description: "Convenient payment solutions for water services",
      icon: <FaTint className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      tags: ["water", "payments", "bills", "services", "convenience"],
      category: "Payments & Utilities",
    },
    {
      id: "school-fee-payments",
      title: "School Fee Payments",
      description: "Seamless school fee payments and support for students",
      icon: <FaGraduationCap className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      tags: ["education", "school fees", "payments", "student support"],
      category: "Payments & Utilities",
    },
    // Lifestyle
    {
      id: "traditional-clothing",
      title: "Traditional Clothing",
      description: "Authentic Gomesi, Kanzu, and cultural attire",
      icon: <FaTshirt className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["traditional", "clothing", "cultural", "attire"],
      category: "Lifestyle",
    },
    {
      id: "holiday-lets",
      title: "Holiday Lets",
      description: "Book vacation homes and short-term rentals",
      icon: <FaUmbrellaBeach className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-orange-400",
      tags: ["holiday", "vacation", "lets", "rentals", "short-term"],
      category: "Lifestyle",
    },
    {
      id: "arts-crafts",
      title: "Arts & Crafts",
      description: "Authentic handmade products and artifacts",
      icon: <FaPalette className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      tags: ["arts", "crafts", "handmade", "artifacts"],
      category: "Lifestyle",
    },
    {
      id: "fashion-services",
      title: "Fashion Services",
      description: "Contemporary and traditional fashion",
      icon: <FaShoppingBag className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["fashion", "services", "traditional", "contemporary"],
      category: "Lifestyle",
    },
    {
      id: "hotel-booking",
      title: "Hotel Booking",
      description: "Premium accommodation options",
      icon: <FaHotel className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["hotel", "booking", "accommodation", "travel"],
      category: "Lifestyle",
    },
    // Health & Wellness
    {
      id: "medical-care",
      title: "Medical Care",
      description:
        "Access trusted medical professionals and healthcare facilities",
      icon: <FaHeartbeat className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["healthcare", "medical", "hospitals", "care"],
      category: "Health & Wellness",
    },
    {
      id: "health-insurance",
      title: "Health Insurance",
      description:
        "Secure health coverage plans from trusted providers back home",
      icon: <FaShieldAlt className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      tags: ["insurance", "health", "coverage", "plans", "protection"],
      category: "Health & Wellness",
    },
    // Real Estate & Property
    {
      id: "properties-for-sale",
      title: "Properties for Sale",
      description: "Premium real estate listings",
      icon: <FaHome className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["real estate", "properties", "sale", "listings"],
      category: "Real Estate & Property",
    },
    {
      id: "rental-properties",
      title: "Rental Properties",
      description: "Find verified rental properties and rent-to-own options",
      icon: <FaKey className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["rental", "properties", "real estate", "rent-to-own", "leasing"],
      category: "Real Estate & Property",
    },
    {
      id: "land-acquisition",
      title: "Land Acquisition",
      description: "Verified land listings with secure transaction support",
      icon: <FaTree className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-orange-500",
      tags: ["land", "acquisition", "real estate", "listings", "transactions"],
      category: "Real Estate & Property",
    },
    {
      id: "property-management",
      title: "Property Management",
      description: "Professional property maintenance and tenant management",
      icon: <FaUserTie className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["property", "management", "maintenance", "tenants", "services"],
      category: "Real Estate & Property",
    },
    // Financial Services
    {
      id: "money-transfer",
      title: "Money Transfer Services",
      description: "Get best rates for sending money internationally",
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["money", "transfer", "remittance", "services"],
      category: "Financial Services",
    },
    {
      id: "mortgage-services",
      title: "Mortgage Services",
      description: "Mortgage solutions for diaspora investors",
      icon: <FaHandshake className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["mortgage", "real estate", "finance", "investment", "services"],
      category: "Financial Services",
    },
    {
      id: "banking-services",
      title: "Banking Services",
      description: "Diaspora-focused banking solutions",
      icon: <FaPiggyBank className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      tags: ["banking", "finance", "services", "diaspora"],
      category: "Financial Services",
    },
    {
      id: "rent-collection",
      title: "Rent Collection",
      description: "Secure and reliable rent collection services",
      icon: <FaMoneyCheckAlt className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      tags: ["rent", "collection", "payments", "real estate", "services"],
      category: "Financial Services",
    },
    // Technology & Communication
    {
      id: "tech-supplies",
      title: "Tech Supplies",
      description:
        "Computers, phones, and telecom equipment from trusted vendors",
      icon: <FaLaptop className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: ["tech", "supplies", "computers", "phones", "telecom"],
      category: "Technology & Communication",
    },
    {
      id: "telecom-services",
      title: "Telecom Services",
      description: "Mobile money and internet services",
      icon: <FaPhoneAlt className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["telecom", "mobile", "internet", "services"],
      category: "Technology & Communication",
    },
    // Professional Services
    {
      id: "construction-services",
      title: "Construction Services",
      description:
        "Connect with certified building professionals and contractors",
      icon: <FaBuilding className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-red-600",
      tags: [
        "construction",
        "building",
        "contractors",
        "services",
        "professionals",
      ],
      category: "Professional Services",
    },
    {
      id: "hardware-suppliers",
      title: "Hardware Suppliers",
      description:
        "Source construction materials directly from trusted suppliers",
      icon: <FaTools className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-400 to-red-500",
      tags: ["hardware", "construction", "suppliers", "materials"],
      category: "Professional Services",
    },
    {
      id: "agricultural-services",
      title: "Agricultural Services",
      description: "Farming equipment and professional farm management",
      icon: <FaTractor className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-600 to-red-700",
      tags: ["agriculture", "farming", "equipment", "management", "farm"],
      category: "Professional Services",
    },
    {
      id: "event-management",
      title: "Event Management",
      description:
        "Complete event planning including traditional Mikolo services",
      icon: <FaCalendarCheck className="w-6 h-6" />,
      color: "bg-gradient-to-br from-red-500 to-orange-500",
      tags: ["event", "management", "planning", "mikolo", "services"],
      category: "Professional Services",
    },
  ];

  // State management
  // const [activeServices, setActiveServices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const {
    fetchServices,
    loading,
    activeServices: fetchedServices,
    manageServices,
  } = useAdminStore();

  useEffect(() => {
    console.log("running");
    fetchServices();
  }, [fetchServices]);

  const activeServices = useMemo(() => {
    if (!fetchedServices || !Array.isArray(fetchedServices)) return [];

    return allServices.filter((service) =>
      fetchedServices.some(
        (fetchedService) =>
          fetchedService.title === service.title &&
          fetchedService.isActive === true
      )
    );
  }, [fetchedServices]);

  //   console.log(activeServices);
  // }, [fetchedServices]);

  if (loading) return <LoadingSpinner />;
  // Get available services (not currently active)
  const availableServices = allServices.filter(
    (service) =>
      !activeServices.find((active) => active.title === service.title)
  );

  const filteredAvailableServices = availableServices.filter((service) => {
    const matchesSearch = service.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    service.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
  // Get unique categories
  const categories = [
    "all",
    ...new Set(allServices.map((service) => service.category)),
  ];

  // Group active services by category
  const groupedActiveServices = activeServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  // Handle adding service// Handle adding service
  const handleAddService = (service) => {
    const isActiveStatus = true;
    const newService = fetchedServices.find(
      (active) => active.title === service.title
    );
    const serviceToAdd = {
      id: newService._id,
      isActiveStatus,
    };
    manageServices(serviceToAdd);
    // Remove this line - let the store update handle it
    // setActiveServices((prev) => [...prev, service]);
    setShowAddModal(false);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (serviceToDelete) {
      const isActiveStatus = false;
      const deleteService = fetchedServices.find(
        (active) => active.title === serviceToDelete.title
      );
      const sendDelete = {
        id: deleteService._id,
        isActiveStatus,
      };
      manageServices(sendDelete);
      // Remove this line - let the store update handle it
      // setActiveServices((prev) =>
      //   prev.filter((service) => service.id !== serviceToDelete.id)
      // );
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  // const confirmDelete = () => {
  //   if (serviceToDelete) {
  //     const isActiveStatus = false;
  //     const deleteService = fetchedServices.find(
  //       (active) => active.title === serviceToDelete.title
  //     );

  //     const sendDelete = {
  //       id: deleteService._id,
  //       isActiveStatus,
  //     };
  //     manageServices(sendDelete);

  //     setActiveServices((prev) =>
  //       prev.filter((service) => service.id !== serviceToDelete.id)
  //     );
  //     setShowDeleteModal(false);
  //     setServiceToDelete(null);
  //   }
  // };

  // Toggle category collapse
  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Compact Service Card Component
  const CompactServiceCard = ({ service, showDelete = false, onDelete }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100 dark:border-gray-700 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200 bg-gradient-to-br from-red-400 to-red-600" />

        <div className="relative p-4 flex items-center space-x-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color} group-hover:scale-105 transition-transform duration-200 shadow-sm flex-shrink-0`}
          >
            <span className="text-white">{service.icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1 group-hover:text-red-600 transition-colors duration-200 truncate">
              {service.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
              {service.description}
            </p>
          </div>

          {showDelete && (
            <button
              onClick={() => onDelete(service)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 flex-shrink-0"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  // Regular Service Card for Add Modal
  const ServiceCard = ({ service, onAdd }) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-gray-700 overflow-hidden h-full"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-red-400 to-red-600" />

        <div className="relative p-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center ${service.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}
            >
              <span className="text-white text-2xl">{service.icon}</span>
            </div>
          </div>

          <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-red-600 transition-colors duration-300">
            {service.title}
          </h4>

          <p className="text-slate-600 dark:text-gray-300 mb-5 flex-1 text-sm leading-relaxed">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {service.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <button
              onClick={() => onAdd(service)}
              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-all group/cta"
            >
              <span className="border-b border-transparent group-hover/cta:border-green-600 transition-all">
                Add Service
              </span>
              <FaPlus className="ml-2 w-3 h-3 transition-transform group-hover/cta:scale-110" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Service Management Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and configure the services available on your platform
          </p>
        </div>

        {/* Compact Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Active Services
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {activeServices.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <FaCheck className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Available
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {availableServices.length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <FaPlus className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Categories
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {Object.keys(groupedActiveServices).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <FaUserTie className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Active Services
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Add Service
          </button>
        </div>

        {/* Active Services - Compact Layout */}
        <div className="mb-8">
          {Object.keys(groupedActiveServices).length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStore className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Active Services
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by adding some services to your platform
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                Add Your First Service
              </button>
            </div>
          ) : (
            Object.entries(groupedActiveServices).map(
              ([category, services]) => (
                <div key={category} className="mb-6">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex items-center justify-between w-full text-left mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mr-3">
                        {category}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {services.length}
                      </span>
                    </div>
                    {collapsedCategories[category] ? (
                      <FaChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <FaChevronUp className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {!collapsedCategories[category] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
                      >
                        {services.map((service) => (
                          <CompactServiceCard
                            key={service.id}
                            service={service}
                            showDelete={true}
                            onDelete={handleDeleteClick}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            )
          )}
        </div>

        {/* Add Service Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Add New Service
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  {filteredAvailableServices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 dark:text-gray-400">
                        No services found matching your criteria
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAvailableServices.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onAdd={handleAddService}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirm Removal
                  </h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Are you sure you want to remove{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {serviceToDelete?.title}
                    </span>{" "}
                    from active services?
                  </p>
                  <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg">
                    <FaExclamationTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                    <p className="text-sm">
                      This service will no longer be available to users on your
                      platform.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Remove Service
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminServiceManagement;
