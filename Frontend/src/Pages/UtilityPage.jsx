import React, { useEffect, useState } from "react";
import {
  Upload,
  X,
  AlertTriangle,
  CreditCard,
  Calendar,
  User,
  DollarSign,
  Shield,
  CheckCircle,
  Banknote,
  Star,
  Eye,
  MessageSquare,
  ExternalLink,
  ShoppingCart,
  Trash2,
  FileText,
  Clock,
  IdCard,
  LogIn,
} from "lucide-react";
import { BillDetails } from "../components/BillDetails";
import useBillFeeStore from "../../Store/billFeeStore";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuthStore } from "../../Store/authStore";

const BillPaymentPage = () => {
  const [existingBill, setExistingBill] = useState(null);

  const {
    billFee,
    fecthExistingBill,
    uploadBillFeeData,
    loading,
    deleteBill,
    serviceData,
  } = useBillFeeStore();
  const { authenticationState } = useAuthStore();

  const { billType, id: serviceId } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    amountDue: "",
    billNumber: "",
    dueDate: "",
    billImage: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fecthExistingBill(billType, serviceId);
  }, [fecthExistingBill, billType, serviceId]);

  useEffect(() => {
    if (billFee) {
      setExistingBill(billFee);
    }
  }, [billFee]);

  if (loading || !serviceData) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  console.log("rendering");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    const MAX_FILE_SIZE_BYTES = 6 * 1024 * 1024;

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          billImage: "Only image files are allowed.",
        }));
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrors((prev) => ({
          ...prev,
          billImage: "File size exceeds the 6 MB limit.",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setFormData((prev) => ({
          ...prev,
          billImage: base64String,
        }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);

      if (errors.billImage) {
        setErrors((prev) => ({
          ...prev,
          billImage: "",
        }));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      billImage: null,
    }));
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.amountDue.trim()) {
      newErrors.amountDue = "Amount is required";
    } else if (
      isNaN(formData.amountDue) ||
      parseFloat(formData.amountDue) <= 0
    ) {
      newErrors.amountDue = "Please enter a valid amount";
    }

    if (!formData.billNumber.trim()) {
      newErrors.billNumber = "Bill number is required";
    }
    const today = new Date().toISOString().split("T")[0];

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (formData.dueDate < today) {
      newErrors.dueDate = "Due date cannot be in the past";
    }

    if (!formData.billImage) {
      newErrors.billImage = "Bill image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowPopup(true);
    }
  };

  const handleProceedToCheckout = async () => {
    setShowPopup(false);
    const newBill = {
      ...formData,
      amountDue: parseFloat(formData.amountDue).toFixed(2),
      serviceId: serviceId,
      createdAt: new Date().toISOString(),
    };

    const success = await uploadBillFeeData(billType, serviceId, newBill);
    if (sucess) {
      setFormData({
        name: "",
        amountDue: "",
        billNumber: "",
        dueDate: "",
        billImage: null,
      });
      setImagePreview(null);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-5 h-5 text-gray-300 fill-current" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300 fill-current"
        />
      );
    }

    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 relative overflow-hidden">
      {!authenticationState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-red-100 rounded-2xl mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Login Required
              </h3>
              <div className="bg-red-50 rounded-2xl p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  To use this service, you must{" "}
                  <span className="font-bold text-red-600">log in</span> or{" "}
                  <span className="font-bold text-red-600">
                    create an account
                  </span>
                  .
                </p>
                <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-red-500">
                  <p className="text-sm text-gray-600">
                    <strong>🔒 Note:</strong> Authentication is required to
                    continue.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Link to="/login">
                  <button className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Login / Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Service Header */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Section - Service Info */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <img
                    className="w-16 h-16 rounded-3xl object-cover"
                    src={serviceData.image.url}
                    alt="Service Logo"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-3 mb-2 flex-wrap">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      {serviceData.serviceName}
                    </h1>
                    <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 text-sm font-medium">
                        Verified
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium mb-3">
                    {serviceData.category}
                  </p>

                  {/* Rating Section */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(serviceData.rating)}
                      </div>
                      <span className="text-lg font-bold text-gray-900">
                        {serviceData.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] min-w-0">
                  <Eye className="w-5 h-5" />
                  <span className="whitespace-nowrap">View Details</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] shadow-lg min-w-0">
                  <MessageSquare className="w-5 h-5" />
                  <span className="whitespace-nowrap">View Reviews</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Info Section */}
            <div className="lg:sticky lg:top-8">
              <div className="space-y-8">
                {/* Header */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-2xl mb-6 shadow-lg">
                    <CreditCard className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    How <span className="text-red-600">This</span> Works
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    A simple, secure way to take care of your bills quickly.
                    Here's how our system works.
                  </p>
                </div>

                {/* How It Works Steps */}
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Step 1: Provide Your Information
                      </h3>
                      <p className="text-gray-600">
                        Enter your billing details securely into our system. Our
                        advanced encryption ensures your data remains protected
                        at all times.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Step 2: Make the Payment
                      </h3>
                      <p className="text-gray-600">
                        Confirm your payment securely. Your payment will be
                        processed instantly, ensuring that the transaction is
                        smooth and fast.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Banknote className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Step 3: We Handle the Rest
                      </h3>
                      <p className="text-gray-600">
                        Once payment is confirmed, our system will handle the
                        bill payment on your behalf, ensuring it's processed on
                        time and without any hassle.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form or Bill Details */}
            {existingBill ? (
              <BillDetails
                existingBill={existingBill}
                setExistingBill={setExistingBill}
                deleteBill={deleteBill}
              />
            ) : (
              <div className="w-full">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
                  <div className="space-y-8">
                    {/* Form Header */}
                    <div className="text-center pb-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Details
                      </h3>
                      <p className="text-gray-600">
                        Please fill in your bill information accurately
                      </p>
                    </div>

                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-red-600" />
                        </div>
                        Name on Bill
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 ${
                            errors.name
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="Enter the name as it appears on your bill"
                        />
                        {errors.name && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.name && (
                        <p className="text-red-600 text-sm font-medium flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Amount Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <DollarSign className="w-4 h-4 text-red-600" />
                        </div>
                        Amount Due
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold text-lg">
                          $
                        </div>
                        <input
                          type="number"
                          name="amountDue"
                          value={formData.amountDue}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className={`w-full pl-10 pr-6 py-4 bg-white border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 ${
                            errors.amountDue
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="0.00"
                        />
                        {errors.amountDue && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.amountDue && (
                        <p className="text-red-600 text-sm font-medium flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{errors.amountDue}</span>
                        </p>
                      )}
                    </div>

                    {/* Bill Number Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-4 h-4 text-red-600" />
                        </div>
                        Bill Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="billNumber"
                          value={formData.billNumber}
                          onChange={handleInputChange}
                          className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 ${
                            errors.billNumber
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="Enter your bill number or account number"
                        />
                        {errors.billNumber && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.billNumber && (
                        <p className="text-red-600 text-sm font-medium flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{errors.billNumber}</span>
                        </p>
                      )}
                    </div>

                    {/* Due Date Field */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-red-600" />
                        </div>
                        Due Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleInputChange}
                          className={`w-full px-6 py-4 bg-white border-2 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-200 ${
                            errors.dueDate
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        />
                        {errors.dueDate && (
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.dueDate && (
                        <p className="text-red-600 text-sm font-medium flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{errors.dueDate}</span>
                        </p>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-800 mb-3">
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                          <Upload className="w-4 h-4 text-red-600" />
                        </div>
                        Upload Bill Image
                      </label>

                      {imagePreview ? (
                        <div className="relative group">
                          <img
                            src={imagePreview}
                            alt="Bill preview"
                            className="w-full h-60 object-cover rounded-2xl border-2 border-gray-200 group-hover:scale-[1.02] transition-transform"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200 shadow-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                            dragActive
                              ? "border-red-400 bg-red-50"
                              : errors.billImage
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                                <Upload className="w-8 h-8 text-gray-400" />
                              </div>
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-gray-900 mb-2">
                                Upload your bill image
                              </p>
                              <p className="text-gray-600 mb-4">
                                Drag and drop your bill image here, or click to
                                browse
                              </p>
                              <label className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer transition-colors duration-200">
                                <Upload className="w-5 h-5" />
                                <span>Choose File</span>
                                <input
                                  type="file"
                                  onChange={handleImageUpload}
                                  accept="image/*"
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <p className="text-sm text-gray-500">
                              Maximum file size: 6MB. Supported formats: JPG,
                              PNG, GIF
                            </p>
                          </div>
                        </div>
                      )}

                      {errors.billImage && (
                        <p className="text-red-600 text-sm font-medium flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{errors.billImage}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-4 px-6 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-red-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl"
                    >
                      Submit Bill Information
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 transform  shadow-2xl border border-white/20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-red-100 rounded-2xl mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Verification Required
              </h3>
              <div className="bg-red-50 rounded-2xl p-6 mb-8">
                <p className="text-gray-700 leading-relaxed">
                  Please double-check that the{" "}
                  <span className="font-bold text-red-600">name</span> and{" "}
                  <span className="font-bold text-red-600">amountDue</span> you
                  entered match exactly with what's shown on your uploaded bill.
                </p>
                <div className="mt-4 p-4 bg-white rounded-xl border-l-4 border-red-500">
                  <p className="text-sm text-gray-600">
                    <strong>⚠️ Important:</strong> Mismatched information can
                    result in payment failure.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-red-600"></div>
                  <p className="ml-4 text-lg font-semibold text-gray-700">
                    Submitting...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-red-700 hover:to-rose-700 transition-all transform hover:scale-[1.02] shadow-lg"
                  >
                    ✓ Information is Correct, Submit
                  </button>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="w-full bg-gray-100 text-gray-700 py-4 px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Let Me Review Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillPaymentPage;
