import { useState, useEffect } from 'react';
import { useVendorStore } from '../../../Store/vendorStore';
import ErrorBoundary from '../ErrorBoundary';

import { toast } from 'sonner';

const OwnerInformationWithErrorBoundary = (props) => (
    <ErrorBoundary>
        <OwnerInformation {...props} />
    </ErrorBoundary>
);

const OwnerInformation = ({ nextStep, prevStep, currentStep, totalSteps }) => {
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        nationality: '',
        identificationType: '',
        identificationNumber: '',
        ownerPhoto: null,
        ownerDocumentPhoto: null,
        ownerPhotoBase64: '',
        ownerDocumentPhotoBase64: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormModified, setIsFormModified] = useState(false);
    const [initialFormData, setInitialFormData] = useState(null);

    const { sendOwnerDetails, vendor, loading, goToNextStep, unsetGotoNextStep } = useVendorStore()
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file) {
                resolve(null);
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    useEffect(() => {
        if (goToNextStep)
            unsetGotoNextStep()
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));
        setIsFormModified(true);
    };

    // Handles file selection
    const handleFileChange = async (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            const file = files[0];

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: 'File size must be less than 5MB'
                }));
                return;
            }

            // Check file type
            if (!file.type.match('image.*')) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: 'Only image files are allowed'
                }));
                return;
            }

            try {
                const base64 = await convertToBase64(file);
                setFormData((prev) => ({
                    ...prev,
                    [name]: file,
                    [`${name}Base64`]: base64
                }));
                setTouched((prev) => ({ ...prev, [name]: true }));
                setErrors((prev) => ({ ...prev, [name]: '' }));
            } catch (error) {
                console.error("File conversion error:", error);
                setErrors((prev) => ({
                    ...prev,
                    [name]: 'Error processing file. Please try again.'
                }));
            }
        }
    };

    // Field blur handler for validation
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        validateField(name, formData[name]);
    };

    // Validate a single field
    const validateField = (name, value) => {
        let errorMessage = '';

        switch (name) {
            case 'name':
                if (!value) errorMessage = 'Owner name is required.';
                else if (value.length < 3) errorMessage = 'Name must be at least 3 characters.';
                else if (!/^[a-zA-Z\s]+$/.test(value)) errorMessage = 'Name can only contain letters and spaces.';
                break;

            case 'dateOfBirth':
                if (!value) errorMessage = 'Date of birth is required.';
                else {
                    const dob = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - dob.getFullYear();
                    if (dob > today) errorMessage = 'Date of birth cannot be in the future.';
                    else if (age < 18) errorMessage = 'Owner must be at least 18 years old.';
                    else if (age > 120) errorMessage = 'Please enter a valid date of birth.';
                }
                break;

            case 'nationality':
                if (!value) errorMessage = 'Nationality is required.';
                else if (value.length < 2) errorMessage = 'Please enter a valid nationality.';
                break;

            case 'identificationType':
                if (!value) errorMessage = 'Please select an identification type.';
                break;

            case 'identificationNumber':
                if (!value) errorMessage = 'Identification number is required.';
                else if (value.length < 4) errorMessage = 'ID number must be at least 4 characters.';
                break;

            case 'ownerPhoto':
            case 'ownerDocumentPhoto':
                if (!value) errorMessage = `${name === 'ownerPhoto' ? 'Owner photo' : 'Identity document'} is required.`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: errorMessage }));
        return !errorMessage;
    };

    // Validate all form fields
    const validateForm = () => {
        const fields = [
            'name',
            'dateOfBirth',
            'nationality',
            'identificationType',
            'identificationNumber',
            'ownerPhoto',
            'ownerDocumentPhoto'
        ];

        let isValid = true;
        let newErrors = {};
        let newTouched = {};

        fields.forEach(field => {
            newTouched[field] = true;
            const fieldIsValid = validateField(field, formData[field]);
            if (!fieldIsValid) {
                isValid = false;
                newErrors[field] = errors[field] || `${field.replace('owner', '')} is required.`;
            }
        });

        setTouched(newTouched);
        setErrors(newErrors);
        return isValid;
    };
    useEffect(() => {

        if (vendor && vendor.length > 0) {
            try {
                const data = vendor[0]?.ownerDetails
                // console.log(data.dateOfBirth.split("T")[0]);
                const vendorData = {
                    name: data.name || "",
                    dateOfBirth: data.dateOfBirth.split("T")[0] || "",
                    identificationType: data.identificationType || "",
                    identificationNumber: data.identificationNumber || "",
                    nationality: data.nationality || "",
                    ownerPhoto: data.ownerPhoto || "",
                    ownerDocumentPhoto: data.ownerDocumentPhoto || "",
                };
                setFormData(vendorData);
                setInitialFormData(vendorData);
                setIsFormModified(false);
            } catch (error) {
                console.log()
            }
        }
    }, [vendor]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!isFormModified && initialFormData && JSON.stringify(formData) === JSON.stringify(initialFormData)) {
            nextStep();
            return;
        }
        console.log(formData)
        await sendOwnerDetails({
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            nationality: formData.nationality,
            identificationType: formData.identificationType,
            identificationNumber: formData.identificationNumber,
            ownerPhoto: formData.ownerPhotoBase64,
            ownerDocumentPhoto: formData.ownerDocumentPhotoBase64
        });


    };

    useEffect(() => {
        if (goToNextStep) {
            nextStep();
        }
    }, [goToNextStep, nextStep]);

    // File upload UI component
    const renderFileInput = (label, name) => (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">{label}*</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-500 transition">
                <span className="text-gray-500">{formData[name] ? formData[name].name : 'Click to upload (max 5MB)'}</span>
                <input
                    type="file"
                    name={name}
                    onChange={handleFileChange}
                    onBlur={handleBlur}
                    accept="image/*"
                    className="hidden"
                />
            </label>
            {touched[name] && errors[name] && (
                <p className="text-red-500 text-sm">{errors[name]}</p>
            )}
            {formData[`${name}Base64`] && (
                <div className="mt-2">
                    <img
                        src={formData[`${name}Base64`]}
                        alt="Preview"
                        className="h-24 object-cover rounded-lg"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                {/* Owner Name */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Owner Name*</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Full name of owner"
                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition
                            ${touched.name && errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.name && errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Date of Birth*</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition
                            ${touched.dateOfBirth && errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.dateOfBirth && errors.dateOfBirth && (
                        <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                    )}
                </div>

                {/* Nationality */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Nationality*</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., American"
                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition
                            ${touched.nationality && errors.nationality ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.nationality && errors.nationality && (
                        <p className="text-red-500 text-sm">{errors.nationality}</p>
                    )}
                </div>

                {/* Identification Type */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Identification Type*</label>
                    <select
                        name="identificationType"
                        value={formData.identificationType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition
                            ${touched.identificationType && errors.identificationType ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Select ID Type</option>
                        <option value="Passport">Passport</option>
                        <option value="Driver's License">Driver's License</option>
                        <option value="National ID">National ID</option>
                    </select>
                    {touched.identificationType && errors.identificationType && (
                        <p className="text-red-500 text-sm">{errors.identificationType}</p>
                    )}
                </div>

                {/* Identification Number */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Identification Number*</label>
                    <input
                        type="text"
                        name="identificationNumber"
                        value={formData.identificationNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter ID number"
                        className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition
                            ${touched.identificationNumber && errors.identificationNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.identificationNumber && errors.identificationNumber && (
                        <p className="text-red-500 text-sm">{errors.identificationNumber}</p>
                    )}
                </div>

                {/* Owner Photo */}
                {renderFileInput('Owner Photo', 'ownerPhoto')}

                {/* Identity Document Photo */}
                {renderFileInput('Identity Document Photo', 'ownerDocumentPhoto')}

                <p className="text-sm text-gray-500 italic">
                    Note: The owner photo and the identity document photo must be of the same person.
                </p>

                {/* General submission error */}
                {errors.submission && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-500">{errors.submission}</p>
                    </div>
                )}

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

export default OwnerInformationWithErrorBoundary;