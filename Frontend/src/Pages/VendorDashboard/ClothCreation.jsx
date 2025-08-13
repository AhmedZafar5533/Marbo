import { useState } from "react";
import { useClothingStore } from "../../../Store/clothingStore";
import { useProductStore } from "../../../Store/productsStore";

const ClothingUploadForm = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",

    brand: "",
    price: "",
    quantity: "",
    description: "",
    features: [],
    images: [],
    sizes: [],
    colors: [],

    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [currentFeature, setCurrentFeature] = useState("");
  const [currentSize, setCurrentSize] = useState("");
  const [currentColor, setCurrentColor] = useState("");

  const { addProduct } = useProductStore();

  const categories = [
    "Tops",
    "Bottoms",
    "Dresses",
    "Outerwear",
    "Underwear & Lingerie",
    "Activewear",
    "Sleepwear",
    "Swimwear",
    "Accessories",
    "Footwear",
  ];

  const genderOptions = ["Men", "Women", "Unisex", "Kids", "Boys", "Girls"];

  const commonSizes = {
    Tops: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    Bottoms: ["26", "28", "30", "32", "34", "36", "38", "40", "42"],
    Dresses: ["XS", "S", "M", "L", "XL", "XXL"],
    Outerwear: ["XS", "S", "M", "L", "XL", "XXL"],
    Footwear: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be a valid positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.sizes.length === 0) {
      newErrors.sizes = "At least one size is required";
    }

    if (formData.colors.length === 0) {
      newErrors.colors = "At least one color is required";
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

    if (formData.images.length + fileArray.length > 4) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 4 images allowed",
      }));
      return;
    }

    const validFiles = fileArray.filter((file) => {
      const isValid = file.type.startsWith("image/");
      const isValidSize = file.size <= 2 * 1024 * 1024; // 3MB limit

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
          images: "Image size should be less than 3MB",
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

  const addItem = (type, value, current, setCurrent) => {
    if (value.trim() && !formData[type].includes(value.trim())) {
      setFormData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));
      setCurrent("");
    }
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const addSizeFromPreset = (size) => {
    if (!formData.sizes.includes(size)) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, size],
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        typeOf: "Clothing",
        images: formData.images.map((img) => ({
          base64Image: img.base64,
        })),
      };

      console.log("Submitting clothing data:", submissionData);

      const success = await addProduct(submissionData);
      if (success) {
        setFormData({
          productName: "",
          category: "",

          brand: "",
          price: "",
          quantity: "",
          description: "",
          features: [],
          images: [],
          sizes: [],
          colors: [],
          gender: "",
        });
      }
    } catch (error) {
      console.error("Error uploading clothing:", error);
      alert("Error uploading clothing. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl mb-6">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Add New Clothing Item
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Showcase your fashion pieces and reach style-conscious customers
              worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Basic Information Section */}
          <div className="p-8 sm:p-10">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-pink-600 font-semibold text-sm">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Product Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 ${
                    errors.productName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="e.g., Vintage Denim Jacket, Summer Floral Dress"
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
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Choose category</option>
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
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                  placeholder="e.g., Nike, Zara, Custom Brand"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 ${
                    errors.gender
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.gender}
                  </p>
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
                    className={`w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 ${
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
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 ${
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
                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Describe your clothing item in detail. Include styling tips, occasions to wear, fabric feel, and what makes it special..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Sizes Section */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <label className="text-sm font-semibold text-gray-700">
                  Available Sizes <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                {/* Quick size buttons */}
                {formData.category && commonSizes[formData.category] && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 font-semibold mb-3">
                      Quick Add:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {commonSizes[formData.category].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => addSizeFromPreset(size)}
                          disabled={formData.sizes.includes(size)}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={currentSize}
                    onChange={(e) => setCurrentSize(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200"
                    placeholder="Enter custom size (e.g., XL, 32, EU 40)"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem("sizes", currentSize, currentSize, setCurrentSize)
                    }
                    disabled={!currentSize.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>

                {formData.sizes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map((size, index) => (
                      <div
                        key={index}
                        className="bg-white px-4 py-2 rounded-xl border border-gray-200 flex items-center group hover:border-pink-200 hover:bg-pink-50 transition-all duration-200"
                      >
                        <span className="text-gray-700 font-medium mr-2">
                          {size}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem("sizes", index)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 font-medium">
                      No sizes added yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add available sizes for this item
                    </p>
                  </div>
                )}
                {errors.sizes && (
                  <p className="mt-3 text-sm text-red-600 font-medium">
                    {errors.sizes}
                  </p>
                )}
              </div>
            </div>

            {/* Colors Section */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <label className="text-sm font-semibold text-gray-700">
                  Available Colors <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => setCurrentColor(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200"
                    placeholder="Enter color (e.g., Navy Blue, Forest Green, Rose Gold)"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem(
                        "colors",
                        currentColor,
                        currentColor,
                        setCurrentColor
                      )
                    }
                    disabled={!currentColor.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>

                {formData.colors.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.colors.map((color, index) => (
                      <div
                        key={index}
                        className="bg-white px-4 py-2 rounded-xl border border-gray-200 flex items-center group hover:border-pink-200 hover:bg-pink-50 transition-all duration-200"
                      >
                        <span className="text-gray-700 font-medium mr-2">
                          {color}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem("colors", index)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 font-medium">
                      No colors added yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add available colors for this item
                    </p>
                  </div>
                )}
                {errors.colors && (
                  <p className="mt-3 text-sm text-red-600 font-medium">
                    {errors.colors}
                  </p>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-3 h-3 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <label className="text-sm font-semibold text-gray-700">
                  Features
                </label>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all duration-200"
                    placeholder="Enter feature (e.g., Waterproof, Breathable, UV Protection)"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      addItem(
                        "features",
                        currentFeature,
                        currentFeature,
                        setCurrentFeature
                      )
                    }
                    disabled={!currentFeature.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>

                {formData.features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white px-4 py-2 rounded-xl border border-gray-200 flex items-center group hover:border-pink-200 hover:bg-pink-50 transition-all duration-200"
                      >
                        <span className="text-gray-700 font-medium mr-2">
                          {feature}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem("features", index)}
                          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 font-medium">
                      No features added yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add features or benefits
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="p-8 sm:p-10 bg-gray-50">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-pink-600 font-semibold text-sm">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Product Images
              </h2>
            </div>

            <div className="mb-8">
              <div
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-300 hover:border-pink-300 hover:bg-pink-25"
                } ${errors.images ? "border-red-300 bg-red-50" : ""}`}
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
                />

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Upload Product Images
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Drag and drop your images here, or click to browse. Upload
                    up to 4 high-quality images.
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Max 4 images
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Under 2MB each
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      JPG, PNG, WebP
                    </div>
                  </div>
                </div>
              </div>

              {errors.images && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  {errors.images}
                </p>
              )}
            </div>

            {/* Uploaded Images Preview */}
            {formData.images.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Uploaded Images ({formData.images.length}/6)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={image.base64}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <svg
                          className="w-3 h-3"
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

                      <div className="mt-2 text-xs text-gray-500">
                        <p className="truncate font-medium">{image.name}</p>
                        <p>{formatFileSize(image.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Section */}
          <div className="p-8 sm:p-10 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p className="font-medium">
                  Ready to upload your clothing item?
                </p>
                <p>Make sure all required fields are filled out correctly.</p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center"
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
                      Uploading...
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
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4"
                        />
                      </svg>
                      Upload Clothing Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClothingUploadForm;
