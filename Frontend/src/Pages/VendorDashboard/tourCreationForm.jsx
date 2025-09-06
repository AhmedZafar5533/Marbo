import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Users,
  Calendar,
  DollarSign,
  Camera,
  User,
  Ship,
  Home,
  Navigation,
} from "lucide-react";
import { useTourStore } from "../../../Store/tourStore";

const TourDataForm = () => {
  const [formData, setFormData] = useState({
    country: "",
    type: "",
    title: "",
    location: "",
    duration: "",
    price: "",
    rating: "",
    reviews: "",
    maxGuests: "",
    images: [], // Changed from image to images array
    description: "",
    // Tour-specific fields
    pickupSpot: "",
    tourType: "private",
    // Property-specific fields
    address: "",
    propertyType: "",
    amenities: "",
    checkInTime: "",
    checkOutTime: "",
    // Guide-specific fields
    guideName: "",
    speciality: "",
    citiesAvailable: "",
    languages: "",
    experience: "",
    // Cruise-specific fields
    shipName: "",
    ports: "",
    cabinType: "",
    includes: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  const countries = ["Egypt", "Saudi Arabia", "Lebanon", "Jordan", "Iraq"];
  const types = [
    { value: "tour", label: "Tour" },
    { value: "luxuryProperties", label: "Luxury Properties" },
    { value: "guides", label: "Tour Guides" },
    { value: "cruises", label: "Cruises" },
  ];

  const { createTour } = useTourStore();

  // Clean up preview URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let error = "";
    const newImages = [...formData.images]; // Will store Base64 strings
    const newPreviews = [...imagePreviews]; // For UI preview

    if (newImages.length + files.length > 4) {
      error = "You can only upload a maximum of 4 images.";
      setErrors((prev) => ({ ...prev, images: error }));
      return;
    }

    const readFileAsBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

    const processFiles = async () => {
      for (const file of files) {
        if (file.size > 4 * 1024 * 1024) {
          error = `File "${file.name}" exceeds the 4MB size limit.`;
          break;
        }
        if (!file.type.startsWith("image/")) {
          error = `File "${file.name}" is not a valid image type.`;
          break;
        }

        try {
          const base64 = await readFileAsBase64(file);
          newImages.push(base64);
          newPreviews.push(base64); // Use Base64 also for preview
        } catch (err) {
          error = `Failed to read file "${file.name}".`;
          break;
        }
      }

      if (error) {
        setErrors((prev) => ({ ...prev, images: error }));
      } else {
        setFormData((prev) => ({ ...prev, images: newImages }));
        setImagePreviews(newPreviews);
        if (errors.images) {
          setErrors((prev) => ({ ...prev, images: "" }));
        }
      }
    };

    processFiles();
  };

  const handleRemoveImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedPreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );

    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (formData.type !== "guides" && !formData.title)
      newErrors.title = "Title is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required.";
    if (formData.images.length > 4)
      newErrors.images = "You can upload a maximum of 4 images.";

    // Type-specific validations
    if (
      formData.type === "privateTours" ||
      formData.type === "smallGroupTours"
    ) {
      if (!formData.duration)
        newErrors.duration = "Duration is required for tours";
      if (!formData.maxGuests)
        newErrors.maxGuests = "Max guests is required for tours";
      if (!formData.pickupSpot)
        newErrors.pickupSpot = "Pickup spot is required for tours";
    }
    if (formData.type === "luxuryProperties") {
      if (!formData.address)
        newErrors.address = "Address is required for properties";
      if (!formData.propertyType)
        newErrors.propertyType = "Property type is required";
    }
    if (formData.type === "guides") {
      if (!formData.guideName) newErrors.guideName = "Guide name is required";
      if (!formData.speciality)
        newErrors.speciality = "Speciality is required for guides";
      if (!formData.citiesAvailable)
        newErrors.citiesAvailable = "Cities available is required for guides";
    }
    if (formData.type === "cruises") {
      if (!formData.duration)
        newErrors.duration = "Duration is required for cruises";
      if (!formData.shipName)
        newErrors.shipName = "Ship name is required for cruises";
      if (!formData.ports)
        newErrors.ports = "Ports information is required for cruises";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newEntry = createDataObject();
      console.log("New entry created:", newEntry);
      const success = await createTour(newEntry);
      if (!success) return;
      resetForm();
      alert("Entry created successfully! Check console for output.");
    }
  };

  const createDataObject = () => {
    console.log(formData.type);
    const baseData = {
      title: formData.title,
      location: formData.location,
      country: formData.country,
      price: parseInt(formData.price),
      type: formData.type,
      tourType: formData.tourType,
      images: formData.images,
      description: formData.description,
    };

    switch (formData.type) {
      case "tour":
        console.log("we are in");
        return {
          ...baseData,
          duration: formData.duration,
          type: formData.tourType,
          maxGuests: formData.maxGuests,
          pickupSpot: formData.pickupSpot,
        };
      case "luxuryProperties":
        return {
          ...baseData,
          address: formData.address,
          propertyType: formData.propertyType,
          amenities: formData.amenities,
          checkInTime: formData.checkInTime,
          checkOutTime: formData.checkOutTime,
        };
      case "guides":
        return {
          ...baseData,
          title: formData.guideName,
          speciality: formData.speciality,
          citiesAvailable: formData.citiesAvailable
            .split(",")
            .map((c) => c.trim()),
          languages: formData.languages.split(",").map((l) => l.trim()),
          experience: formData.experience,
        };
      case "cruises":
        return {
          ...baseData,
          duration: formData.duration,
          shipName: formData.shipName,
          ports: formData.ports.split(",").map((p) => p.trim()),
          cabinType: formData.cabinType,
          includes: formData.includes.split(",").map((i) => i.trim()),
        };
      default:
        return baseData;
    }
  };

  const resetForm = () => {
    // Clean up any existing image preview URLs
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);

    setFormData({
      country: "",
      type: "",
      title: "",
      location: "",
      duration: "",
      price: "",

      maxGuests: "",
      images: [],
      description: "",
      pickupSpot: "",
      tourType: "private",
      address: "",
      propertyType: "",
      amenities: "",
      checkInTime: "",
      checkOutTime: "",
      guideName: "",
      speciality: "",
      citiesAvailable: "",
      languages: "",
      experience: "",
      shipName: "",
      ports: "",
      cabinType: "",
      includes: "",
    });
    setErrors({});
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "tour":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7 days"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-2" />
                  Max Guests *
                </label>
                <input
                  type="text"
                  name="maxGuests"
                  value={formData.maxGuests}
                  onChange={handleChange}
                  placeholder="e.g., 2-4 guests"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.maxGuests ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.maxGuests && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maxGuests}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Navigation className="inline w-4 h-4 mr-2" />
                Pickup Spot *
              </label>
              <input
                type="text"
                name="pickupSpot"
                value={formData.pickupSpot}
                onChange={handleChange}
                placeholder="e.g., Hotel lobby, Airport, Central Station"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.pickupSpot ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.pickupSpot && (
                <p className="text-red-500 text-sm mt-1">{errors.pickupSpot}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Type
              </label>
              <select
                name="tourType"
                value={formData.tourType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="private">Private</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>
        );

      case "luxuryProperties":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the property"
                rows="2"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Home className="inline w-4 h-4 mr-2" />
                  Property Type *
                </label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  placeholder="e.g., Villa, Resort, Hotel"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.propertyType ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.propertyType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.propertyType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  placeholder="Pool, Spa, Gym (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Time
                </label>
                <input
                  type="time"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Time
                </label>
                <input
                  type="time"
                  name="checkOutTime"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "guides":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Guide Name *
              </label>
              <input
                type="text"
                name="guideName"
                value={formData.guideName}
                onChange={handleChange}
                placeholder="Full name of the guide"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.guideName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.guideName && (
                <p className="text-red-500 text-sm mt-1">{errors.guideName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speciality *
                </label>
                <input
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  placeholder="e.g., Cultural Traditions & Food"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.speciality ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.speciality && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.speciality}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cities Available *
              </label>
              <input
                type="text"
                name="citiesAvailable"
                value={formData.citiesAvailable}
                onChange={handleChange}
                placeholder="Tokyo, Kyoto, Osaka (comma separated)"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.citiesAvailable ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.citiesAvailable && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.citiesAvailable}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken
              </label>
              <input
                type="text"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Japanese, Mandarin (comma separated)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case "cruises":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 12 days"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ship className="inline w-4 h-4 mr-2" />
                  Ship Name *
                </label>
                <input
                  type="text"
                  name="shipName"
                  value={formData.shipName}
                  onChange={handleChange}
                  placeholder="Name of the cruise ship"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.shipName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.shipName && (
                  <p className="text-red-500 text-sm mt-1">{errors.shipName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ports of Call *
              </label>
              <input
                type="text"
                name="ports"
                value={formData.ports}
                onChange={handleChange}
                placeholder="Rome, Barcelona, Monaco (comma separated)"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.ports ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.ports && (
                <p className="text-red-500 text-sm mt-1">{errors.ports}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cabin Type
                </label>
                <select
                  name="cabinType"
                  value={formData.cabinType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Cabin Type</option>
                  <option value="interior">Interior</option>
                  <option value="oceanview">Ocean View</option>
                  <option value="balcony">Balcony</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's Included
                </label>
                <input
                  type="text"
                  name="includes"
                  value={formData.includes}
                  onChange={handleChange}
                  placeholder="Meals, Entertainment, WiFi (comma separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Tour Data Entry
            </h1>
            <p className="text-gray-600">
              Fill in the details to create a new tour, property, guide, or
              cruise entry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.country ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {formData.type !== "guides" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter title"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-2" />
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price in USD"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="inline w-4 h-4 mr-2" />
                  Images (min 1, max 4) *
                </label>
                <div
                  className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    errors.images ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 4MB
                    </p>
                  </div>
                </div>
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`preview ${index}`}
                        className="h-32 w-full object-cover rounded-md shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity font-bold text-lg"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the offering"
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {formData.type && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {types.find((t) => t.value === formData.type)?.label} Details
                </h2>
                {renderTypeSpecificFields()}
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
              >
                Create Entry
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourDataForm;
