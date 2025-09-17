import { useState } from "react";
import { useProductStore } from "../../../Store/productsStore";

const TechProductUploadForm = () => {
  const [formData, setFormData] = useState({
    serviceId: "",
    productName: "",
    category: "",
    customCategory: "",
    price: "",
    quantity: "",
    description: "",
    features: [],
    images: [],
    warranty: "no",
    warrantyConditions: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [currentWarrantyCondition, setCurrentWarrantyCondition] = useState("");
  const { addProduct } = useProductStore();

  const categories = [
    "Computers & Laptops",
    "Smartphones & Tablets",
    "Peripherals & Accessories",
    "Networking & Connectivity",
    "Software & Licenses",
    "PC Components",
    "Storage Devices",
    "Printers & Scanners",
    "Audio & Video Equipment",
    "Smart Home Devices",
    "Cables & Adapters",
    "Office Electronics",
    "Drones & Robotics",
    "Gaming Hardware",
    "Wearable Tech",
    "Other",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    } else if (formData.productName.length < 2) {
      newErrors.productName = "Product name must be at least 2 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    } else if (
      formData.category === "Other" &&
      !formData.customCategory.trim()
    ) {
      newErrors.customCategory = "Please specify the category";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be a valid positive number";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    if (
      formData.warranty === "yes" &&
      formData.warrantyConditions.length === 0
    ) {
      newErrors.warrantyConditions =
        "Please add at least one warranty condition";
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

    if (formData.images.length + fileArray.length > 4) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 4 images allowed",
      }));
      return;
    }

    const validFiles = fileArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

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
          images: "Image size should be less than 2MB",
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

  const handleFeatureKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const addWarrantyCondition = () => {
    if (
      currentWarrantyCondition.trim() &&
      !formData.warrantyConditions.includes(currentWarrantyCondition.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        warrantyConditions: [
          ...prev.warrantyConditions,
          currentWarrantyCondition.trim(),
        ],
      }));
      setCurrentWarrantyCondition("");
    }
  };

  const removeWarrantyCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      warrantyConditions: prev.warrantyConditions.filter((_, i) => i !== index),
    }));
  };

  const handleWarrantyConditionKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addWarrantyCondition();
    }
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
      console.log(formData);
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        typeOf: "Tech",
        category:
          formData.category === "Other"
            ? formData.customCategory
            : formData.category,
        images: formData.images.map((img) => ({
          base64Image: img.base64,
        })),
      };

      if (formData.warranty === "no") {
        delete submissionData.warrantyConditions;
      }
      console.log("Submitting product:", submissionData);
      const success = await addProduct(submissionData);

      if (success) {
        setFormData({
          serviceId: "",
          productName: "",
          category: "",
          customCategory: "",
          price: "",
          quantity: "",
          description: "",
          features: [],
          images: [],
          warranty: "no",
          warrantyConditions: [],
        });
        setCurrentFeature("");
        setCurrentWarrantyCondition("");
        alert("Product created successfully!");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Error uploading product. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Create New Product
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Add your tech product to our marketplace and reach thousands of
              customers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Product Details Section */}
          <div className="p-8 sm:p-10">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Product Details
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                    errors.productName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="e.g., Wireless Bluetooth Headphones"
                />
                {errors.productName && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.productName}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.category}
                  </p>
                )}
                {formData.category === "Other" && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Specify Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                        errors.customCategory
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter your custom category"
                    />
                    {errors.customCategory && (
                      <p className="mt-2 text-sm text-red-600 font-medium">
                        {errors.customCategory}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                      errors.price
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity Available <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                    errors.quantity
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="Available stock"
                />
                {errors.quantity && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.quantity}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Describe your product in detail. Include specifications, technical details, compatibility information, and what makes it special..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Features Section */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <label className="text-sm font-semibold text-gray-700">
                  Key Features & Specifications
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={handleFeatureKeyPress}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g., 30-hour battery life, noise cancellation, Bluetooth 5.0..."
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    disabled={!currentFeature.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>

                {/* Features List */}
                {formData.features.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 font-semibold">
                      Added Features:
                    </p>
                    <div className="grid gap-3">
                      {formData.features.map((feature, index) => (
                        <div
                          key={index}
                          className="bg-white px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                        >
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 text-green-500 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 font-medium">
                              {feature}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">
                      No features added yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add key features and specifications to highlight what
                      makes your product special
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Warranty Section */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <label className="text-sm font-semibold text-gray-700">
                  Warranty Information
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Does this product include warranty?
                    </label>
                    <div className="flex gap-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="warranty"
                          value="yes"
                          checked={formData.warranty === "yes"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="warranty"
                          value="no"
                          checked={formData.warranty === "no"}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.warranty === "yes" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warranty Conditions{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={currentWarrantyCondition}
                          onChange={(e) =>
                            setCurrentWarrantyCondition(e.target.value)
                          }
                          onKeyPress={handleWarrantyConditionKeyPress}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                          placeholder="e.g., 1-year limited, covers manufacturing defects..."
                        />
                        <button
                          type="button"
                          onClick={addWarrantyCondition}
                          disabled={!currentWarrantyCondition.trim()}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                          Add
                        </button>
                      </div>
                      {errors.warrantyConditions && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          {errors.warrantyConditions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Warranty Conditions List */}
                {formData.warranty === "yes" && (
                  <div className="space-y-3">
                    {formData.warrantyConditions.length > 0 ? (
                      <>
                        <p className="text-sm text-gray-600 font-semibold">
                          Warranty Conditions:
                        </p>
                        <div className="grid gap-3">
                          {formData.warrantyConditions.map(
                            (condition, index) => (
                              <div
                                key={index}
                                className="bg-white px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="h-4 w-4 text-orange-500 mr-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                  </svg>
                                  <span className="text-gray-700 font-medium">
                                    {condition}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeWarrantyCondition(index)}
                                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                                >
                                  <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 font-medium">
                          No warranty conditions added yet
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Add the specific terms of your product warranty
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Product Images
                </h3>
              </div>

              {/* Drag and Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : errors.images
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } ${
                  formData.images.length >= 4
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={formData.images.length >= 4}
                />

                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {dragActive
                    ? "Drop your images here"
                    : "Upload Product Photos"}
                </h3>

                <p className="text-gray-600 mb-4">
                  Drag and drop your images here, or click to browse your files
                </p>

                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  JPG, PNG, GIF up to 2MB • {formData.images.length}/4 uploaded
                </div>
              </div>

              {errors.images && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  {errors.images}
                </p>
              )}

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-md">
                        <img
                          src={image.base64}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* X button positioned at top-right corner */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center justify-center shadow-lg"
                        aria-label="Remove image"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <div className="mt-3 text-xs text-gray-500 text-center">
                        <p className="truncate font-medium">{image.name}</p>
                        <p className="text-gray-400">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-gray-100">
              <button
                type="button"
                className="px-8 py-4 bg-white text-gray-700 font-semibold border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                onClick={() => {
                  setFormData({
                    serviceId: "",
                    productName: "",
                    category: "",
                    customCategory: "",
                    price: "",
                    quantity: "",
                    description: "",
                    features: [],
                    images: [],
                    warranty: "no",
                    warrantyConditions: [],
                  });
                  setErrors({});
                  setCurrentFeature("");
                  setCurrentWarrantyCondition("");
                }}
              >
                Clear Form
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className={`px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg flex items-center justify-center ${
                  isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:shadow-xl"
                }`}
              >
                {isLoading ? (
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
                    Publishing Product...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Publish Product
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TechProductUploadForm;
