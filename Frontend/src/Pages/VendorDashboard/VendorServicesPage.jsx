import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Eye, AlertCircle, Briefcase, Upload, X, Edit, Clock, DollarSign, Tag, Save, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useServiceStore } from '../../../Store/servicesStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuthStore } from '../../../Store/authStore';

const VendorDashboardServicesSection = () => {
    const [services, setServices] = useState([]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [activeServiceId, setActiveServiceId] = useState(null);
    const [showServiceDetails, setShowServiceDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const navigate = useNavigate()



    const { user } = useAuthStore()


    useEffect(() => {
        if (!user.onboardingDone) {
            navigate("/goto/onboarding")
        }
    }, [])

    const { initializeService, loading, getServicesData, servicesData } = useServiceStore()

    const toggleActiveService = (id) => {
        setActiveServiceId(activeServiceId === id ? null : id);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        setServices(services.filter(service => service.id !== id));
    };

    const handleEnableEdit = (service) => {
        setEditMode(true);
        setEditFormData({
            ...service,
            originalImage: service.image
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditFormData(null);
    };

    const handleSaveEdit = () => {
        setServices(services.map(service =>
            service.id === editFormData.id ? editFormData : service
        ));
        setEditMode(false);
        setShowServiceDetails(editFormData);
        setEditFormData(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64String = await convertToBase64(file);
                setEditFormData(prev => ({
                    ...prev,
                    image: base64String
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

    useEffect(() => {
        getServicesData()
    }, [])


    useEffect(() => {
        if (servicesData.length > 0) {
            setServices(servicesData);
        }
    }, [servicesData]);

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
        const fileInputRef = useRef(null);

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            // Clear error message on input change
            setErrorMessage(null);
            setFormData(prev => ({ ...prev, [name]: value }));
        };

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

        // Validation function returns an error message if invalid, or null if valid.
        const validateForm = () => {
            if (!formData.name || !formData.category || !formData.price) {
                return "Please fill out all required fields";
            }
            // Service name: allow only letters, numbers, and spaces.
            const nameRegex = /^[a-zA-Z0-9\s]+$/;
            if (!nameRegex.test(formData.name)) {
                return "Service name can only contain letters, numbers, and spaces";
            }
            // Price: valid number with up to 2 decimal places.
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
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                status: formData.status,
                description: formData.description,
                image: uploadedImage ||
                    'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            };
            console.log(newService);
            initializeService(newService)
        };

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto mx-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-indigo-700">Add New Service</h2>
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
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
                                    <option value="Arts & Crafts">Arts & Crafts</option>
                                    <option value="Education">Education</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Groceries">Groceries</option>
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

                        <div className="grid grid-cols-2 gap-4">
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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
                            alt={service.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                            <h2 className="text-2xl font-bold text-white">{service.name}</h2>
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
                                ${service.price.toFixed(2)}
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

    const EditServiceModal = () => {
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
                                name="name"
                                value={editFormData.serviceName}
                                onChange={handleEditInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={editFormData.category}
                                    onChange={handleEditInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                >
                                    <option value="Arts & Crafts">Arts & Crafts</option>
                                    <option value="Education">Education</option>
                                    <option value="Construction">Construction</option>
                                    <option value="Groceries">Groceries</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={editFormData.status}
                                    onChange={handleEditInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Unavailable">Unavailable</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price ($)
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="number"
                                        name="price"
                                        value={editFormData.price}
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
                                    src={editFormData.image.url}
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
                                value={editFormData.description}
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
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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

    return (
        <div className="bg-gray-50 min-h-screen">




            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
                    <div className="flex justify-between items-center">
                        <div></div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add New Service
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <div
                            key={service._id}
                            onClick={() => setShowServiceDetails(service)}
                            className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${activeServiceId === service.id ? 'ring-2 ring-indigo-500' : ''
                                }`}
                        >
                            <div className="relative h-48">
                                <img
                                    src={service.image.url}
                                    alt={service.serviceName}
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${service.status === 'Available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {service.status}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                                        {service.serviceName}
                                    </h3>
                                    <button
                                        onClick={(e) => handleDelete(service.id, e)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <Tag className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500">{service.category}</span>
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <Link
                                        to={`/edit/${service._id}`}

                                        className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Service Page
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEnableEdit(service);
                                        }}
                                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                    >
                                        <Edit className="h-4 w-4 mr-1" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {services.length === 0 && (
                        <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mb-3 mx-auto" />
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No services found</h3>
                            <p className="text-gray-500 mb-4">
                                Try adding a new service
                            </p>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add New Service
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showUploadModal && <UploadModal />}
            {showServiceDetails && <ServiceDetailModal service={showServiceDetails} />}
            {editMode && <EditServiceModal />}
        </div>
    );
};

export default VendorDashboardServicesSection;