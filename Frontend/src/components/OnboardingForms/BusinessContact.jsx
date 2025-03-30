import { useState, useEffect } from "react";
import { useVendorStore } from "../../../Store/vendorStore";
import ErrorBoundary from "../ErrorBoundary"; // Import the ErrorBoundary component

// Create a wrapped version of our component that's protected by the ErrorBoundary
const BusinessContactWithErrorBoundary = (props) => (
    <ErrorBoundary>
        <BusinessContact {...props} />
    </ErrorBoundary>
);

const BusinessContact = ({ nextStep, prevStep, currentStep, totalSteps }) => {
    const [formData, setFormData] = useState({
        businessEmail: "",
        businessPhone: "",
        website: "",
    });
    const [isModified, setModified] = useState(false);
    const [errors, setErrors] = useState({});
    const [initialFormData, setInitialFormData] = useState(null);

    const { loading, vendor, sendBusinessContact, goToNextStep, unsetGotoNextStep } = useVendorStore();

    const validationRules = {
        businessEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        businessPhone: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
        website: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/, // Applied only if user enters a value
    };

    // Handles input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setModified(true);
        validateField(name, value);
    };
    // useEffect(() => {
    //     unsetGotoNextStep()
    // })


    useEffect(() => {
        if (goToNextStep)
            unsetGotoNextStep()
    })


    // Validate a single field
    const validateField = (name, value) => {
        let errorMessage = "";

        if (!value && name !== "website") {
            errorMessage = "This field is required.";
        } else if (value && validationRules[name] && !validationRules[name].test(value)) {
            switch (name) {
                case "businessEmail":
                    errorMessage = "Enter a valid email address.";
                    break;
                case "businessPhone":
                    errorMessage = "Enter a valid phone number.";
                    break;
                case "website":
                    errorMessage = "Enter a valid website URL.";
                    break;
                default:
                    break;
            }
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};
        Object.keys(formData).forEach((key) => {
            if (key !== "website") {
                validateField(key, formData[key]);
                if (!formData[key]) validationErrors[key] = "This field is required.";
            }
        });

        if (Object.values(validationErrors).some((error) => error !== "")) {
            setErrors(validationErrors);
            return;
        }

        if (!isModified && initialFormData && JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            nextStep();
            return;
        }
        await sendBusinessContact(formData);

    };

    useEffect(() => {
        if (goToNextStep) {
            nextStep();
        }
    }, [goToNextStep, nextStep]);

    useEffect(() => {
        console.log(vendor)
        try {
            console.log(vendor[0].businessContact);
            if (vendor && vendor.length > 0 && vendor[0]?.businessContact) {

                const vendorData = {
                    businessEmail: vendor[0].businessContact?.businessEmail || "",
                    businessPhone: vendor[0].businessContact?.businessPhone || "",
                    website: vendor[0].businessContact?.website || "",
                };
                setFormData(vendorData);
                setInitialFormData(vendorData);
                setModified(false);
            }
        } catch (error) {
            console.error("Error loading vendor contact data:");

        }
    }, [vendor]);

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                {/* Business Email */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Business Email*
                    </label>
                    <input
                        type="email"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        required
                        placeholder="info@yourbusiness.com"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.businessEmail && <p className="text-red-500 text-sm">{errors.businessEmail}</p>}
                </div>

                {/* Business Phone */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Business Phone
                    </label>
                    <input
                        type="tel"
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.businessPhone && <p className="text-red-500 text-sm">{errors.businessPhone}</p>}
                </div>

                {/* Website (Optional) */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Website (Optional)
                    </label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://www.yourbusiness.com"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200">
                    {currentStep > 1 ? (
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
                    ) : (
                        <div></div>
                    )}

                    {currentStep < totalSteps ? (
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 text-white rounded-lg font-medium transition transform duration-200 shadow-md 
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:-translate-y-1"}
    `}
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
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition transform hover:-translate-y-1 duration-200 shadow-md"
                        >
                            Complete Registration
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

// Export the wrapped version with error boundary
export default BusinessContactWithErrorBoundary;