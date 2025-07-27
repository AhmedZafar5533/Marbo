import { useState } from "react";

const PropertySaleForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    salePrice: "",
    propertyStatus: "available",
    description: "",
    features: [],
    images: [],

    // Building specific fields
    bedrooms: "",
    bathrooms: "",
    floors: "",
    totalFloors: "",
    propertySize: "",
    sizeUnit: "sqft",
    buildingAge: "",
    furnishingStatus: "unfurnished",
    facing: "",

    // Land specific fields
    landArea: "",
    landUnit: "sqft",
    landType: "",
    soilType: "",
    waterAvailability: "",
    electricityAvailability: "",
    roadAccess: "",

    // Commercial specific fields
    builtUpArea: "",
    carpetArea: "",
    floorNumber: "",
    washrooms: "",
    cafeteria: "",
    conferenceRoom: "",
    reception: "",

    // Location fields
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateRegion: "",
    postalCode: "",
    country: "",
    mapLink: "",

    // Legal & Additional
    ownershipType: "",
    approvals: [],
    nearbyFacilities: [],
    parkingSpaces: "",

    // Contact & Preferences
    contactPreference: "both",
    negotiable: false,
    readyToMove: false,
    loanAvailable: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [currentApproval, setCurrentApproval] = useState("");
  const [currentFacility, setCurrentFacility] = useState("");

  //   const { addPropertyForSale } = usePropertyStore();

  // Property type configurations
  const propertyTypeConfig = {
    residential: {
      label: "Residential",
      types: [
        "Apartment/Flat",
        "House/Villa",
        "Studio Apartment",
        "Duplex",
        "Penthouse",
        "Row House",
        "Independent Floor",
      ],
      showFields: [
        "bedrooms",
        "bathrooms",
        "floors",
        "totalFloors",
        "propertySize",
        "buildingAge",
        "furnishingStatus",
        "facing",
        "parkingSpaces",
      ],
    },
    commercial: {
      label: "Commercial",
      types: [
        "Office Space",
        "Shop/Retail",
        "Warehouse",
        "Industrial",
        "Showroom",
        "Restaurant Space",
        "Hotel/Guest House",
      ],
      showFields: [
        "builtUpArea",
        "carpetArea",
        "floorNumber",
        "totalFloors",
        "washrooms",
        "cafeteria",
        "conferenceRoom",
        "reception",
        "parkingSpaces",
      ],
    },
    land: {
      label: "Land/Plot",
      types: [
        "Residential Plot",
        "Commercial Plot",
        "Agricultural Land",
        "Industrial Plot",
        "Farm House",
      ],
      showFields: [
        "landArea",
        "landType",
        "soilType",
        "waterAvailability",
        "electricityAvailability",
        "roadAccess",
      ],
    },
  };

  const getAllPropertyTypes = () => {
    return Object.values(propertyTypeConfig).flatMap((config) => config.types);
  };

  const getPropertyCategory = (propertyType) => {
    for (const [category, config] of Object.entries(propertyTypeConfig)) {
      if (config.types.includes(propertyType)) {
        return category;
      }
    }
    return null;
  };

  const shouldShowField = (fieldName) => {
    const category = getPropertyCategory(formData.propertyType);
    if (!category) return false;
    return propertyTypeConfig[category].showFields.includes(fieldName);
  };

  const furnishingOptions = [
    { value: "unfurnished", label: "Unfurnished" },
    { value: "semi-furnished", label: "Semi-Furnished" },
    { value: "fully-furnished", label: "Fully Furnished" },
  ];

  const facingOptions = [
    "North",
    "South",
    "East",
    "West",
    "North-East",
    "North-West",
    "South-East",
    "South-West",
  ];

  const landTypeOptions = [
    "Clear Title",
    "Freehold",
    "Leasehold",
    "Power of Attorney",
    "Cooperative Society",
  ];

  const ownershipOptions = [
    { value: "freehold", label: "Freehold" },
    { value: "leasehold", label: "Leasehold" },
    { value: "cooperative", label: "Cooperative Society" },
    { value: "power-of-attorney", label: "Power of Attorney" },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.title.trim()) {
      newErrors.title = "Property title is required";
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Property type is required";
    }

    if (!formData.salePrice) {
      newErrors.salePrice = "Sale price is required";
    } else if (
      isNaN(formData.salePrice) ||
      parseFloat(formData.salePrice) <= 0
    ) {
      newErrors.salePrice = "Sale price must be a valid positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    // Category-specific validation
    const category = getPropertyCategory(formData.propertyType);

    if (category === "residential" || category === "commercial") {
      if (shouldShowField("bedrooms") && !formData.bedrooms) {
        newErrors.bedrooms = "Number of bedrooms is required";
      }
      if (shouldShowField("bathrooms") && !formData.bathrooms) {
        newErrors.bathrooms = "Number of bathrooms is required";
      }
      if (shouldShowField("propertySize") && !formData.propertySize) {
        newErrors.propertySize = "Property size is required";
      }
      if (shouldShowField("builtUpArea") && !formData.builtUpArea) {
        newErrors.builtUpArea = "Built-up area is required";
      }
    }

    if (category === "land") {
      if (!formData.landArea) {
        newErrors.landArea = "Land area is required";
      }
    }

    // Location validation
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.stateRegion.trim()) {
      newErrors.stateRegion = "State/Region is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (files) => {
    const fileArray = Array.from(files);

    if (formData.images.length + fileArray.length > 12) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 12 images allowed",
      }));
      return;
    }

    const validFiles = fileArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          images: "Only image files are allowed",
        }));
        return false;
      }

      if (!isValidSize) {
        setErrors((prev) => ({
          ...prev,
          images: "Image size should be less than 5MB",
        }));
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setIsLoading(true);
    try {
      const base64Images = await Promise.all(
        validFiles.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            file,
            base64,
            name: file.name,
            size: file.size,
            type: file.type,
          };
        })
      );

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.images;
        return newErrors;
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        images: "Error processing images",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addFeature = () => {
    if (
      currentFeature.trim() &&
      !formData.features.includes(currentFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addApproval = () => {
    if (
      currentApproval.trim() &&
      !formData.approvals.includes(currentApproval.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        approvals: [...prev.approvals, currentApproval.trim()],
      }));
      setCurrentApproval("");
    }
  };

  const removeApproval = (index) => {
    setFormData((prev) => ({
      ...prev,
      approvals: prev.approvals.filter((_, i) => i !== index),
    }));
  };

  const addFacility = () => {
    if (
      currentFacility.trim() &&
      !formData.nearbyFacilities.includes(currentFacility.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        nearbyFacilities: [...prev.nearbyFacilities, currentFacility.trim()],
      }));
      setCurrentFacility("");
    }
  };

  const removeFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      nearbyFacilities: prev.nearbyFacilities.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = {
        ...formData,
        salePrice: parseFloat(formData.salePrice),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        floors: formData.floors ? parseInt(formData.floors) : null,
        totalFloors: formData.totalFloors
          ? parseInt(formData.totalFloors)
          : null,
        propertySize: formData.propertySize
          ? parseFloat(formData.propertySize)
          : null,
        landArea: formData.landArea ? parseFloat(formData.landArea) : null,
        builtUpArea: formData.builtUpArea
          ? parseFloat(formData.builtUpArea)
          : null,
        carpetArea: formData.carpetArea
          ? parseFloat(formData.carpetArea)
          : null,
        floorNumber: formData.floorNumber
          ? parseInt(formData.floorNumber)
          : null,
        washrooms: formData.washrooms ? parseInt(formData.washrooms) : null,
        parkingSpaces: formData.parkingSpaces
          ? parseInt(formData.parkingSpaces)
          : null,
        buildingAge: formData.buildingAge
          ? parseInt(formData.buildingAge)
          : null,
        images: formData.images.map((img) => ({
          base64Image: img.base64,
        })),
      };

      console.log("Submitting property data:", submissionData);
      //   const success = await addPropertyForSale(submissionData);

      if (success) {
        // Reset form
        setFormData({
          title: "",
          propertyType: "",
          salePrice: "",
          propertyStatus: "available",
          description: "",
          features: [],
          images: [],
          bedrooms: "",
          bathrooms: "",
          floors: "",
          totalFloors: "",
          propertySize: "",
          sizeUnit: "sqft",
          buildingAge: "",
          furnishingStatus: "unfurnished",
          facing: "",
          landArea: "",
          landUnit: "sqft",
          landType: "",
          soilType: "",
          waterAvailability: "",
          electricityAvailability: "",
          roadAccess: "",
          builtUpArea: "",
          carpetArea: "",
          floorNumber: "",
          washrooms: "",
          cafeteria: "",
          conferenceRoom: "",
          reception: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          stateRegion: "",
          postalCode: "",
          country: "",
          mapLink: "",
          ownershipType: "",
          approvals: [],
          nearbyFacilities: [],
          parkingSpaces: "",
          contactPreference: "both",
          negotiable: false,
          readyToMove: false,
          loanAvailable: false,
        });
        alert("Property listed successfully!");
      }
    } catch (error) {
      console.error("Error creating property listing:", error);
      alert("Error creating property listing. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              List Your Property for Sale
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create a comprehensive listing to attract serious buyers with
              detailed property information
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Basic Property Details Section */}
          <div className="p-8 sm:p-10">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-emerald-600 font-semibold text-sm">
                  1
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Basic Property Details
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Property Title */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                    errors.title
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="e.g., Spacious 3BHK Apartment, Prime Commercial Plot, Luxury Villa with Garden"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                    errors.propertyType
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Choose property type</option>
                  {Object.entries(propertyTypeConfig).map(
                    ([category, config]) => (
                      <optgroup key={category} label={config.label}>
                        {config.types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </optgroup>
                    )
                  )}
                </select>
                {errors.propertyType && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.propertyType}
                  </p>
                )}
              </div>

              {/* Sale Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sale Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className={`w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                      errors.salePrice
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="5000000"
                  />
                </div>
                {errors.salePrice && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.salePrice}
                  </p>
                )}
              </div>

              {/* Property Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Property Status
                </label>
                <select
                  name="propertyStatus"
                  value={formData.propertyStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                >
                  <option value="available">Available</option>
                  <option value="under-construction">Under Construction</option>
                  <option value="ready-to-move">Ready to Move</option>
                  <option value="sold">Sold</option>
                </select>
              </div>

              {/* Ownership Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Ownership Type
                </label>
                <select
                  name="ownershipType"
                  value={formData.ownershipType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                >
                  <option value="">Select ownership type</option>
                  {ownershipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Provide a detailed description of your property including key features, condition, unique selling points, and any other relevant information that would interest potential buyers..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Property Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Price Negotiable
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="readyToMove"
                  checked={formData.readyToMove}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Ready to Move
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="loanAvailable"
                  checked={formData.loanAvailable}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Bank Loan Available
                </span>
              </label>
            </div>
          </div>

          {/* Dynamic Property Specifications */}
          {formData.propertyType && (
            <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
              <div className="flex items-center mb-8">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Property Specifications
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Residential/Commercial Fields */}
                {shouldShowField("bedrooms") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Number of Bedrooms <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                        errors.bedrooms
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 3"
                    />
                    {errors.bedrooms && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.bedrooms}
                      </p>
                    )}
                  </div>
                )}

                {shouldShowField("bathrooms") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Number of Bathrooms{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      step="0.5"
                      min="0"
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                        errors.bathrooms
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="e.g., 2.5"
                    />
                    {errors.bathrooms && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.bathrooms}
                      </p>
                    )}
                  </div>
                )}

                {shouldShowField("propertySize") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Property Size <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="propertySize"
                        value={formData.propertySize}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        className={`flex-1 px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                          errors.propertySize
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        placeholder="1200"
                      />
                      <select
                        name="sizeUnit"
                        value={formData.sizeUnit}
                        onChange={handleInputChange}
                        className="px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      >
                        <option value="sqft">sq ft</option>
                        <option value="sqm">sq m</option>
                        <option value="sqyd">sq yd</option>
                      </select>
                    </div>
                    {errors.propertySize && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.propertySize}
                      </p>
                    )}
                  </div>
                )}

                {shouldShowField("floors") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Floor Number
                    </label>
                    <input
                      type="number"
                      name="floors"
                      value={formData.floors}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., 2"
                    />
                  </div>
                )}

                {shouldShowField("totalFloors") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Total Floors in Building
                    </label>
                    <input
                      type="number"
                      name="totalFloors"
                      value={formData.totalFloors}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., 5"
                    />
                  </div>
                )}

                {shouldShowField("buildingAge") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Building Age (years)
                    </label>
                    <input
                      type="number"
                      name="buildingAge"
                      value={formData.buildingAge}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., 5"
                    />
                  </div>
                )}

                {shouldShowField("furnishingStatus") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Furnishing Status
                    </label>
                    <select
                      name="furnishingStatus"
                      value={formData.furnishingStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      {furnishingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {shouldShowField("facing") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Property Facing
                    </label>
                    <select
                      name="facing"
                      value={formData.facing}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select facing direction</option>
                      {facingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {shouldShowField("parkingSpaces") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Parking Spaces
                    </label>
                    <input
                      type="number"
                      name="parkingSpaces"
                      value={formData.parkingSpaces}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., 2"
                    />
                  </div>
                )}

                {/* Commercial specific fields */}
                {shouldShowField("builtUpArea") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Built-up Area <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="builtUpArea"
                        value={formData.builtUpArea}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        className={`flex-1 px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                          errors.builtUpArea
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        placeholder="1500"
                      />
                      <select
                        name="sizeUnit"
                        value={formData.sizeUnit}
                        onChange={handleInputChange}
                        className="px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      >
                        <option value="sqft">sq ft</option>
                        <option value="sqm">sq m</option>
                        <option value="sqyd">sq yd</option>
                      </select>
                    </div>
                    {errors.builtUpArea && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.builtUpArea}
                      </p>
                    )}
                  </div>
                )}

                {shouldShowField("carpetArea") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Carpet Area
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="carpetArea"
                        value={formData.carpetArea}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        className="flex-1 px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                        placeholder="1200"
                      />
                      <select
                        name="sizeUnit"
                        value={formData.sizeUnit}
                        onChange={handleInputChange}
                        className="px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      >
                        <option value="sqft">sq ft</option>
                        <option value="sqm">sq m</option>
                        <option value="sqyd">sq yd</option>
                      </select>
                    </div>
                  </div>
                )}

                {shouldShowField("floorNumber") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Floor Number
                    </label>
                    <input
                      type="number"
                      name="floorNumber"
                      value={formData.floorNumber}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., 3"
                    />
                  </div>
                )}

                {shouldShowField("washrooms") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Number of Washrooms
                    </label>
                    <input
                      type="number"
                      name="washrooms"
                      value={formData.washrooms}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., 2"
                    />
                  </div>
                )}

                {shouldShowField("cafeteria") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Cafeteria Available
                    </label>
                    <select
                      name="cafeteria"
                      value={formData.cafeteria}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}

                {shouldShowField("conferenceRoom") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Conference Room Available
                    </label>
                    <select
                      name="conferenceRoom"
                      value={formData.conferenceRoom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}

                {shouldShowField("reception") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Reception Area
                    </label>
                    <select
                      name="reception"
                      value={formData.reception}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}

                {/* Land specific fields */}
                {shouldShowField("landArea") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Land Area <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="landArea"
                        value={formData.landArea}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        className={`flex-1 px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                          errors.landArea
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        placeholder="5000"
                      />
                      <select
                        name="landUnit"
                        value={formData.landUnit}
                        onChange={handleInputChange}
                        className="px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      >
                        <option value="sqft">sq ft</option>
                        <option value="sqm">sq m</option>
                        <option value="sqyd">sq yd</option>
                        <option value="acre">Acre</option>
                        <option value="hectare">Hectare</option>
                      </select>
                    </div>
                    {errors.landArea && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.landArea}
                      </p>
                    )}
                  </div>
                )}

                {shouldShowField("landType") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Land Type
                    </label>
                    <select
                      name="landType"
                      value={formData.landType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select land type</option>
                      {landTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {shouldShowField("soilType") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Soil Type
                    </label>
                    <input
                      type="text"
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                      placeholder="e.g., Clay, Sandy, Loamy"
                    />
                  </div>
                )}

                {shouldShowField("waterAvailability") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Water Availability
                    </label>
                    <select
                      name="waterAvailability"
                      value={formData.waterAvailability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select water availability</option>
                      <option value="available">Available</option>
                      <option value="not-available">Not Available</option>
                      <option value="borewell">Borewell</option>
                      <option value="municipal">Municipal Supply</option>
                    </select>
                  </div>
                )}

                {shouldShowField("electricityAvailability") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Electricity Availability
                    </label>
                    <select
                      name="electricityAvailability"
                      value={formData.electricityAvailability}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select electricity availability</option>
                      <option value="available">Available</option>
                      <option value="not-available">Not Available</option>
                      <option value="nearby">Nearby</option>
                    </select>
                  </div>
                )}

                {shouldShowField("roadAccess") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Road Access
                    </label>
                    <select
                      name="roadAccess"
                      value={formData.roadAccess}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                    >
                      <option value="">Select road access</option>
                      <option value="direct">Direct Road Access</option>
                      <option value="approach-road">Approach Road</option>
                      <option value="no-direct-access">No Direct Access</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="p-8 sm:p-10 border-t border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-semibold text-sm">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Property Features
              </h2>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Add Features
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={currentFeature}
                  onChange={(e) => setCurrentFeature(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  className="flex-1 px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="e.g., Swimming Pool, Garden, Gym, Security"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 font-medium"
                >
                  Add
                </button>
              </div>

              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-emerald-600 hover:text-emerald-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Legal Approvals */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Legal Approvals
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={currentApproval}
                  onChange={(e) => setCurrentApproval(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addApproval())
                  }
                  className="flex-1 px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="e.g., Building Plan Approved, NOC, Environmental Clearance"
                />
                <button
                  type="button"
                  onClick={addApproval}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
                >
                  Add
                </button>
              </div>

              {formData.approvals.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.approvals.map((approval, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {approval}
                      <button
                        type="button"
                        onClick={() => removeApproval(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Nearby Facilities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Nearby Facilities
              </label>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={currentFacility}
                  onChange={(e) => setCurrentFacility(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFacility())
                  }
                  className="flex-1 px-4 py-3 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="e.g., School, Hospital, Metro Station, Shopping Mall"
                />
                <button
                  type="button"
                  onClick={addFacility}
                  className="px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 focus:ring-4 focus:ring-orange-100 transition-all duration-200 font-medium"
                >
                  Add
                </button>
              </div>

              {formData.nearbyFacilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.nearbyFacilities.map((facility, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => removeFacility(index)}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location Details Section */}
          <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold text-sm">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Location Details
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                    errors.addressLine1
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Street address, building name, plot number"
                />
                {errors.addressLine1 && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.addressLine1}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                    errors.city
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="City name"
                />
                {errors.city && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.city}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  State/Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stateRegion"
                  value={formData.stateRegion}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                    errors.stateRegion
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="State or region"
                />
                {errors.stateRegion && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.stateRegion}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="Postal/ZIP code"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                    errors.country
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Country name"
                />
                {errors.country && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.country}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Google Maps Link
                </label>
                <input
                  type="text"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="Paste Google Maps link for exact location"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="p-8 sm:p-10 border-t border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-semibold text-sm">5</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Property Images
              </h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Images <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-50"
                    : errors.images
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="max-w-md mx-auto">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="mt-4 flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                      <span>Upload files</span>
                      <input
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 5MB each. Maximum 12 images.
                  </p>
                </div>
              </div>
              {errors.images && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.images}
                </p>
              )}
            </div>

            {/* Image previews */}
            {formData.images.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Uploaded Images ({formData.images.length}/12)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.base64}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {image.name} ({formatFileSize(image.size)})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>Tips for better photos:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Use natural lighting for clear, bright images</li>
                <li>Take photos from multiple angles</li>
                <li>Include photos of all rooms and key features</li>
                <li>Show the exterior and surrounding area</li>
              </ul>
            </div>
          </div>

          {/* Contact Preferences Section */}
          <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 font-semibold text-sm">6</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Contact Preferences
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Preferred Contact Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="phone"
                      checked={formData.contactPreference === "phone"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Phone Calls
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="email"
                      checked={formData.contactPreference === "email"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Email
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="contactPreference"
                      value="both"
                      checked={formData.contactPreference === "both"}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      Both
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="p-8 sm:p-10 border-t border-gray-100 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-sm text-gray-500">
                By submitting this form, you agree to our{" "}
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Privacy Policy
                </a>
                .
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-2xl hover:from-emerald-700 hover:to-green-700 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "List Property for Sale"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertySaleForm;
