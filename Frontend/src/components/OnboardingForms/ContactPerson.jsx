import { useState, useEffect } from "react";
import { useVendorStore } from "../../../Store/vendorStore";
import ErrorBoundary from "../ErrorBoundary";
import { toast } from "sonner";
/* eslint-disable react/prop-types */

const ContactPersonWithErrorBoundary = (props) => (
    <ErrorBoundary>
        <ContactPerson {...props} />
    </ErrorBoundary>
);

const ContactPerson = ({ nextStep, prevStep, currentStep, totalSteps }) => {
    const { loading, sendContactPerson, vendor, goToNextStep, unsetGotoNextStep } = useVendorStore();

    // State for form data and validation errors
    const [formData, setFormData] = useState({
        name: "",
        contactPersonPhone: "",
        contactPersonEmail: "",
        contactPersonTitle: "",
    });

    const [errors, setErrors] = useState({});
    const [isFormModified, setIsFormModified] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);

    // Validation patterns
    const validationRules = {
        name: /^[a-zA-Z\s]+$/, // Only letters and spaces
        contactPersonPhone: /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, // Phone format
        contactPersonEmail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email format
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setIsFormModified(true);

        validateField(name, value);
    };

    // Validate a single field
    const validateField = (name, value) => {
        let errorMessage = "";

        if (!value && name !== "contactPersonTitle") { // Title is optional
            errorMessage = "This field is required.";
        } else if (value && validationRules[name] && !validationRules[name].test(value)) {
            switch (name) {
                case "name":
                    errorMessage = "Enter a valid name (letters only).";
                    break;
                case "contactPersonPhone":
                    errorMessage = "Enter a valid phone number.";
                    break;
                case "contactPersonEmail":
                    errorMessage = "Enter a valid email address.";
                    break;
                default:
                    break;
            }
        }

        setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};
        let hasErrors = false;

        // Validate all required fields
        Object.keys(formData).forEach((key) => {
            if (key !== "contactPersonTitle") { // Title is optional
                validateField(key, formData[key]);
                if (!formData[key]) {
                    validationErrors[key] = "This field is required.";
                    hasErrors = true;
                } else if (validationRules[key] && !validationRules[key].test(formData[key])) {
                    hasErrors = true;
                    switch (key) {
                        case "name":
                            validationErrors[key] = "Enter a valid name (letters only).";
                            break;
                        case "contactPersonPhone":
                            validationErrors[key] = "Enter a valid phone number.";
                            break;
                        case "contactPersonEmail":
                            validationErrors[key] = "Enter a valid email address.";
                            break;
                        default:
                            break;
                    }
                }
            }
        });

        if (hasErrors) {
            setErrors(validationErrors);
            return;
        }

        if (!isFormModified && initialFormData && JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            nextStep(); // Moves to the next step without saving
            return;
        }

        await sendContactPerson({
            name: formData.name,
            phone: formData.contactPersonPhone,
            email: formData.contactPersonEmail,
            title: formData.contactPersonTitle
        });
    };

    useEffect(() => {
        if (goToNextStep) {
            nextStep();
        }
    }, [goToNextStep, nextStep]);


    useEffect(() => {
        if (goToNextStep)
            unsetGotoNextStep()
    })

    useEffect(() => {
        if (vendor && vendor.length > 0) {

            const data = vendor[0]?.contactPerson;
            if (data) {
                const vendorData = {
                    name: data.name || "",
                    contactPersonPhone: data.phone || "",
                    contactPersonEmail: data.email || "",
                    contactPersonTitle: data.title || "",
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
                {/* Contact Person Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Contact Person Name*
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full name"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                {/* Contact Person Phone */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Contact Person Phone*
                    </label>
                    <input
                        type="tel"
                        name="contactPersonPhone"
                        value={formData.contactPersonPhone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 123-4567"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.contactPersonPhone && <p className="text-red-500 text-sm">{errors.contactPersonPhone}</p>}
                </div>

                {/* Contact Person Email */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Contact Person Email*
                    </label>
                    <input
                        type="email"
                        name="contactPersonEmail"
                        value={formData.contactPersonEmail}
                        onChange={handleChange}
                        required
                        placeholder="contact@yourbusiness.com"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
                    {errors.contactPersonEmail && <p className="text-red-500 text-sm">{errors.contactPersonEmail}</p>}
                </div>

                {/* Contact Person Title (Optional) */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                        Contact Person Title (Optional)
                    </label>
                    <input
                        type="text"
                        name="contactPersonTitle"
                        value={formData.contactPersonTitle}
                        onChange={handleChange}
                        placeholder="e.g., Manager"
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                    />
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

export default ContactPersonWithErrorBoundary;