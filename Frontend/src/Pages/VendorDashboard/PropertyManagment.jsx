import React, { useState, useEffect } from 'react';
import {
    Home,
    Edit3,
    Trash2,
    Plus,
    Eye,
    MapPin,
    Users,
    Bed,
    Bath,
    Calendar,
    DollarSign,
    Search,
    Filter,
    Grid,
    List,
    Settings,
    Camera,
    X,
    Check,
    AlertCircle,
    Clock,
    Star
} from 'lucide-react';

const PropertyManagementDashboard = () => {
    const [properties, setProperties] = useState([
        {
            _id: '1',
            title: 'Luxury Villa in Mirpur Hills',
            propertyType: 'villa',
            pricePerNight: 250,
            availability: 'available',
            maxGuests: 8,
            bedrooms: 4,
            bathrooms: 3,
            propertySize: 2500,
            sizeUnit: 'sqft',
            description: 'Beautiful luxury villa with stunning mountain views and modern amenities. Perfect for families and groups looking for a premium stay experience.',
            features: ['Wi-Fi', 'AC', 'Parking', 'Pool', 'Mountain View'],
            images: [
                { imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400', publicId: 'villa1' },
                { imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', publicId: 'villa2' }
            ],
            addressLine1: '123 Hills Road',
            city: 'Mirpur',
            stateRegion: 'Azad Jammu and Kashmir',
            country: 'Pakistan',
            checkinTime: '15:00',
            checkoutTime: '11:00',
            createdAt: '2024-01-15T10:00:00Z'
        },
        {
            _id: '2',
            title: 'Cozy Apartment Downtown',
            propertyType: 'apartment',
            pricePerNight: 120,
            availability: 'available',
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 2,
            propertySize: 1200,
            sizeUnit: 'sqft',
            description: 'Modern apartment in the heart of the city with easy access to shopping and dining. Fully furnished with contemporary amenities.',
            features: ['Wi-Fi', 'AC', 'Heater', 'Kitchen'],
            images: [
                { imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', publicId: 'apt1' }
            ],
            addressLine1: '456 Main Street',
            city: 'Mirpur',
            stateRegion: 'Azad Jammu and Kashmir',
            country: 'Pakistan',
            checkinTime: '14:00',
            checkoutTime: '10:00',
            createdAt: '2024-02-01T08:30:00Z'
        },
        {
            _id: '3',
            title: 'Riverside Cabin Retreat',
            propertyType: 'cabin',
            pricePerNight: 180,
            availability: 'draft',
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2,
            propertySize: 1800,
            sizeUnit: 'sqft',
            description: 'Peaceful cabin by the river offering tranquility and natural beauty. Perfect for nature lovers and those seeking a quiet getaway.',
            features: ['Wi-Fi', 'Fireplace', 'Parking', 'River View'],
            images: [
                { imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400', publicId: 'cabin1' }
            ],
            addressLine1: '789 River Road',
            city: 'Mirpur',
            stateRegion: 'Azad Jammu and Kashmir',
            country: 'Pakistan',
            checkinTime: '16:00',
            checkoutTime: '11:00',
            createdAt: '2024-02-10T14:15:00Z'
        }
    ]);

    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const propertyTypes = ['house', 'apartment', 'villa', 'condo', 'cabin', 'loft', 'bungalow', 'other'];
    const availabilityOptions = ['available', 'unavailable', 'draft'];

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.propertyType.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || property.availability === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const handleDeleteProperty = (property) => {
        setPropertyToDelete(property);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setProperties(properties.filter(p => p._id !== propertyToDelete._id));
        setShowDeleteModal(false);
        setPropertyToDelete(null);
    };

    const handleEditProperty = (property) => {
        setEditingProperty({ ...property });
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        setProperties(properties.map(p =>
            p._id === editingProperty._id ? editingProperty : p
        ));
        setShowEditModal(false);
        setEditingProperty(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'unavailable': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const PropertyCard = ({ property }) => (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
                <img
                    src={property.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.availability)}`}>
                        {property.availability}
                    </span>
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-lg">
                    <span className="text-indigo-600 font-bold">${property.pricePerNight}/night</span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{property.title}</h3>
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-lg text-sm font-medium capitalize">
                        {property.propertyType}
                    </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.city}, {property.stateRegion}</span>
                </div>

                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{property.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms} baths</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEditProperty(property)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Property"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDeleteProperty(property)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Property"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="text-xs text-gray-500">
                        Created: {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );

    const PropertyListItem = ({ property }) => (
        <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img
                        src={property.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'}
                        alt={property.title}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{property.title}</h3>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{property.city}, {property.stateRegion}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                <span>{property.maxGuests}</span>
                            </div>
                            <div className="flex items-center">
                                <Bed className="w-4 h-4 mr-1" />
                                <span>{property.bedrooms}</span>
                            </div>
                            <div className="flex items-center">
                                <Bath className="w-4 h-4 mr-1" />
                                <span>{property.bathrooms}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">${property.pricePerNight}/night</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.availability)}`}>
                            {property.availability}
                        </span>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEditProperty(property)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Property"
                        >
                            <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleDeleteProperty(property)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Property"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-indigo-700 mb-2 flex items-center justify-center">
                        <Home className="w-8 h-8 mr-3" />
                        Property Management Dashboard
                    </h1>
                    <p className="text-indigo-600">Manage your property listings with ease</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                                <p className="text-3xl font-bold text-indigo-600">{properties.length}</p>
                            </div>
                            <div className="bg-indigo-100 p-3 rounded-xl">
                                <Home className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Available</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {properties.filter(p => p.availability === 'available').length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Draft</p>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {properties.filter(p => p.availability === 'draft').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg. Price</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    ${Math.round(properties.reduce((sum, p) => sum + p.pricePerNight, 0) / properties.length)}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-indigo-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search properties..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64"
                                />
                            </div>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="unavailable">Unavailable</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>

                            <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg flex items-center">
                                <Plus className="w-5 h-5 mr-2" />
                                Add Property
                            </button>
                        </div>
                    </div>
                </div>

                {/* Properties List */}
                <div className={`${viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                    }`}>
                    {filteredProperties.map(property => (
                        viewMode === 'grid'
                            ? <PropertyCard key={property._id} property={property} />
                            : <PropertyListItem key={property._id} property={property} />
                    ))}
                </div>

                {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                        <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                        <div className="flex items-center mb-6">
                            <div className="bg-red-100 p-3 rounded-full mr-4">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Delete Property</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{propertyToDelete?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex space-x-4">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingProperty && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Edit Property</h3>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingProperty.title}
                                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                    <select
                                        value={editingProperty.propertyType}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, propertyType: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {propertyTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                    <select
                                        value={editingProperty.availability}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, availability: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {availabilityOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price/Night</label>
                                    <input
                                        type="number"
                                        value={editingProperty.pricePerNight}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, pricePerNight: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                                    <input
                                        type="number"
                                        value={editingProperty.maxGuests}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, maxGuests: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                    <input
                                        type="number"
                                        value={editingProperty.bedrooms}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                    <input
                                        type="number"
                                        value={editingProperty.bathrooms}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, bathrooms: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingProperty.description}
                                    onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
                                    <input
                                        type="time"
                                        value={editingProperty.checkinTime}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, checkinTime: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
                                    <input
                                        type="time"
                                        value={editingProperty.checkoutTime}
                                        onChange={(e) => setEditingProperty({ ...editingProperty, checkoutTime: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleSaveEdit}
                                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyManagementDashboard;
