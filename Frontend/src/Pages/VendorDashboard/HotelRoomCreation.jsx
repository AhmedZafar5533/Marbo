import { useState } from 'react';
import { useHotelRoomStore } from '../../../Store/hotelRoomStore';

const HotelRoomUploadForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        roomType: '',
        price: '',
        availability: 'available',
        maxGuests: '',
        bedType: '',
        size: '',
        description: '',
        features: [],
        images: []
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [currentFeature, setCurrentFeature] = useState('');


    const { addHotelRoom } = useHotelRoomStore()

    const roomTypes = [
        'Standard Room',
        'Deluxe Room',
        'Suite',
        'Executive Room',
        'Presidential Suite',
        'Family Room',
        'Single Room',
        'Double Room',
        'Twin Room',
        'Studio',
        'Penthouse'
    ];

    const bedTypes = [
        'Single Bed',
        'Double Bed',
        'Queen Bed',
        'King Bed',
        'Twin Beds',
        'Sofa Bed',
        'Bunk Bed'
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Room title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Room title must be at least 3 characters';
        }

        if (!formData.roomType) {
            newErrors.roomType = 'Room type is required';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a valid positive number';
        }

        if (!formData.maxGuests) {
            newErrors.maxGuests = 'Maximum guests is required';
        } else if (isNaN(formData.maxGuests) || parseInt(formData.maxGuests) <= 0) {
            newErrors.maxGuests = 'Maximum guests must be a valid positive number';
        }

        if (!formData.bedType) {
            newErrors.bedType = 'Bed type is required';
        }

        if (!formData.size) {
            newErrors.size = 'Room size is required';
        } else if (isNaN(formData.size) || parseFloat(formData.size) <= 0) {
            newErrors.size = 'Room size must be a valid positive number';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 20) {
            newErrors.description = 'Description must be at least 20 characters';
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

        if (formData.images.length + fileArray.length > 4) {
            setErrors(prev => ({
                ...prev,
                images: 'Maximum 4 images allowed'
            }));
            return;
        }

        const validFiles = fileArray.filter(file => {
            const isValid = file.type.startsWith('image/');
            const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

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
                    images: 'Image size should be less than 2MB'
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
                price: parseFloat(formData.price),
                maxGuests: parseInt(formData.maxGuests),
                size: parseFloat(formData.size),
                images: formData.images.map(img => ({
                    base64Image: img.base64,
                }))
            };

            console.log('Submitting room data:', submissionData);
            const success = await addHotelRoom(submissionData);
            if (success)
                // Reset form
                setFormData({
                    title: '',
                    roomType: '',
                    price: '',
                    availability: 'available',
                    maxGuests: '',
                    bedType: '',
                    size: '',
                    description: '',
                    features: [],
                    images: []
                });

        } catch (error) {
            console.error('Error uploading room:', error);
            alert('Error uploading room. Please try again.');
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
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V5a2 2 0 012-2h14a2 2 0 012 2v2" />
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Add New Room
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Create a new room listing for your hotel with detailed information and amenities
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Room Details Section */}
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-amber-600 font-semibold text-sm">1</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Room Details</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Room Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Room Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., Ocean View Deluxe Suite"
                                />
                                {errors.title && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.title}</p>
                                )}
                            </div>

                            {/* Room Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Room Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="roomType"
                                    value={formData.roomType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 ${errors.roomType ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <option value="">Choose room type</option>
                                    {roomTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.roomType && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.roomType}</p>
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
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className={`w-full pl-8 pr-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.price}</p>
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
                                    className="w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 border-gray-200 hover:border-gray-300"
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
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 ${errors.maxGuests ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 2"
                                />
                                {errors.maxGuests && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.maxGuests}</p>
                                )}
                            </div>

                            {/* Bed Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Bed Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="bedType"
                                    value={formData.bedType}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 ${errors.bedType ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <option value="">Choose bed type</option>
                                    {bedTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.bedType && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.bedType}</p>
                                )}
                            </div>

                            {/* Room Size */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Room Size (sq ft) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    step="0.1"
                                    min="0"
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 ${errors.size ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., 350"
                                />
                                {errors.size && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.size}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Room Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={6}
                                className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="Describe the room in detail. Include views, atmosphere, special features, and what makes this room unique..."
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>
                            )}
                        </div>

                        {/* Features Section */}
                        <div className="mb-10">
                            <div className="flex items-center mb-4">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <label className="text-sm font-semibold text-gray-700">
                                    Room Amenities & Features
                                </label>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                                <div className="flex gap-3 mb-6">
                                    <input
                                        type="text"
                                        value={currentFeature}
                                        onChange={(e) => setCurrentFeature(e.target.value)}
                                        onKeyPress={handleFeatureKeyPress}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all duration-200"
                                        placeholder="e.g., Free WiFi, Ocean View, Mini Bar, Balcony..."
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        disabled={!currentFeature.trim()}
                                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                                    >
                                        Add
                                    </button>
                                </div>

                                {/* Features List */}
                                {formData.features.length > 0 ? (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 font-semibold">Added Features:</p>
                                        <div className="grid gap-3">
                                            {formData.features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white px-4 py-3 rounded-xl border border-gray-200 flex items-center justify-between group hover:border-amber-200 hover:bg-amber-50 transition-all duration-200"
                                                >
                                                    <div className="flex items-center">
                                                        <svg className="h-4 w-4 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-gray-700 font-medium">{feature}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(index)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-gray-500 font-medium">No features added yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Add amenities and features to highlight what makes this room special</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="mb-10">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-orange-600 font-semibold text-sm">2</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Room Images</h3>
                            </div>

                            {/* Drag and Drop Zone */}
                            <div
                                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${dragActive
                                    ? 'border-amber-500 bg-amber-50'
                                    : errors.images
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300 bg-gray-50'
                                    } ${formData.images.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'hover:border-amber-400 hover:bg-amber-50'}`}
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
                                    disabled={formData.images.length >= 4}
                                />

                                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    {dragActive ? 'Drop your images here' : 'Upload Room Photos'}
                                </h3>

                                <p className="text-gray-600 mb-4">
                                    Drag and drop your images here, or click to browse your files
                                </p>

                                <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200 text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    JPG, PNG, GIF up to 2MB • {formData.images.length}/4 uploaded
                                </div>
                            </div>

                            {errors.images && (
                                <p className="mt-3 text-sm text-red-600 font-medium">{errors.images}</p>
                            )}

                            {/* Image Preview */}
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
                                                onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>

                                            <div className="mt-3">
                                                <p className="text-xs text-gray-600 font-medium truncate">{image.name}</p>
                                                <p className="text-xs text-gray-400">{formatFileSize(image.size)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-gray-50 px-8 sm:px-10 py-8 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                type="button"
                                className="px-8 py-4 text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-white transition-all duration-200"
                                onClick={() => {
                                    setFormData({
                                        title: '',
                                        roomType: '',
                                        price: '',
                                        availability: 'available',
                                        maxGuests: '',
                                        bedType: '',
                                        size: '',
                                        description: '',
                                        features: [],
                                        images: []
                                    });
                                    setErrors({});
                                }}
                            >
                                Reset Form
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-2xl hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[160px]"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-whi    te" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload Room'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelRoomUploadForm;