import { useState } from 'react';
import { useHolidayLetsStore } from '../../../Store/holidayLetsStore';

const HolidayLetForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        propertyType: '',
        pricePerNight: '',
        availability: 'available',
        maxGuests: '',
        bedrooms: '',
        bathrooms: '',
        propertySize: '',
        sizeUnit: 'sqft',
        description: '',
        features: [],
        images: [],
        // Location fields
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateRegion: '',
        postalCode: '',
        country: '',
        mapLink: '',
        // Pricing details
        minimumNights: '',
        cleaningFee: '',
        securityDeposit: '',
        // Check-in/out times
        checkinTime: '',
        checkoutTime: '',
        // Policies
        smokingPolicy: 'no-smoking',
        petPolicy: 'no-pets',
        partyPolicy: 'no-parties',
        quietHours: '',
        // Access & interaction
        accessDescription: '',
        hostInteraction: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [currentFeature, setCurrentFeature] = useState('');

    const { addHolidayProperty } = useHolidayLetsStore()

    const propertyTypes = [
        'Apartment',
        'Villa',
        'House',
        'Cottage',
        'Cabin',
        'Chalet',
        'Townhouse',
        'Condo',
        'Bungalow',
        'Castle',
        'Treehouse',
        'Boat',
        'Camper/RV'
    ];

    const smokingPolicies = [
        { value: 'no-smoking', label: 'No smoking anywhere' },
        { value: 'outdoor-only', label: 'Outdoor smoking only' },
        { value: 'smoking-allowed', label: 'Smoking allowed' }
    ];

    const petPolicies = [
        { value: 'no-pets', label: 'No pets allowed' },
        { value: 'pets-allowed', label: 'Pets allowed' },
        { value: 'small-pets', label: 'Small pets only' },
        { value: 'with-approval', label: 'Pets with prior approval' }
    ];

    const partyPolicies = [
        { value: 'no-parties', label: 'No parties or events' },
        { value: 'small-gatherings', label: 'Small gatherings allowed' },
        { value: 'events-allowed', label: 'Events allowed with approval' }
    ];

    const validateForm = () => {
        const newErrors = {};

        // Basic property details
        if (!formData.title.trim()) {
            newErrors.title = 'Property title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Property title must be at least 3 characters';
        }

        if (!formData.propertyType) {
            newErrors.propertyType = 'Property type is required';
        }

        if (!formData.pricePerNight) {
            newErrors.pricePerNight = 'Price per night is required';
        } else if (isNaN(formData.pricePerNight) || parseFloat(formData.pricePerNight) <= 0) {
            newErrors.pricePerNight = 'Price must be a valid positive number';
        }

        if (!formData.maxGuests) {
            newErrors.maxGuests = 'Maximum guests is required';
        } else if (isNaN(formData.maxGuests) || parseInt(formData.maxGuests) <= 0) {
            newErrors.maxGuests = 'Maximum guests must be a valid positive number';
        }

        if (!formData.bedrooms) {
            newErrors.bedrooms = 'Number of bedrooms is required';
        } else if (isNaN(formData.bedrooms) || parseInt(formData.bedrooms) <= 0) {
            newErrors.bedrooms = 'Number of bedrooms must be a valid positive number';
        }

        if (!formData.bathrooms) {
            newErrors.bathrooms = 'Number of bathrooms is required';
        } else if (isNaN(formData.bathrooms) || parseFloat(formData.bathrooms) <= 0) {
            newErrors.bathrooms = 'Number of bathrooms must be a valid positive number';
        }

        if (!formData.propertySize) {
            newErrors.propertySize = 'Property size is required';
        } else if (isNaN(formData.propertySize) || parseFloat(formData.propertySize) <= 0) {
            newErrors.propertySize = 'Property size must be a valid positive number';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        // Location validation
        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.stateRegion.trim()) {
            newErrors.stateRegion = 'State/Region is required';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        // Pricing validation
        if (!formData.minimumNights) {
            newErrors.minimumNights = 'Minimum nights is required';
        } else if (isNaN(formData.minimumNights) || parseInt(formData.minimumNights) <= 0) {
            newErrors.minimumNights = 'Minimum nights must be a valid positive number';
        }

        if (formData.images.length === 0) {
            newErrors.images = 'At least one image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageUpload = async (files) => {
        const fileArray = Array.from(files);

        if (formData.images.length + fileArray.length > 8) {
            setErrors(prev => ({
                ...prev,
                images: 'Maximum 8 images allowed'
            }));
            return;
        }

        const validFiles = fileArray.filter(file => {
            const isValid = file.type.startsWith('image/');
            const isValidSize = file.size <= 4 * 1024 * 1024; // 5MB limit

            if (!isValid) {
                setErrors(prev => ({
                    ...prev,
                    images: 'Only image files are allowed'
                }));
                return false;
            }

            if (!isValidSize) {
                setErrors(prev => ({
                    ...prev,
                    images: 'Image size should be less than 4MB'
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
                        type: file.type
                    };
                })
            );

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...base64Images]
            }));

            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.images;
                return newErrors;
            });
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                images: 'Error processing images'
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
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const addFeature = () => {
        if (currentFeature.trim() && !formData.features.includes(currentFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, currentFeature.trim()]
            }));
            setCurrentFeature('');
        }
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleFeatureKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFeature();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
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
                pricePerNight: parseFloat(formData.pricePerNight),
                maxGuests: parseInt(formData.maxGuests),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseFloat(formData.bathrooms),
                propertySize: parseFloat(formData.propertySize),
                minimumNights: parseInt(formData.minimumNights),
                cleaningFee: formData.cleaningFee ? parseFloat(formData.cleaningFee) : 0,
                securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : 0,
                images: formData.images.map(img => ({
                    base64Image: img.base64,
                }))
            };

            console.log('Submitting property data:', submissionData);
            const success = await addHolidayProperty(submissionData);
            if (success)
                setFormData({
                    title: '',
                    propertyType: '',
                    pricePerNight: '',
                    availability: 'available',
                    maxGuests: '',
                    bedrooms: '',
                    bathrooms: '',
                    propertySize: '',
                    sizeUnit: 'sqft',
                    description: '',
                    features: [],
                    images: [],
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    stateRegion: '',
                    postalCode: '',
                    country: '',
                    mapLink: '',
                    minimumNights: '',
                    cleaningFee: '',
                    securityDeposit: '',
                    checkinTime: '',
                    checkoutTime: '',
                    smokingPolicy: 'no-smoking',
                    petPolicy: 'no-pets',
                    partyPolicy: 'no-parties',
                    quietHours: '',
                    accessDescription: '',
                    hostInteraction: ''
                });

        } catch (error) {
            console.error('Error creating property listing:', error);
            alert('Error creating property listing. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Create Your Holiday Let
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            List your property for short-term rentals with detailed information and stunning photos
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Property Details Section */}
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold text-sm">1</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Property Details</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Property Title */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Property Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., Cozy Lakeside Cabin, Luxury City Apartment, Charming Beach House"
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>
                                )}
                            </div>

                            {/* Property Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Property Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.propertyType ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <option value="">Choose property type</option>
                                    {propertyTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.propertyType && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.propertyType}</p>
                                )}
                            </div>

                            {/* Price per Night */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Price per Night (USD) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="pricePerNight"
                                        value={formData.pricePerNight}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className={`w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.pricePerNight ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.pricePerNight && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.pricePerNight}</p>
                                )}
                            </div>

                            {/* Availability Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Availability Status
                                </label>
                                <select
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                >
                                    <option value="available">Available</option>
                                    <option value="booked">Booked</option>
                                    <option value="maintenance">Under Maintenance</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>

                            {/* Maximum Guests */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Maximum Guests <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="maxGuests"
                                    value={formData.maxGuests}
                                    onChange={handleInputChange}
                                    min="1"
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.maxGuests ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 4"
                                />
                                {errors.maxGuests && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.maxGuests}</p>
                                )}
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Number of Bedrooms <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    min="1"
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.bedrooms ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 3"
                                />
                                {errors.bedrooms && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.bedrooms}</p>
                                )}
                            </div>

                            {/* Bathrooms */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Number of Bathrooms <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    step="0.5"
                                    min="0.5"
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.bathrooms ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 2.5"
                                />
                                {errors.bathrooms && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.bathrooms}</p>
                                )}
                            </div>

                            {/* Property Size */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Property Size <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        name="propertySize"
                                        value={formData.propertySize}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        className={`flex-1 px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.propertySize ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="e.g., 1200"
                                    />
                                    <select
                                        name="sizeUnit"
                                        value={formData.sizeUnit}
                                        onChange={handleInputChange}
                                        className="px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    >
                                        <option value="sqft">sq ft</option>
                                        <option value="sqm">sq m</option>
                                    </select>
                                </div>
                                {errors.propertySize && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.propertySize}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Property Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="Describe your property in detail. Include unique features, views, atmosphere, nearby attractions, and what makes this place special for guests..."
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-green-600 font-semibold text-sm">2</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Address Line 1 */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.addressLine1 ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 123 Main Street"
                                />
                                {errors.addressLine1 && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.addressLine1}</p>
                                )}
                            </div>

                            {/* Address Line 2 */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Address Line 2 (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    placeholder="e.g., Apartment 2B, Unit 5"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    City / Town <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., San Francisco"
                                />
                                {errors.city && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.city}</p>
                                )}
                            </div>

                            {/* State/Region */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    State / Province / Region <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="stateRegion"
                                    value={formData.stateRegion}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.stateRegion ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., California"
                                />
                                {errors.stateRegion && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.stateRegion}</p>
                                )}
                            </div>

                            {/* Postal Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Postal / ZIP Code
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    placeholder="e.g., 94102"
                                />
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.country ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., United States"
                                />
                                {errors.country && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.country}</p>
                                )}
                            </div>

                            {/* Map Link */}
                            <div className="lg:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Map Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="mapLink"
                                    value={formData.mapLink}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    placeholder="e.g., https://maps.google.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Details Section */}
                    <div className="p-8 sm:p-10 border-t border-gray-100">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-purple-600 font-semibold text-sm">3</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Pricing Details</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Minimum Nights */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Minimum Nights <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="minimumNights"
                                    value={formData.minimumNights}
                                    onChange={handleInputChange}
                                    min="1"
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.minimumNights ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 2"
                                />
                                {errors.minimumNights && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.minimumNights}</p>
                                )}
                            </div>

                            {/* Cleaning Fee */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Cleaning Fee (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="cleaningFee"
                                        value={formData.cleaningFee}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Security Deposit */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Security Deposit (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-4 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="securityDeposit"
                                        value={formData.securityDeposit}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Check-in/out Times Section */}
                    <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-orange-600 font-semibold text-sm">4</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Check-in & Check-out</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Check-in Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Check-in Time
                                </label>
                                <input
                                    type="time"
                                    name="checkinTime"
                                    value={formData.checkinTime}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                />
                            </div>

                            {/* Check-out Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Check-out Time
                                </label>
                                <input
                                    type="time"
                                    name="checkoutTime"
                                    value={formData.checkoutTime}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="p-8 sm:p-10 border-t border-gray-100">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-indigo-600 font-semibold text-sm">5</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Features & Amenities</h2>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Add Features
                            </label>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={currentFeature}
                                    onChange={(e) => setCurrentFeature(e.target.value)}
                                    onKeyPress={handleFeatureKeyPress}
                                    className="flex-1 px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    placeholder="e.g., WiFi, Pool, Kitchen, Parking..."
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    disabled={!currentFeature.trim()}
                                    className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {formData.features.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {formData.features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Images Section */}
                    <div className="bg-gray-50 p-8 sm:p-10 border-t border-gray-100">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-pink-600 font-semibold text-sm">6</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Property Images</h2>
                        </div>

                        <div className="mb-6">
                            <div
                                className={`border-3 border-dashed rounded-3xl p-8 text-center transition-all duration-200 ${dragActive
                                    ? 'border-blue-400 bg-blue-50'
                                    : errors.images
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Property Images</h3>
                                    <p className="text-gray-600 mb-4">Drag and drop your files here, or click to browse</p>
                                    <p className="text-sm text-gray-500 mb-6">Maximum 8 images, up to 2MB each. JPG, PNG, GIF supported.</p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 cursor-pointer transition-all duration-200"
                                    >
                                        Choose Files
                                    </label>
                                </div>
                            </div>
                            {errors.images && (
                                <p className="mt-3 text-sm text-red-600 font-medium">{errors.images}</p>
                            )}
                        </div>

                        {formData.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                            <img
                                                src={image.base64}
                                                alt={`Property ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                            {formatFileSize(image.size)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Policies Section */}
                    <div className="p-8 sm:p-10 border-t border-gray-100">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-red-600 font-semibold text-sm">7</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">House Rules & Policies</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Smoking Policy */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Smoking Policy
                                </label>
                                <select
                                    name="smokingPolicy"
                                    value={formData.smokingPolicy}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                >
                                    {smokingPolicies.map((policy) => (
                                        <option key={policy.value} value={policy.value}>
                                            {policy.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Pet Policy */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Pet Policy
                                </label>
                                <select
                                    name="petPolicy"
                                    value={formData.petPolicy}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                >
                                    {petPolicies.map((policy) => (
                                        <option key={policy.value} value={policy.value}>
                                            {policy.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Party Policy */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Party & Events Policy
                                </label>
                                <select
                                    name="partyPolicy"
                                    value={formData.partyPolicy}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                >
                                    {partyPolicies.map((policy) => (
                                        <option key={policy.value} value={policy.value}>
                                            {policy.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quiet Hours */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Quiet Hours
                                </label>
                                <input
                                    type="text"
                                    name="quietHours"
                                    value={formData.quietHours}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
                                    placeholder="e.g., 10:00 PM - 8:00 AM"
                                />
                            </div>
                        </div>

                        {/* Access Description */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Property Access & Instructions
                            </label>
                            <textarea
                                name="accessDescription"
                                value={formData.accessDescription}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none border-gray-200 hover:border-gray-300"
                                placeholder="Describe how guests can access the property, parking instructions, key pickup/lockbox details, building entry codes, etc..."
                            />
                        </div>

                        {/* Host Interaction */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Host Interaction & Availability
                            </label>
                            <textarea
                                name="hostInteraction"
                                value={formData.hostInteraction}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none border-gray-200 hover:border-gray-300"
                                placeholder="Describe your availability to guests, preferred communication methods, response time, and level of interaction you provide..."
                            />
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-8 sm:p-10 border-t border-gray-100">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to List Your Property?</h3>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                                Review all your information above and submit to create your holiday let listing.
                                You can always edit these details later.
                            </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Listing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Create Holiday Let Listing
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

export default HolidayLetForm;