import React, { useRef } from 'react';

const EditServiceModal = () => {
    // Use refs to maintain focus across renders
    const nameInputRef = useRef(null);
    const categorySelectRef = useRef(null);
    const statusSelectRef = useRef(null);
    const priceInputRef = useRef(null);
    const descriptionTextareaRef = useRef(null);

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
                            ref={nameInputRef}
                            type="text"
                            name="serviceName"
                            value={editFormData.serviceName || ''}
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
                                ref={categorySelectRef}
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
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                ref={statusSelectRef}
                                name="status"
                                value={editFormData.status || 'Available'}
                                onChange={handleEditInputChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price ($)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                ref={priceInputRef}
                                type="number"
                                name="price"
                                value={editFormData.price || ''}
                                onChange={handleEditInputChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
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
                            ref={descriptionTextareaRef}
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

export default EditServiceModal;