import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Eye, AlertCircle, Upload, X, Edit, DollarSign, Tag, Save, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useServiceStore } from '../../../Store/servicesStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../../Store/authStore';

// Move EditServiceModal outside of the main component
const EditServiceModal = ({
    editFormData,
    handleCancelEdit,
    handleEditInputChange,
    handleEditImageUpload,
    handleCancelEditImage,
    handleSaveEdit
}) => {
    if (!editFormData) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto mx-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-indigo-700">Edit Service</h2>
                    <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name
                        </label>
                        <input
                            type="text"
                            name="serviceName"
                            value={editFormData.serviceName || ''}
                            onChange={handleEditInputChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={editFormData.category || ''}
                                onChange={handleEditInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
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
                                <option value="Money Transfer Services">Money Transfer Services</option>
                                <option value="Mortgage Services">Mortgage Services</option>
                                <option value="Payments & Utilities">Payments & Utilities</option>
                                <option value="Professional Services">Professional Services</option>
                                <option value="Properties for Sale">Properties for Sale</option>
                                <option value="Property Management">Property Management</option>
                                <option value="Real Estate & Property">Real Estate & Property</option>
                                <option value="Rent Collection">Rent Collection</option>
                                <option value="Rental Properties">Rental Properties</option>
                                <option value="School Fee Payments">School Fee Payments</option>
                                <option value="Tech Supplies">Tech Supplies</option>
                                <option value="Technology & Communication">Technology & Communication</option>
                                <option value="Telecom Services">Telecom Services</option>
                                <option value="Traditional Clothing">Traditional Clothing</option>
                                <option value="Utility Payments">Utility Payments</option>
                                <option value="Water Bill Payments">Water Bill Payments</option>
                            </select>
                        </div> */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={editFormData.status || 'Available'}
                                onChange={handleEditInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    value={editFormData.price || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Image
                        </label>
                        <div className="relative rounded-lg overflow-hidden">
                            <img
                                src={editFormData.image?.url || ''}
                                alt="Service preview"
                                className="w-full h-40 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-2 right-2 flex space-x-2">
                                <label className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors cursor-pointer">
                                    <Upload className="h-4 w-4" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleEditImageUpload}
                                    />
                                </label>
                                {editFormData.image !== editFormData.originalImage && (
                                    <button
                                        onClick={handleCancelEditImage}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={editFormData.description || ''}
                            onChange={handleEditInputChange}
                            rows="3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const VendorDashboardServicesSection = () => {
    const [services, setServices] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [activeServiceId, setActiveServiceId] = useState(null);
    const [showServiceDetails, setShowServiceDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const navigate = useNavigate();

    const { user } = useAuthStore();
    const { initializeService, loading, getServicesData, servicesData, deleteService, successfullyCreated, editService } = useServiceStore();

    useEffect(() => {
        if (user.onboardingDone == 'no') {
            navigate("/goto/onboarding");
        }
        if (user.onboardingDone === 'pending')
            navigate("/vendor/wait/review");
    }, [user, navigate]);

    useEffect(() => {
        getServicesData(user._id);
    }, [getServicesData]);

    useEffect(() => {
        if (servicesData.length > 0) {
            setServices(servicesData);
        }
    }, [servicesData]);

    const toggleActiveService = (id) => {
        setActiveServiceId(activeServiceId === id ? null : id);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        deleteService(id);
    };

    const handleEnableEdit = (service) => {
        setEditMode(true);
        setEditFormData({
            ...service, image: { ...service.image.url ? service.image : { url: '' } },
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditFormData(null);
    };

    const handleSaveEdit = () => {
        const original = services.find(service => service._id === editFormData._id);
        const updatedFields = {};

        for (const key in editFormData) {
            const newValue = editFormData[key];
            const originalValue = original[key];

            // Handle nested image objects
            if (typeof newValue === "object" && newValue !== null && originalValue !== null) {
                if (JSON.stringify(newValue) !== JSON.stringify(originalValue)) {
                    updatedFields[key] = newValue;
                }
            } else {
                if (newValue !== originalValue) {
                    updatedFields[key] = newValue;
                }
            }
        }

        // Only call the API if there are changes
        if (Object.keys(updatedFields).length > 0) {
            editService(editFormData._id, updatedFields);
        }

        // Update local state regardless
        setServices(services.map(service =>
            service._id === editFormData._id ? editFormData : service
        ));
        setEditMode(false);
        setShowServiceDetails(editFormData);
        setEditFormData(null);
    };


    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64String = await convertToBase64(file);
                setEditFormData(prev => ({
                    ...prev,
                    image: { ...prev.image, url: base64String }
                }));
            } catch (error) {
                console.error('Error converting image to base64:', error);
            }
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(file);
            } else {
                reject(new Error('Not a valid image file'));
            }
        });
    };

    const handleCancelEditImage = () => {
        setEditFormData(prev => ({
            ...prev,
            image: prev.originalImage
        }));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const UploadModal = () => {
        const [uploadedImage, setUploadedImage] = useState(null);
        const [base64Image, setBase64Image] = useState(null);
        const [errorMessage, setErrorMessage] = useState(null);
        const [formData, setFormData] = useState({
            name: '',
            category: '',
            price: '',
            description: '',
            status: 'Available'
        });
        const resetForm = () => {
            setFormData({
                name: '',
                category: '',
                price: '',
                description: '',
                status: 'Available'
            });
            setUploadedImage(null);
            setBase64Image(null);
            setErrorMessage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        const handleCloseModal = () => {
            resetForm(); // Reset the form when closing the modal
            setShowUploadModal(false);
        };
        const fileInputRef = useRef(null);

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setErrorMessage(null);
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        useEffect(() => {
            if (successfullyCreated) {
                resetForm();
            }
        }, [successfullyCreated]);

        const handleImageUpload = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const base64String = await convertToBase64(file);
                    setUploadedImage(base64String);
                    setBase64Image(base64String);
                } catch (error) {
                    console.error('Error converting image to base64:', error);
                }
            }
        };

        const handleDrop = async (e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                try {
                    const base64String = await convertToBase64(file);
                    setUploadedImage(base64String);
                    setBase64Image(base64String);
                } catch (error) {
                    console.error('Error converting dropped image to base64:', error);
                }
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
        };

        const handleCancelImage = () => {
            setUploadedImage(null);
            setBase64Image(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        const validateForm = () => {
            if (!formData.name || !formData.category || !formData.price) {
                return "Please fill out all required fields";
            }
            const nameRegex = /^[a-zA-Z0-9\s]+$/;
            if (!nameRegex.test(formData.name)) {
                return "Service name can only contain letters, numbers, and spaces";
            }
            const priceRegex = /^\d+(\.\d{1,2})?$/;
            if (!priceRegex.test(formData.price)) {
                return "Price must be a valid number with up to 2 decimal places";
            }
            return null;
        };

        const handleAddService = () => {
            const error = validateForm();
            if (error) {
                setErrorMessage(error);
                return;
            }

            const newService = {
                id: Date.now(),
                serviceName: formData.name, // Note: mapping name to serviceName
                category: formData.category,
                price: parseFloat(formData.price),
                status: formData.status,
                description: formData.description,
                image: {
                    url: uploadedImage ||
                        'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                }
            };
            initializeService(newService);
        };

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto mx-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-indigo-700">Add New Service</h2>
                        <button
                            onClick={() => handleCloseModal()}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Name*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Enter service name"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category*
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
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
                                    <option value="Money Transfer Services">Money Transfer Services</option>
                                    <option value="Mortgage Services">Mortgage Services</option>
                                    <option value="Payments & Utilities">Payments & Utilities</option>
                                    <option value="Professional Services">Professional Services</option>
                                    <option value="Properties for Sale">Properties for Sale</option>
                                    <option value="Property Management">Property Management</option>
                                    <option value="Real Estate & Property">Real Estate & Property</option>
                                    <option value="Rent Collection">Rent Collection</option>
                                    <option value="Rental Properties">Rental Properties</option>
                                    <option value="School Fee Payments">School Fee Payments</option>
                                    <option value="Tech Supplies">Tech Supplies</option>
                                    <option value="Technology & Communication">Technology & Communication</option>
                                    <option value="Telecom Services">Telecom Services</option>
                                    <option value="Traditional Clothing">Traditional Clothing</option>
                                    <option value="Utility Payments">Utility Payments</option>
                                    <option value="Water Bill Payments">Water Bill Payments</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Unavailable">Unavailable</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)*
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Service Image
                            </label>
                            {!uploadedImage ? (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                                    onClick={() => fileInputRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Drag and drop an image or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            ) : (
                                <div className="relative rounded-lg overflow-hidden">
                                    <img
                                        src={uploadedImage}
                                        alt="Service preview"
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={handleCancelImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Describe your service..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddService}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center shadow-md"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ServiceDetailModal = ({ service }) => {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-xl p-0 w-full max-w-3xl shadow-2xl overflow-hidden">
                    <div className="relative h-64">
                        <img
                            src={service.image.url}
                            alt={service.serviceName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                            <h2 className="text-2xl font-bold text-white">{service.serviceName}</h2>
                            <button
                                onClick={() => setShowServiceDetails(null)}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <button
                                onClick={() => {
                                    setShowServiceDetails(null);
                                    handleEnableEdit(service);
                                }}
                                className="bg-white text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors flex items-center justify-center shadow-lg"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                                <Tag className="h-4 w-4 mr-1" />
                                {service.category}
                            </div>
                            <div className="flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ${service.price}
                            </div>

                            <div className={`flex items-center px-3 py-1 rounded-full text-sm ${service.status === 'Available'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {service.status === 'Available' ? <CheckCircle className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                                {service.status}
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 mb-6">{service.description}</p>

                        <div className="border-t border-gray-200 pt-4 mt-2">
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowServiceDetails(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-b from-indigo-50 to-blue-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-indigo-800 mb-2">Service Management</h1>
                    <p className="text-gray-600">Manage and organize all your services in one place</p>
                </div>



                {/* Action Bar */}
                <div className="bg-white rounded-2xl shadow-md mb-8 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <Tag className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                            <h2 className="text-xl font-semibold text-gray-800">Your Services</h2>
                            <p className="text-gray-500 text-sm">Total services: {services.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center shadow-md font-medium w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add New Service
                    </button>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative h-48">
                                <img
                                    src={service.image?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                    alt={service.serviceName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${service.status === 'Available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {service.status}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-800 truncate">
                                        {service.serviceName}
                                    </h3>
                                    <div className="flex items-center text-emerald-600 font-semibold">
                                        <DollarSign className="h-4 w-4" />
                                        {service.price}
                                    </div>
                                </div>

                                <div className="flex items-center mb-3">
                                    <Tag className="h-4 w-4 text-indigo-500 mr-2" />
                                    <span className="text-sm text-indigo-600 font-medium">
                                        {service.category}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {service.description || 'No description available'}
                                </p>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => setShowServiceDetails(service)}
                                        className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        <Eye className="h-5 w-5 mr-1" />
                                        View Details
                                    </button>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEnableEdit(service)}
                                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(service._id, e)}
                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {services.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                        <div className="mx-auto bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-indigo-600" />
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-gray-800">No services found</h3>
                        <p className="mt-2 text-gray-500">
                            You haven't added any services yet. Click the button above to add your first service.
                        </p>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="mt-6 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto shadow-md"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Service
                        </button>
                    </div>
                )}

                {/* Modals */}
                {showUploadModal && <UploadModal />}
                {showServiceDetails && <ServiceDetailModal service={showServiceDetails} />}
                {editMode && (
                    <EditServiceModal
                        editFormData={editFormData}
                        handleCancelEdit={handleCancelEdit}
                        handleEditInputChange={handleEditInputChange}
                        handleEditImageUpload={handleEditImageUpload}
                        handleCancelEditImage={handleCancelEditImage}
                        handleSaveEdit={handleSaveEdit}
                    />
                )}
            </div>
        </div>
    );
};

export default VendorDashboardServicesSection;