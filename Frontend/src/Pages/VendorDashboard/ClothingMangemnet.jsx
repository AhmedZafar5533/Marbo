import React, { useState, useEffect } from 'react';
import {
    Edit,
    Trash2,
    Plus,
    Package,
    DollarSign,
    Tag,
    Palette,
    Ruler,
    Users,
    Eye,
    Save,
    X,
    Upload,
    Star,
    ShoppingBag
} from 'lucide-react';
import { useClothingStore } from '../../../Store/clothingStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const ClothingManagement = () => {
    // Sample clothing data - replace with actual API calls
    const [clothingItems, setClothingItems] = useState([]);

    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [viewingItem, setViewingItem] = useState(null);


    const { getDashboardData, dashboardData, loading } = useClothingStore()

    useEffect(() => {
        getDashboardData()
    }, [getDashboardData])

    useEffect(() => {
        if (dashboardData && dashboardData.length > 0) {
            console.log('Dashboard data received:', dashboardData);
            setClothingItems(dashboardData);
        }
    }, [dashboardData]);

    if (loading) return <LoadingSpinner />


    const handleEdit = (item) => {
        setEditingItem(item._id);
        setEditForm({ ...item });
    };

    const handleSaveEdit = () => {
        console.log(editingItem, editForm);
        setClothingItems(items =>
            items.map(item =>
                item._id === editingItem ? { ...editForm } : item
            )
        );
        setEditingItem(null);
        setEditForm({});
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditForm({});
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setClothingItems(items => items.filter(item => item._id !== id));
        }
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayInputChange = (field, value) => {
        const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
        setEditForm(prev => ({
            ...prev,
            [field]: arrayValue
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getGenderColor = (gender) => {
        switch (gender) {
            case 'Men': return 'bg-blue-100 text-blue-800';
            case 'Women': return 'bg-pink-100 text-pink-800';
            case 'Kids': return 'bg-green-100 text-green-800';
            case 'Boys': return 'bg-cyan-100 text-cyan-800';
            case 'Girls': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-indigo-700 mb-2">Clothing Management</h1>
                    <p className="text-indigo-600">Manage your clothing inventory and product catalog</p>
                </div>

                {/* Add New Item Button */}
                <Link to={"/dashboard/vendor/add/clothing/clothes"}>
                    <div className="mb-8 flex justify-end">
                        <button className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg flex items-center justify-center transform hover:translate-y-px">
                            <Plus className="w-5 h-5 mr-2" />
                            Add New Clothing Item
                        </button>
                    </div>
                </Link>

                {/* Clothing Items Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {clothingItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-indigo-100 transition-all duration-300 hover:shadow-3xl">
                            {editingItem === item._id ? (
                                // Edit Mode
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-indigo-700">Edit Item</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                            <input
                                                type="text"
                                                value={editForm.productName || ''}
                                                onChange={(e) => handleInputChange('productName', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                                <input
                                                    type="text"
                                                    value={editForm.brand || ''}
                                                    onChange={(e) => handleInputChange('brand', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                <input
                                                    type="text"
                                                    value={editForm.category || ''}
                                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={editForm.price || ''}
                                                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={editForm.quantity || ''}
                                                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                            <select
                                                value={editForm.gender || ''}
                                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="Men">Men</option>
                                                <option value="Women">Women</option>
                                                <option value="Unisex">Unisex</option>
                                                <option value="Kids">Kids</option>
                                                <option value="Boys">Boys</option>
                                                <option value="Girls">Girls</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={editForm.sizes?.join(', ') || ''}
                                                onChange={(e) => handleArrayInputChange('sizes', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="S, M, L, XL"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                                            <input
                                                type="text"
                                                value={editForm.features?.join(', ') || ''}
                                                onChange={(e) => handleArrayInputChange('features', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="100% Cotton, Machine washable"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea
                                                value={editForm.description || ''}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    {/* Product Image */}
                                    <div className="relative h-64 bg-gradient-to-br from-indigo-100 to-indigo-200">
                                        {item.images && item.images.length > 0 ? (
                                            <img
                                                src={item.images[0].imageUrl}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-16 h-16 text-indigo-400" />
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <button
                                                onClick={() => setViewingItem(item)}
                                                className="p-2 bg-white bg-opacity-90 text-indigo-600 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 bg-white bg-opacity-90 text-blue-600 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 bg-white bg-opacity-90 text-red-600 rounded-lg hover:bg-opacity-100 transition-all shadow-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Gender Badge */}
                                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${getGenderColor(item.gender)}`}>
                                            {item.gender}
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{item.productName}</h3>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-indigo-600">${item.price}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Tag className="w-4 h-4 mr-1" />
                                                {item.brand}
                                            </div>
                                            <div className="flex items-center">
                                                <ShoppingBag className="w-4 h-4 mr-1" />
                                                {item.category}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Stock:</span>
                                                <span className={`text-sm font-bold ${item.quantity > 50 ? 'text-green-600' : item.quantity > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {item.quantity} units
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${item.quantity > 50 ? 'bg-green-500' : item.quantity > 10 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm font-medium text-gray-700 mb-2">Available Sizes:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {item.sizes.map((size, index) => (
                                                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                                                        {size}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 border-t pt-3 mt-4">
                                            Added: {formatDate(item.createdAt)}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* View Modal */}
                {viewingItem && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-indigo-700">Product Details</h2>
                                    <button
                                        onClick={() => setViewingItem(null)}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Product Image */}
                                    {viewingItem.images && viewingItem.images.length > 0 && (
                                        <div className="w-full h-64 rounded-2xl overflow-hidden">
                                            <img
                                                src={viewingItem.images[0].imageUrl}
                                                alt={viewingItem.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Product Name</h3>
                                            <p className="text-gray-600">{viewingItem.productName}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Price</h3>
                                            <p className="text-2xl font-bold text-indigo-600">${viewingItem.price}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Brand</h3>
                                            <p className="text-gray-600">{viewingItem.brand}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Category</h3>
                                            <p className="text-gray-600">{viewingItem.category}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Quantity</h3>
                                            <p className="text-gray-600">{viewingItem.quantity} units</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-2">Gender</h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(viewingItem.gender)}`}>
                                                {viewingItem.gender}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                                        <p className="text-gray-600">{viewingItem.description}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Available Sizes</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingItem.sizes.map((size, index) => (
                                                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingItem.features.map((feature, index) => (
                                                <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Section */}
                <div className="mt-12 text-center text-indigo-600 text-sm">
                    <p>Total Items: {clothingItems.length} | Need help? Contact <a href="#" className="underline hover:text-indigo-800">Support</a></p>
                </div>
            </div>
        </div>
    );
};

export default ClothingManagement;