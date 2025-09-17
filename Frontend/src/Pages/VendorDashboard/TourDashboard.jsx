import React, { useState, useEffect, useMemo } from "react";

import {
  Eye,
  Edit3,
  Trash2,
  Filter,
  X,
  Loader,
  MapPin,
  DollarSign,
  Calendar,
  Camera,
  User,
  CheckCircle,
  XCircle,
  PlusCircle,
  Languages,
  Tag,
  Plus,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTourStore } from "../../../Store/tourStore";

const TourDataForm = ({
  initialData = null,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const initialFormState = {
    country: "",
    category: "",
    name: "",
    location: "",
    price: "",
    images: [], // Holds Base64 strings for new uploads or URLs for existing images.
    description: "",
    // Tour-specific fields
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
    // Guide-specific fields
    gender: "",
    spokenLanguages: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  // NEW: State to store the original form data for change comparison
  const [originalFormData, setOriginalFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Effect to populate the form when editing
  useEffect(() => {
    if (isEditing && initialData) {
      const arrayToString = (arr) => (Array.isArray(arr) ? arr.join("\n") : "");

      const transformedData = {
        ...initialFormState,
        ...initialData,
        category: initialData.category || initialData.type || "",
        inclusions: arrayToString(initialData.inclusions),
        exclusions: arrayToString(initialData.exclusions),
        spokenLanguages: Array.isArray(initialData.spokenLanguages)
          ? initialData.spokenLanguages.join(", ")
          : "",
        detailedInclusions: {
          accommodation: arrayToString(
            initialData.detailedInclusions?.accommodation
          ),
          transfers: arrayToString(initialData.detailedInclusions?.transfers),
          sightseeing: arrayToString(
            initialData.detailedInclusions?.sightseeing
          ),
          domesticFlights: arrayToString(
            initialData.detailedInclusions?.domesticFlights
          ),
          freeItems: arrayToString(initialData.detailedInclusions?.freeItems),
        },
        images: initialData.images?.map((img) => img.imageUrl) || [],
      };

      setFormData(transformedData);
      // NEW: Store the initial state for comparison
      setOriginalFormData(transformedData);
      setImagePreviews(initialData.images?.map((img) => img.imageUrl) || []);
    }
  }, [initialData, isEditing]);

  // NEW: Memoized value to check if the form has been changed
  const hasChanges = useMemo(() => {
    // If not in editing mode, the button should always be enabled
    if (!isEditing || !originalFormData) {
      return true;
    }
    // Compare the current form data with the original state by converting them to strings
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  }, [formData, originalFormData, isEditing]);

  const countries = ["Egypt", "Saudi Arabia", "Lebanon", "Jordan", "Iraq"];
  const types = [
    { value: "smallGroupTour", label: "Small Group Tour" },
    { value: "privateTour", label: "Private Tour" },
    { value: "guides", label: "Tour Guides" },
    { value: "luxuryProperties", label: "Luxury Properties" },
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 4) {
      setErrors((prev) => ({
        ...prev,
        images: "You can only upload a maximum of 4 images.",
      }));
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      // This function converts the image file to a Base64 string
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
        setImagePreviews((prev) => [...prev, reader.result]);
      };
    });
  };

  // (Other handlers like handleDaySelectionChange, handleItineraryChange, etc. remain the same)
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
      detailedInclusions: { ...prev.detailedInclusions, [name]: value },
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.category) newErrors.category = "Type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const stringToArray = (str) =>
      typeof str === "string"
        ? str.split("\n").filter((l) => l.trim() !== "")
        : [];

    const createDataObject = () => {
      const baseData = {
        name: formData.name,
        location: formData.location,
        country: formData.country,
        category: formData.category,
        description: formData.description,
        images: formData.images.map((img) => ({ imageUrl: img })),
        ...(isEditing && { _id: initialData._id }),
      };

      switch (formData.category) {
        case "smallGroupTour":
        case "privateTour":
          return {
            ...baseData,
            price: parseInt(formData.price) || 0,
            duration: parseInt(formData.duration) || 0,
            operates: formData.operates,
            selectedDays:
              formData.operates === "selected" ? formData.selectedDays : [],
            inclusions: stringToArray(formData.inclusions),
            exclusions: stringToArray(formData.exclusions),
            itinerary: formData.itinerary,
            detailedInclusions: {
              accommodation: stringToArray(
                formData.detailedInclusions.accommodation
              ),
              transfers: stringToArray(formData.detailedInclusions.transfers),
              sightseeing: stringToArray(
                formData.detailedInclusions.sightseeing
              ),
              domesticFlights: stringToArray(
                formData.detailedInclusions.domesticFlights
              ),
              freeItems: stringToArray(formData.detailedInclusions.freeItems),
            },
          };
        case "guides":
          return {
            ...baseData,
            gender: formData.gender,
            spokenLanguages: formData.spokenLanguages
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l),
          };
        default:
          return baseData;
      }
    };

    const finalData = createDataObject();
    await onSave(finalData);
    setIsLoading(false);
  };

  const renderTypeSpecificFields = () => {
    switch (formData.category) {
      case "smallGroupTour":
      case "privateTour":
        return (
          <div className="space-y-8">
            {/* ... All tour-specific fields JSX ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-2" />
                  Duration (Days) *
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
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="mr-2" size={20} />
                Add Day
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Detailed Inclusions
              </h3>
              <div className="space-y-4">
                <textarea
                  name="accommodation"
                  placeholder="Luxury Accommodation"
                  value={formData.detailedInclusions.accommodation}
                  onChange={handleDetailedInclusionChange}
                  rows="3"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="transfers"
                  placeholder="Transfers"
                  value={formData.detailedInclusions.transfers}
                  onChange={handleDetailedInclusionChange}
                  rows="3"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="sightseeing"
                  placeholder="Sightseeing"
                  value={formData.detailedInclusions.sightseeing}
                  onChange={handleDetailedInclusionChange}
                  rows="3"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="domesticFlights"
                  placeholder="Domestic Flights"
                  value={formData.detailedInclusions.domesticFlights}
                  onChange={handleDetailedInclusionChange}
                  rows="2"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="freeItems"
                  placeholder="Free Items"
                  value={formData.detailedInclusions.freeItems}
                  onChange={handleDetailedInclusionChange}
                  rows="2"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
      case "guides":
        return (
          // ... Guide-specific fields JSX ...
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? `Editing: ${initialData?.name}` : "Create New Entry"}
          </h1>
          <p className="text-gray-600 mb-8">
            {isEditing
              ? "Update the details below."
              : "Fill in the details to create a new entry."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* ... Form JSX ... */}
            {/* Basic Information Section */}
            <div className="bg-gray-50 rounded-lg p-6 border">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... Country and Type Selectors ... */}
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
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Type</option>
                    {types.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* ... Name and Location Inputs ... */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.category === "guides"
                      ? "Guide Name"
                      : "Tour / Property Name"}{" "}
                    *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
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
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {(formData.category === "privateTour" ||
                formData.category === "smallGroupTour") && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="inline w-4 h-4 mr-2" />
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 1500"
                    min="0"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
              )}
              {/* ... Image Uploader and Previews ... */}
              {/* <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Camera className="inline w-4 h-4 mr-2" />
                  Images (max 4)
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
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
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
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-32 w-full object-cover rounded-md shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )} */}
              {/* ... Description ... */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description..."
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Type-Specific Fields Section */}
            {formData.category && (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {types.find((t) => t.value === formData.category)?.label}{" "}
                  Details
                </h2>
                {renderTypeSpecificFields()}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                // UPDATE: Disable if loading OR if it's editing mode and no changes have been made
                disabled={isLoading || (isEditing && !hasChanges)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center justify-center transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      {/* ... SVG Loader ... */}
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
                    Saving...
                  </>
                ) : isEditing ? (
                  "Save Changes"
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

const EditEntryModal = ({ tour, onSave, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="w-full">
        <TourDataForm
          isEditing={true}
          initialData={tour}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

const TourDashboard = () => {
  const [filters, setFilters] = useState({ country: "", type: "" });
  const [viewModalData, setViewModalData] = useState(null);
  const [editModalData, setEditModalData] = useState(null);
  const [deleteConfirmData, setDeleteConfirmData] = useState(null);

  // --- Constants for Filters ---
  const countries = ["Egypt", "Saudi Arabia", "Lebanon", "Jordan", "Iraq"];
  const types = [
    { value: "smallGroupTour", label: "Small Group Tour" },
    { value: "privateTour", label: "Private Tour" },
    { value: "privateTours", label: "Private Tour" },
    { value: "luxuryProperties", label: "Luxury Properties" },
    { value: "guides", label: "Tour Guides" },
    { value: "cruises", label: "Cruises" },
  ];

  const { getDashboardTours, dashboardData, loading, deleteTour, updateTour } =
    useTourStore();

  useEffect(() => {
    getDashboardTours();
  }, [getDashboardTours]); // Dependency array ensures this runs once

  // --- Event Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (tourId) => {
    // Call the delete action from the store
    await deleteTour(tourId);
    setDeleteConfirmData(null); // Close the confirmation modal
    getDashboardTours(); // Refetch data to ensure the UI is up-to-date
  };

  const handleSaveEdit = async (updatedTourData) => {
    // Call the update action from the store
    await updateTour(updatedTourData._id, updatedTourData);
    setEditModalData(null); // Close the edit modal
    getDashboardTours(); // Refetch data
  };

  // --- Derived State (Memoized Filtering) ---
  const filteredTours = useMemo(() => {
    console.log(dashboardData);
    if (!Array.isArray(dashboardData)) return [];

    return dashboardData.filter((tour) => {
      // CORRECTION: Check both `category` and `type` fields for the tour type
      const tourType = tour.category || tour.type;
      const countryMatch = filters.country
        ? tour.country === filters.country
        : true;
      const typeMatch = filters.type ? tourType === filters.type : true;
      return countryMatch && typeMatch;
    });
  }, [dashboardData, filters]);

  // --- Helper Function ---
  // A robust way to get the display label for a tour's type,
  // handling the inconsistent `category` vs `type` field name.
  const getTourTypeLabel = (tour) => {
    const tourTypeIdentifier = tour.category || tour.type;
    const typeObject = types.find((t) => t.value === tourTypeIdentifier);
    return typeObject ? typeObject.label : tourTypeIdentifier;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filter Section */}
        <div className="bg-white shadow-lg rounded-2xl border border-indigo-100 mb-8">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-indigo-900 flex items-center">
                  Tour Management Dashboard
                </h1>
                <p className="text-indigo-600 mt-1">Manage your tours</p>
              </div>
              <Link
                to={"/dashboard/vendor/add/tours/"}
                className="mt-4 md:mt-0"
              >
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center transform hover:scale-105">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Tour
                </button>
              </Link>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <Filter className="w-6 h-6 text-gray-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Filter Entries
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <select
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setFilters({ country: "", type: "" })}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* CORRECTION: Use `loading` from the store */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="animate-spin text-blue-600" size={48} />
            </div>
          ) : filteredTours.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {/* CORRECTION: Header changed from "Title" to "Name" */}
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTours.map((tour) => (
                    <tr
                      key={tour._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* CORRECTION: Use `tour.name` instead of `tour.title` */}
                        <p className="font-medium text-gray-900">{tour.name}</p>
                        <p className="text-sm text-gray-500">{tour.location}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {/* CORRECTION: Use helper to display the correct type */}
                          {getTourTypeLabel(tour)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {tour.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {tour.price ? `$${tour.price}` : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center items-center space-x-2">
                          <button
                            onClick={() => setViewModalData(tour)}
                            className="p-2 text-gray-500 hover:text-blue-600"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            onClick={() => setEditModalData(tour)}
                            className="p-2 text-gray-500 hover:text-green-600"
                          >
                            <Edit3 size={20} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmData(tour)}
                            className="p-2 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12">
              <h3 className="text-xl font-medium text-gray-800">
                No Entries Found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your filters or adding a new entry.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              {/* CORRECTION: Use `viewModalData.name` */}
              <h2 className="text-2xl font-bold text-gray-900">
                {viewModalData.name}
              </h2>
              <button
                onClick={() => setViewModalData(null)}
                className="p-2 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                <Globe className="inline mr-2" size={16} />{" "}
                <strong>Country:</strong> {viewModalData.country}
              </p>
              <p>
                <MapPin className="inline mr-2" size={16} />{" "}
                <strong>Location:</strong> {viewModalData.location}
              </p>
              <p>
                <Tag className="inline mr-2" size={16} /> <strong>Type:</strong>{" "}
                {getTourTypeLabel(viewModalData)}
              </p>
              {viewModalData.price && (
                <p>
                  <DollarSign className="inline mr-2" size={16} />{" "}
                  <strong>Price:</strong> ${viewModalData.price}
                </p>
              )}
              <div className="pt-2">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {viewModalData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalData && (
        <EditEntryModal
          tour={editModalData}
          onClose={() => setEditModalData(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800">
              Confirm Deletion
            </h2>
            {/* CORRECTION: Use `deleteConfirmData.name` */}
            <p className="text-gray-600 my-4">
              Are you sure you want to delete "{deleteConfirmData.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setDeleteConfirmData(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmData._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDashboard;
