import { useState, useEffect } from "react";
import { useVendorStore } from "../../../Store/vendorStore";
import ErrorBoundary from "../ErrorBoundary";
import { toast } from "sonner";

const BusinessInformationWithErrorBoundary = (props) => (
  <ErrorBoundary>
    <BusinessInformation {...props} />
  </ErrorBoundary>
);

const BusinessInformation = ({ nextStep, currentStep, totalSteps }) => {
  const {
    goToNextStep,
    loading,
    sendBusinessDetails,
    vendor,
    unsetGotoNextStep,
  } = useVendorStore();

  const [formData, setFormData] = useState({
    businessName: "",
    legalBusinessName: "",
    businessType: "",
    businessIndustry: "",
    registrationNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [isFormModified, setIsFormModified] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);

  const validationRules = {
    businessName: /^[a-zA-Z0-9\s]{2,}$/,
    legalBusinessName: /^[a-zA-Z0-9\s]{2,}$/,
    businessIndustry: /^[a-zA-Z\s]+$/,
    registrationNumber: /^[a-zA-Z0-9]{5,20}$/,
  };

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsFormModified(true);
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";
    if (!value) {
      errorMessage = "This field is required.";
    } else if (validationRules[name] && !validationRules[name].test(value)) {
      switch (name) {
        case "businessName":
        case "legalBusinessName":
          errorMessage = "Must be at least 2 characters long.";
          break;
        case "businessIndustry":
          errorMessage = "Only letters and spaces are allowed.";
          break;
        case "registrationNumber":
          errorMessage = "Must be 5-20 alphanumeric characters.";
          break;
        default:
          break;
      }
    }
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
    return !errorMessage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    let validationErrors = {};
    Object.keys(formData).forEach((key) => {
      const valid = validateField(key, formData[key]);
      if (!valid)
        validationErrors[key] = errors[key] || "This field is required.";
    });

    if (Object.values(validationErrors).some((err) => err)) {
      setErrors(validationErrors);
      return;
    }

    // If nothing changed from initial, just go next
    if (
      !isFormModified &&
      initialFormData &&
      JSON.stringify(formData) === JSON.stringify(initialFormData)
    ) {
      nextStep();
      return;
    }

    // Save and await backend
    await sendBusinessDetails(formData);
  };

  // Watch store flag to move to next step exactly once
  useEffect(() => {
    if (goToNextStep) {
      nextStep();
      unsetGotoNextStep();
    }
  }, [goToNextStep, nextStep, unsetGotoNextStep]);

  // Populate form from store
  useEffect(() => {
    if (vendor && vendor.length > 0) {
      const data = vendor[0]?.businessDetails;
      if (data) {
        const vendorData = {
          businessName: data.businessName || "",
          legalBusinessName: data.legalBusinessName || "",
          businessType: data.businessType || "",
          businessIndustry: data.businessIndustry || "",
          registrationNumber: data.registrationNumber || "",
        };
        setFormData(vendorData);
        setInitialFormData(vendorData);
        setIsFormModified(false);
      }
    }
  }, [vendor]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        {/* Business Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Business Name*
          </label>
          <input
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter your business name"
          />
          {errors.businessName && (
            <p className="text-red-500 text-sm">{errors.businessName}</p>
          )}
        </div>

        {/* Legal Business Name */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Legal Business Name*
          </label>
          <input
            name="legalBusinessName"
            value={formData.legalBusinessName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Enter legal business name"
          />
          {errors.legalBusinessName && (
            <p className="text-red-500 text-sm">{errors.legalBusinessName}</p>
          )}
        </div>

        {/* Business Type */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Business Type*
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">Select Business Type</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership">Partnership</option>
            <option value="LLC">LLC</option>
            <option value="Corporation">Corporation</option>
            <option value="Other">Other</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        {/* Business Industry */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Business Industry*
          </label>
          <select
            name="businessIndustry"
            value={formData.businessIndustry}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">Select category</option>
            <option value="Agricultural Services">Agricultural Services</option>
            <option value="Arts & Crafts">Arts & Crafts</option>
            <option value="Banking Services">Banking Services</option>
            <option value="Construction">Construction</option>
            <option value="Construction Services">Construction Services</option>
            <option value="Domestic Staffing">Domestic Staffing</option>
            <option value="Education">Education</option>
            <option value="Event Management">Event Management</option>
            <option value="Fashion Services">Fashion Services</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Groceries">Groceries</option>
            <option value="Hardware Suppliers">Hardware Suppliers</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Health Insurance">Health Insurance</option>
            <option value="Holiday Lets">Holiday Lets</option>
            <option value="Home Services">Home Services</option>
            <option value="Hotel Booking">Hotel Booking</option>
            <option value="Interior Design">Interior Design</option>
            <option value="Land Acquisition">Land Acquisition</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Medical Care">Medical Care</option>
            <option value="Money Transfer Services">
              Money Transfer Services
            </option>
            <option value="Mortgage Services">Mortgage Services</option>
            <option value="Payments & Utilities">Payments & Utilities</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Properties for Sale">Properties for Sale</option>
            <option value="Property Management">Property Management</option>
            <option value="Real Estate & Property">
              Real Estate & Property
            </option>
            <option value="Rent Collection">Rent Collection</option>
            <option value="Rental Properties">Rental Properties</option>
            <option value="School Fee Payments">School Fee Payments</option>
            <option value="Tech Supplies">Tech Supplies</option>
            <option value="Technology & Communication">
              Technology & Communication
            </option>
            <option value="Telecom Services">Telecom Services</option>
            <option value="Traditional Clothing">Traditional Clothing</option>
            <option value="Utility Payments">Utility Payments</option>
            <option value="Water Bill Payments">Water Bill Payments</option>
          </select>

          {errors.businessIndustry && (
            <p className="text-red-500 text-sm">{errors.businessIndustry}</p>
          )}
        </div>

        {/* Registration Number */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Registration Number*
          </label>
          <input
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
            placeholder="Business registration number"
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm">{errors.registrationNumber}</p>
          )}
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-8 border-t border-gray-200">
          {currentStep < totalSteps && (
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 text-white rounded-lg font-medium transition transform duration-200 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-1"
              }`}
            >
              Continue
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BusinessInformationWithErrorBoundary;
