import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  DollarSign,
  Camera,
  User,
  CheckCircle,
  XCircle,
  PlusCircle,
  Trash2,
  Languages,
} from "lucide-react";
// Make sure this path is correct for your project structure
import { useTourStore } from "../../../Store/tourStore";

// Mock store for demonstration since the original is not provided
// const useTourStore = () => ({
//   createTour: async (data) => {
//     console.log("Creating new entry with data:", data);
//     // Simulate an API call
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//     console.log("Entry created successfully.");
//     return true; // Simulate a successful creation
//   },
// });

const TourDataForm = () => {
  const initialFormData = {
    country: "",
    type: "",
    name: "",
    location: "",
    price: "",
    images: [],
    description: "",
    // Tour specific
    duration: "",
    operates: "everyday",
    selectedDays: [],
    inclusions: "",
    exclusions: "",
    itinerary: [{ day: 1, plan: "", meals: "none" }],
    detailedInclusions: {
      accommodation: "",
      transfers: "",
      sightseeing: "",
      domesticFlights: "",
      freeItems: "",
    },
    // Guide specific
    gender: "",
    spokenLanguages: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false); // <-- State for loader

  const countries = ["Egypt", "Saudi Arabia", "Lebanon", "Jordan", "Iraq"];
  const types = [
    { value: "smallGroupTour", label: "Small group tours" },
    { value: "privateTour", label: "Private tours" },
    { value: "luxuryProperties", label: "Luxury Properties" },
    { value: "guides", label: "Tour Guides" },
    { value: "cruises", label: "Cruises" },
  ];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const { createTour } = useTourStore();

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

  const handleDaySelectionChange = (day) => {
    setFormData((prev) => {
      const selectedDays = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays };
    });
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, plan: "", meals: "none" },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    if (formData.itinerary.length <= 1) return;
    const newItinerary = formData.itinerary
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, day: i + 1 }));
    setFormData((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const handleDetailedInclusionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      detailedInclusions: {
        ...prev.detailedInclusions,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let error = "";
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];

    if (newImages.length + files.length > 4) {
      error = "You can only upload a maximum of 4 images.";
      setErrors((prev) => ({ ...prev, images: error }));
      return;
    }

    files.forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        error = `File "${file.name}" exceeds the 4MB size limit.`;
        return;
      }
      if (!file.type.startsWith("image/")) {
        error = `File "${file.name}" is not a valid image type.`;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Here, reader.result is the base64 string
        newImages.push(reader.result);
        newPreviews.push(URL.createObjectURL(file));

        // Check if it's the last file to update state
        if (newImages.length === formData.images.length + files.length) {
          setFormData((prev) => ({ ...prev, images: newImages }));
          setImagePreviews(newPreviews);
          if (errors.images) {
            setErrors((prev) => ({ ...prev, images: "" }));
          }
        }
      };
      reader.onerror = () => {
        error = `Failed to read file "${file.name}".`;
      };
      reader.readAsDataURL(file);
    });

    if (error) {
      setErrors((prev) => ({ ...prev, images: error }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    );
    const updatedPreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    URL.revokeObjectURL(imagePreviews[indexToRemove]); // Clean up object URL
    setFormData((prev) => ({ ...prev, images: updatedImages }));
    setImagePreviews(updatedPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.name) newErrors.name = "A name or name is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required.";

    if (formData.type === "smallGroupTour" || formData.type === "privateTour") {
      if (!formData.price) newErrors.price = "Price is required for tours";
      if (!formData.duration || parseInt(formData.duration) <= 0) {
        newErrors.duration = "Please enter a valid number of days.";
      }
      if (
        formData.operates === "selected" &&
        formData.selectedDays.length === 0
      ) {
        newErrors.selectedDays = "Please select at least one day of operation.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true); // <-- Start loader
    const newEntry = createDataObject();

    try {
      const success = await createTour(newEntry);
      if (success) {
        console.log("Form submission successful!");
        resetForm();
      } else {
        console.error("Failed to create the entry.");
        // Optionally set an error message to display to the user
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
    } finally {
      setLoading(false); // <-- Stop loader regardless of outcome
    }
  };

  const createDataObject = () => {
    const baseData = {
      name: formData.name,
      location: formData.location,
      country: formData.country,
      type: "tours",
      category: formData.type,
      images: formData.images,
      description: formData.description,
    };

    if (formData.type === "smallGroupTour" || formData.type === "privateTour") {
      baseData.price = parseInt(formData.price, 10);
    }

    switch (formData.type) {
      case "smallGroupTour":
      case "privateTour":
        return {
          ...baseData,
          duration: parseInt(formData.duration, 10),
          operates: formData.operates,
          ...(formData.operates === "selected" && {
            selectedDays: formData.selectedDays,
          }),
          inclusions: formData.inclusions
            .split("\n")
            .filter((line) => line.trim() !== ""),
          exclusions: formData.exclusions
            .split("\n")
            .filter((line) => line.trim() !== ""),
          itinerary: formData.itinerary,
          detailedInclusions: {
            accommodation: formData.detailedInclusions.accommodation
              .split("\n")
              .filter((line) => line.trim() !== ""),
            transfers: formData.detailedInclusions.transfers
              .split("\n")
              .filter((line) => line.trim() !== ""),
            sightseeing: formData.detailedInclusions.sightseeing
              .split("\n")
              .filter((line) => line.trim() !== ""),
            domesticFlights: formData.detailedInclusions.domesticFlights
              .split("\n")
              .filter((line) => line.trim() !== ""),
            freeItems: formData.detailedInclusions.freeItems
              .split("\n")
              .filter((line) => line.trim() !== ""),
          },
        };
      case "guides":
        return {
          ...baseData,
          gender: formData.gender,
          spokenLanguages: formData.spokenLanguages
            .split(",")
            .map((lang) => lang.trim())
            .filter((lang) => lang),
        };
      case "cruises":
      case "luxuryProperties":
        return baseData;
      default:
        return baseData;
    }
  };

  const resetForm = () => {
    if (loading) return;
    setFormData(initialFormData);
    setImagePreviews([]);
    setErrors({});
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case "guides":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Languages className="inline w-4 h-4 mr-2" />
                  Spoken Languages
                </label>
                <input
                  type="text"
                  name="spokenLanguages"
                  value={formData.spokenLanguages}
                  onChange={handleChange}
                  placeholder="English, Arabic (comma-separated)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case "smallGroupTour":
      case "privateTour":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Number of Days *
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 7"
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.duration ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Operation Schedule
              </h3>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="operates"
                    value="everyday"
                    checked={formData.operates === "everyday"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Operates Every Day</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="operates"
                    value="selected"
                    checked={formData.operates === "selected"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Select Days</span>
                </label>
              </div>
            </div>

            {formData.operates === "selected" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Operation Days *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {daysOfWeek.map((day) => (
                    <label
                      key={day}
                      className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        value={day.toLowerCase()}
                        checked={formData.selectedDays.includes(
                          day.toLowerCase()
                        )}
                        onChange={() =>
                          handleDaySelectionChange(day.toLowerCase())
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
                {errors.selectedDays && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedDays}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CheckCircle className="inline w-4 h-4 mr-2 text-green-500" />
                  What's Included
                </label>
                <textarea
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleChange}
                  placeholder="List each inclusion on a new line..."
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <XCircle className="inline w-4 h-4 mr-2 text-red-500" />
                  What's Not Included
                </label>
                <textarea
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleChange}
                  placeholder="List each exclusion on a new line..."
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Daily Itinerary
              </h3>
              <div className="space-y-4">
                {formData.itinerary.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-white relative"
                  >
                    <p className="font-semibold text-gray-600 mb-2">
                      Day {item.day}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-3">
                        <label className="text-sm font-medium text-gray-600">
                          Plan
                        </label>
                        <textarea
                          value={item.plan}
                          onChange={(e) =>
                            handleItineraryChange(index, "plan", e.target.value)
                          }
                          placeholder="Describe the plan for this day..."
                          rows="3"
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-600">
                          Meals Included
                        </label>
                        <select
                          value={item.meals}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "meals",
                              e.target.value
                            )
                          }
                          className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                        >
                          <option value="none">None</option>
                          <option value="breakfast">Bed and Breakfast</option>
                          <option value="half-board">Half Board</option>
                          <option value="full-board">Full Board</option>
                        </select>
                      </div>
                    </div>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addItineraryDay}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Day to Itinerary
              </button>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Detailed Inclusions (List items)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Luxury Accommodation
                  </label>
                  <textarea
                    name="accommodation"
                    value={formData.detailedInclusions.accommodation}
                    onChange={handleDetailedInclusionChange}
                    placeholder="Jul 29 - 30: Four Seasons..."
                    rows="4"
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Transfers
                  </label>
                  <textarea
                    name="transfers"
                    value={formData.detailedInclusions.transfers}
                    onChange={handleDetailedInclusionChange}
                    placeholder="Jul 29: Arrival transfer..."
                    rows="4"
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Sightseeing
                  </label>
                  <textarea
                    name="sightseeing"
                    value={formData.detailedInclusions.sightseeing}
                    onChange={handleDetailedInclusionChange}
                    placeholder="Aug 04: Full-day pyramids..."
                    rows="3"
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Domestic Flights
                  </label>
                  <textarea
                    name="domesticFlights"
                    value={formData.detailedInclusions.domesticFlights}
                    onChange={handleDetailedInclusionChange}
                    placeholder="CAI -> ASW..."
                    rows="2"
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Free Items
                  </label>
                  <textarea
                    name="freeItems"
                    value={formData.detailedInclusions.freeItems}
                    onChange={handleDetailedInclusionChange}
                    placeholder="Camel ride..."
                    rows="2"
                    className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "cruises":
      case "luxuryProperties":
        return (
          <div className="text-center py-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              Please fill in the basic information above for the listing.
            </p>
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
              Create New Data Entry
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === "guides" ? "Guide Name" : "Title / Name"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name or name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City or Area"
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

              {/* <-- UPDATED/FIXED: Price field is now conditional --> */}
              {(formData.type === "smallGroupTour" ||
                formData.type === "privateTour") && (
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
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="inline w-4 h-4 mr-2" />
                  Images / Photos (min 1, max 4) *
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
                      PNG, JPG up to 4MB each
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
                  rows="4"
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
                disabled={loading} // <-- UPDATED: Disable when loading
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={loading} // <-- UPDATED: Disable when loading
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 transition-colors font-medium flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {/* <-- UPDATED: Add loader and text change --> */}
                {loading ? (
                  <>
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
                    Creating...
                  </>
                ) : (
                  "Create Entry"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourDataForm;
