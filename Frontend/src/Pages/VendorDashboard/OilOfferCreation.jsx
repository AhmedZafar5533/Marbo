import { useState } from "react";
import { useOilOfferStore } from "../../../Store/OilOfferStore";

const OilOfferForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    pricePerLiter: "",
    maxLimit: "",
    voucherValidity: "",
    description: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { addOilOffer } = useOilOfferStore();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Offer title is required";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.pricePerLiter) {
      newErrors.pricePerLiter = "Price per liter is required";
    } else if (
      isNaN(formData.pricePerLiter) ||
      parseFloat(formData.pricePerLiter) <= 0
    ) {
      newErrors.pricePerLiter = "Price must be a valid positive number";
    }

    if (!formData.maxLimit) {
      newErrors.maxLimit = "Max purchase limit is required";
    } else if (isNaN(formData.maxLimit) || parseInt(formData.maxLimit) <= 0) {
      newErrors.maxLimit = "Max limit must be a valid positive number";
    }

    if (!formData.voucherValidity) {
      newErrors.voucherValidity = "Voucher validity is required";
    } else if (
      isNaN(formData.voucherValidity) ||
      parseInt(formData.voucherValidity) <= 0
    ) {
      newErrors.voucherValidity =
        "Validity must be a positive number of months";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.images.length === 0) {
      newErrors.images = "An image for the offer is required";
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

    if (formData.images.length + fileArray.length > 1) {
      setErrors((prev) => ({
        ...prev,
        images: "Only 1 image is allowed for an offer",
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
      setErrors((prev) => ({ ...prev, images: "Error processing image" }));
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
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const submissionData = {
        ...formData,
        pricePerLiter: parseFloat(formData.pricePerLiter),
        maxLimit: parseInt(formData.maxLimit),
        voucherValidity: parseInt(formData.voucherValidity),
        image: formData.images[0].base64 || null,
      };

      console.log("Submitting oil offer:", submissionData);
      const success = await addOilOffer(submissionData); // API call

      if (success) {
        alert("Oil offer created successfully!");
        setFormData({
          title: "",
          pricePerLiter: "",
          maxLimit: "",
          voucherValidity: "",
          description: "",
          images: [],
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error uploading offer:", error);
      alert("Error uploading offer. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mb-6">
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
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m6-9h3m-18 0h3m12 5a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Create New Oil Offer
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              List a new fuel purchasing offer to attract more customers to your
              station.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 sm:p-10">
            <div className="flex items-center mb-8">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-semibold text-sm">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Offer Details
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Offer Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all duration-200 ${
                    errors.title
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="e.g., Premium Diesel Winter Special"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price per Liter (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    name="pricePerLiter"
                    value={formData.pricePerLiter}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all duration-200 ${
                      errors.pricePerLiter
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="1.50"
                  />
                </div>
                {errors.pricePerLiter && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.pricePerLiter}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Max Purchase Limit (Liters){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="maxLimit"
                  value={formData.maxLimit}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all duration-200 ${
                    errors.maxLimit
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="e.g., 500"
                />
                {errors.maxLimit && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.maxLimit}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Voucher Validity (Months){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="voucherValidity"
                  value={formData.voucherValidity}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all duration-200 ${
                    errors.voucherValidity
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="e.g., 6"
                />
                {errors.voucherValidity && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.voucherValidity}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Offer Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-yellow-100 focus:border-yellow-500 transition-all duration-200 resize-none ${
                  errors.description
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="Describe the offer. Include any terms and conditions, eligible fuel types, and station locations..."
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-orange-600 font-semibold text-sm">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Offer Image</h3>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-yellow-500 bg-yellow-50"
                    : errors.images
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } ${
                  formData.images.length >= 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-yellow-400 hover:bg-yellow-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={formData.images.length >= 1}
                />
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="h-10 w-10 text-yellow-600"
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
                  {dragActive ? "Drop your image here" : "Upload Offer Image"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop, or click to browse
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-500">
                  JPG, PNG up to 2MB • {formData.images.length}/1 uploaded
                </div>
              </div>
              {errors.images && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  {errors.images}
                </p>
              )}

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

            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-8 border-t border-gray-100">
              <button
                type="button"
                className="px-8 py-4 bg-white text-gray-700 font-semibold border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                onClick={() => {
                  setFormData({
                    title: "",
                    pricePerLiter: "",
                    maxLimit: "",
                    voucherValidity: "",
                    description: "",
                    images: [],
                  });
                  setErrors({});
                }}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg flex items-center justify-center ${
                  isLoading
                    ? "opacity-75 cursor-not-allowed"
                    : "hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Publishing Offer...
                  </>
                ) : (
                  "Publish Offer"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OilOfferForm;
