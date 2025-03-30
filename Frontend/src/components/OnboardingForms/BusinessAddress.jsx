import { useState, useEffect } from "react";
import { useVendorStore } from "../../../Store/vendorStore";
import ErrorBoundary from "../ErrorBoundary";


/* eslint-disable react/prop-types */

const BusinessAddressWithErrorBoundary = (props) => (
    <ErrorBoundary>
        <BusinessAddress {...props} />
    </ErrorBoundary>
);

const BusinessAddress = ({ prevStep, currentStep, totalSteps }) => {
    const { loading, sendAddressDetails, vendor, unsetGotoNextStep, goToNextStep } = useVendorStore();

    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormModified, setIsFormModified] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);

    useEffect(() => {
        if (goToNextStep)
            unsetGotoNextStep()
    })

    // Validation rules
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "street":
                if (!value.trim()) {
                    error = "Street address is required.";
                } else if (!/^[a-zA-Z0-9\s,'-]*$/.test(value)) {
                    error = "Invalid characters in street address.";
                }
                break;

            case "city":
                if (!value.trim()) {
                    error = "City is required.";
                } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
                    error = "City name can only contain letters and spaces.";
                }
                break;

            case "state":
                if (!value.trim()) {
                    error = "State is required.";
                } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
                    error = "State name can only contain letters and spaces.";
                }
                break;

            case "zip":
                if (!value.trim()) {
                    error = "ZIP/Postal Code is required.";
                } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
                    error = "Enter a valid ZIP code (e.g., 94103 or 94103-1234).";
                }
                break;

            case "country":
                if (!value.trim()) {
                    error = "Country is required.";
                } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
                    error = "Country name can only contain letters and spaces.";
                }
                break;

            default:
                break;
        }

        return error;
    };

    // Handle input change with validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setTouched((prev) => ({
            ...prev,
            [name]: true
        }));

        setIsFormModified(true);
    };

    // Handle blur event for validation
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
    };

    // Validate all form fields
    const validateForm = () => {
        const fields = ['street', 'city', 'state', 'zip', 'country'];
        let isValid = true;
        let newErrors = {};
        let newTouched = {};

        fields.forEach(field => {
            newTouched[field] = true;
            const error = validateField(field, formData[field]);
            if (error) {
                isValid = false;
                newErrors[field] = error;
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Skip API call if form hasn't been modified
        if (!isFormModified && initialFormData && JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            return;
        }

        // Save data and proceed to next step
        await sendAddressDetails(formData);
    };


    // Load existing business address data on component mount
    useEffect(() => {
        if (vendor && vendor.length > 0) {
            console.log(vendor)
            const data = vendor[0]?.businessAddress;
            if (data) {
                const vendorData = {
                    street: data.street || '',
                    city: data.city || '',
                    state: data.state || '',
                    zip: data.zip || '',
                    country: data.country || ''
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
                {/* Street Address */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Street Address*</label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="123 Business St."
                        className={`w-full p-3 border ${touched.street && errors.street ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition`}
                    />
                    {touched.street && errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}
                </div>

                {/* City */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">City*</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="San Francisco"
                        className={`w-full p-3 border ${touched.city && errors.city ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition`}
                    />
                    {touched.city && errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                </div>

                {/* State/Province */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">State/Province*</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="California"
                        className={`w-full p-3 border ${touched.state && errors.state ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition`}
                    />
                    {touched.state && errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
                </div>

                {/* ZIP/Postal Code */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">ZIP/Postal Code*</label>
                    <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="94103"
                        className={`w-full p-3 border ${touched.zip && errors.zip ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition`}
                    />
                    {touched.zip && errors.zip && <p className="text-red-500 text-xs">{errors.zip}</p>}
                </div>

                {/* Country */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Country*</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="United States"
                        className={`w-full p-3 border ${touched.country && errors.country ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition`}
                    />
                    {touched.country && errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
                </div>

                <div className="flex justify-between pt-8 border-t border-gray-200">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition transform hover:-translate-y-1 duration-200 shadow-md"
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </div>
                        </button>
                    )}

                    {currentStep < totalSteps ? (
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 text-white rounded-lg font-medium transition transform duration-200 shadow-md 
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-1'}`}
                        >
                            <div className="flex items-center">
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8v8z" className="opacity-75"></path>
                                    </svg>
                                ) : (
                                    <>
                                        Continue
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 text-white rounded-lg font-medium transition transform hover:-translate-y-1 duration-200 shadow-md
                            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'}`}
                        >
                            <div className="flex items-center">
                                {loading ? (
                                    <svg className="w-5 h-5 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8v8z" className="opacity-75"></path>
                                    </svg>
                                ) : (
                                    <>
                                        Complete Registration
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </>
                                )}
                            </div>
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default BusinessAddressWithErrorBoundary;