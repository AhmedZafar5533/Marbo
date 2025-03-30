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
    const { goToNextStep, loading, sendBusinessDetails, vendor } = useVendorStore();

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

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};
        Object.keys(formData).forEach((key) => {
            validateField(key, formData[key]);
            if (!formData[key]) validationErrors[key] = "This field is required.";
        });

        if (Object.values(validationErrors).some((error) => error !== "")) {
            setErrors(validationErrors);
            return;
        }

        if (!isFormModified && initialFormData && JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            nextStep(); // Moves to the next step only once
            return;
        }

        await sendBusinessDetails(formData); // Ensure data is saved first
    };

    useEffect(() => {
        if (goToNextStep) {
            nextStep();
        }
    }, [goToNextStep, nextStep]);


    useEffect(() => {
        if (vendor && vendor.length > 0) {
            try {
                const data = vendor[0]?.businessDetails
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
            } catch (error) {
                console.log("No data found")
            }
        }
    }, [vendor]);

    // useEffect(() => {
    //     if (goToNextStep) {
    //         nextStep();
    //     }
    // }, [goToNextStep, nextStep]);

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                {/* Business Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Business Name*</label>
                    <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        placeholder="Enter your business name"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
                </div>

                {/* Legal Business Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Legal Business Name*</label>
                    <input
                        type="text"
                        name="legalBusinessName"
                        value={formData.legalBusinessName}
                        onChange={handleChange}
                        required
                        placeholder="Enter legal business name"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.legalBusinessName && <p className="text-red-500 text-sm">{errors.legalBusinessName}</p>}
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Business Type*</label>
                    <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
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

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Business Industry*</label>
                    <input
                        type="text"
                        name="businessIndustry"
                        value={formData.businessIndustry}
                        onChange={handleChange}
                        required
                        placeholder="E.g. Technology, Healthcare"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.businessIndustry && <p className="text-red-500 text-sm">{errors.businessIndustry}</p>}
                </div>

                {/* Registration Number */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Registration Number*</label>
                    <input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        required
                        placeholder="Business registration number"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.registrationNumber && <p className="text-red-500 text-sm">{errors.registrationNumber}</p>}
                </div>

                {/* Continue Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                    {currentStep < totalSteps && (
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
                    )}
                </div>
            </form>
        </div>
    );
};

// Export the wrapped version with error boundary
export default BusinessInformationWithErrorBoundary;