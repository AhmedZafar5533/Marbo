import React, { useState, useEffect } from 'react';
import {
    Edit2,
    Trash2,
    Plus,
    Search,
    Filter,
    Eye,
    Users,
    Bed,
    MapPin,
    Star,
    Calendar,
    DollarSign,
    Home,
    X,
    Save,
    Upload,
    Camera
} from 'lucide-react';
import { useHolidayLetsStore } from '../../../Store/holidayLetsStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const HotelDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState(null);

    const { getDashboardData, dashboardData, loading } = useHolidayLetsStore();

    // Fetch data on component mount
    useEffect(() => {
        getDashboardData();
    }, [getDashboardData]);

    // Update hotels when dashboardData changes
    useEffect(() => {
        if (dashboardData && dashboardData.length > 0) {
            console.log('Dashboard data received:', dashboardData);
            setHotels(dashboardData);
        }
    }, [dashboardData]);

    // Filter hotels based on search and filter criteria
    useEffect(() => {
        let filtered = hotels;

        if (searchTerm) {
            filtered = filtered.filter(hotel =>
                hotel.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hotel.roomType?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(hotel => hotel.availability === filterStatus);
        }

        setFilteredHotels(filtered);
    }, [hotels, searchTerm, filterStatus]);

    if (loading) return <LoadingSpinner />;

    const handleEdit = (hotel) => {
        setEditingHotel({ ...hotel });
        setShowEditModal(true);
    };

    const handleDelete = (hotel) => {
        setHotelToDelete(hotel);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setHotels(hotels.filter(h => h._id !== hotelToDelete._id));
        setShowDeleteModal(false);
        setHotelToDelete(null);
    };

    const handleSave = () => {
        setHotels(hotels.map(h => h._id === editingHotel._id ? editingHotel : h));
        setShowEditModal(false);
        setEditingHotel(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'booked': return 'bg-red-100 text-red-800 border-red-200';
            case 'unavailable': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Safe calculation for average price
    const calculateAveragePrice = () => {
        if (hotels.length === 0) return 0;
        const total = hotels.reduce((sum, h) => sum + (h.price || h.pricePerNight || 0), 0);
        return Math.round(total / hotels.length);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-indigo-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-900 flex items-center">
                                <Home className="w-8 h-8 mr-3 text-indigo-600" />
                                Hotel Management Dashboard
                            </h1>
                            <p className="text-indigo-600 mt-1">Manage your hotel rooms and bookings</p>
                        </div>
                        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center transform hover:scale-105">
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Room
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                        <div className="flex items-center">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <Home className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Total Rooms</p>
                                <p className="text-2xl font-bold text-gray-900">{hotels.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
                        <div className="flex items-center">
                            <div className="bg-emerald-100 p-3 rounded-lg">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Available</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {hotels.filter(h => h.availability === 'available').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
                        <div className="flex items-center">
                            <div className="bg-red-100 p-3 rounded-lg">
                                <Users className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Booked</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {hotels.filter(h => h.availability === 'booked').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-600">Avg. Price</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${calculateAveragePrice()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-indigo-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search rooms by title or type..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="available">Available</option>
                                <option value="booked">Booked</option>
                                <option value="unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Hotels Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredHotels.map((hotel) => (
                        <div key={hotel._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 transform hover:scale-105 transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500">
                                {hotel.images && hotel.images.length > 0 ? (
                                    <img
                                        src={hotel.images[0].imageUrl}
                                        alt={hotel.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Camera className="w-16 h-16 text-white opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(hotel.availability)}`}>
                                        {hotel.availability?.charAt(0).toUpperCase() + hotel.availability?.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{hotel.title}</h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-indigo-600">
                                            ${hotel.price || hotel.pricePerNight || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">per night</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-1" />
                                        {hotel.maxGuests || 'N/A'} guests
                                    </div>
                                    <div className="flex items-center">
                                        <Bed className="w-4 h-4 mr-1" />
                                        {hotel.bedType || 'N/A'}
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {hotel.size || hotel.propertySize || 'N/A'} {hotel.sizeUnit || ''}
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{hotel.description}</p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {hotel.features?.slice(0, 3).map((feature, index) => (
                                        <span key={index} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs">
                                            {feature}
                                        </span>
                                    ))}
                                    {hotel.features?.length > 3 && (
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                                            +{hotel.features.length - 3} more
                                        </span>
                                    )}
                                </div>

                                <div className="text-xs text-gray-500 mb-4">
                                    Updated: {formatDate(hotel.updatedAt)}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(hotel)}
                                        className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                    >
                                        <Edit2 className="w-4 h-4 mr-1" />
                                        Edit
                                    </button>
                                    <button className="bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hotel)}
                                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredHotels.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-xl shadow-lg p-12 border border-indigo-100">
                            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No rooms found</h3>
                            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && editingHotel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Room</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Title</label>
                                    <input
                                        type="text"
                                        value={editingHotel.title || ''}
                                        onChange={(e) => setEditingHotel({ ...editingHotel, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                                    <select
                                        value={editingHotel.roomType || ''}
                                        onChange={(e) => setEditingHotel({ ...editingHotel, roomType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select room type</option>
                                        <option value="standard">Standard</option>
                                        <option value="deluxe">Deluxe</option>
                                        <option value="suite">Suite</option>
                                        <option value="executive">Executive</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night ($)</label>
                                    <input
                                        type="number"
                                        value={editingHotel.pricePerNight || editingHotel.price || ''}
                                        onChange={(e) => setEditingHotel({
                                            ...editingHotel,
                                            pricePerNight: Number(e.target.value),
                                            price: Number(e.target.value)
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                    <select
                                        value={editingHotel.availability || ''}
                                        onChange={(e) => setEditingHotel({ ...editingHotel, availability: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select availability</option>
                                        <option value="available">Available</option>
                                        <option value="booked">Booked</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Guests</label>
                                    <input
                                        type="number"
                                        value={editingHotel.maxGuests || ''}
                                        onChange={(e) => setEditingHotel({ ...editingHotel, maxGuests: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bed Type</label>
                                    <select
                                        value={editingHotel.bedType || ''}
                                        onChange={(e) => setEditingHotel({ ...editingHotel, bedType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="">Select bed type</option>
                                        <option value="single">Single</option>
                                        <option value="twin">Twin</option>
                                        <option value="queen">Queen</option>
                                        <option value="king">King</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={editingHotel.propertySize || editingHotel.size || ''}
                                            onChange={(e) => setEditingHotel({
                                                ...editingHotel,
                                                propertySize: Number(e.target.value),
                                                size: Number(e.target.value)
                                            })}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <select
                                            value={editingHotel.sizeUnit || 'sqft'}
                                            onChange={(e) => setEditingHotel({ ...editingHotel, sizeUnit: e.target.value })}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="sqft">sqft</option>
                                            <option value="sqm">sqm</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingHotel.description || ''}
                                    onChange={(e) => setEditingHotel({ ...editingHotel, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                                <input
                                    type="text"
                                    value={editingHotel.features?.join(', ') || ''}
                                    onChange={(e) => setEditingHotel({
                                        ...editingHotel,
                                        features: e.target.value.split(', ').filter(f => f.trim())
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex gap-4">
                            <button
                                onClick={handleSave}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && hotelToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Room</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{hotelToDelete.title}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
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

export default HotelDashboard;