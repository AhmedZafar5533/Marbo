import { useState, useRef } from 'react'

const UploadModal = ({ showUploadModal, setShowUploadModal }) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        duration: '',
        description: '',
        status: 'Available'
    });
    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
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

    const handleAddService = () => {
        if (!formData.name || !formData.category || !formData.price || !formData.duration) {
            alert('Please fill out all required fields');
            return;
        }

        const newService = {
            id: Date.now(),
            name: formData.name,
            category: formData.category,
            price: parseFloat(formData.price),
            duration: formData.duration,
            status: formData.status,
            description: formData.description,
            image: uploadedImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        };

        setServices(prev => [...prev, newService]);
        setShowUploadModal(false);
        setShowSuccessMessage(true);
        console.log(newService)
        setTimeout(() => setShowSuccessMessage(false), 3000);
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration*
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="e.g. 2 hours, 1 week"
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
export default UploadModal;