import React, { useState, useRef } from 'react';
import { Plus, Trash2, Edit, AlertCircle, Upload, Search, Package, Briefcase } from 'lucide-react';

const VendorDashboard = () => {
    // Sample product data
    const [products, setProducts] = useState([
        { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 89.99, stock: 23, status: 'Active', image: '/api/placeholder/80/80' },
        { id: 2, name: 'Organic Cotton T-Shirt', category: 'Apparel', price: 24.99, stock: 45, status: 'Active', image: '/api/placeholder/80/80' },
        { id: 3, name: 'Stainless Steel Water Bottle', category: 'Home Goods', price: 19.99, stock: 12, status: 'Active', image: '/api/placeholder/80/80' },
        { id: 4, name: 'Bamboo Cutting Board', category: 'Kitchen', price: 34.99, stock: 8, status: 'Low Stock', image: '/api/placeholder/80/80' },
        { id: 5, name: 'Smart Watch', category: 'Electronics', price: 199.99, stock: 0, status: 'Out of Stock', image: '/api/placeholder/80/80' },
    ]);

    // Sample services data
    const [services, setServices] = useState([
        { id: 1, name: 'Website Development', category: 'Digital', price: 1499, duration: '3 weeks', status: 'Available', image: '/api/placeholder/80/80' },
        { id: 2, name: 'Logo Design', category: 'Design', price: 299, duration: '1 week', status: 'Available', image: '/api/placeholder/80/80' },
        { id: 3, name: 'Social Media Management', category: 'Marketing', price: 499, duration: 'Monthly', status: 'Available', image: '/api/placeholder/80/80' },
        { id: 4, name: 'Business Consultation', category: 'Consulting', price: 150, duration: '1 hour', status: 'Limited', image: '/api/placeholder/80/80' },
        { id: 5, name: 'SEO Optimization', category: 'Digital', price: 799, duration: '2 weeks', status: 'Unavailable', image: '/api/placeholder/80/80' },
    ]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentTab, setCurrentTab] = useState('all');
    const [activeSection, setActiveSection] = useState('products'); // 'products' or 'services'
    const [modalType, setModalType] = useState('product'); // 'product' or 'service'

    // Delete handlers
    const handleDelete = (id) => {
        if (activeSection === 'products') {
            setProducts(products.filter(product => product.id !== id));
        } else {
            setServices(services.filter(service => service.id !== id));
        }
    };

    // Filter items based on search and tab
    const getFilteredItems = () => {
        const items = activeSection === 'products' ? products : services;

        return items.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase());

            if (currentTab === 'all') return matchesSearch;
            if (activeSection === 'products') {
                if (currentTab === 'active') return matchesSearch && item.status === 'Active';
                if (currentTab === 'low') return matchesSearch && item.status === 'Low Stock';
                if (currentTab === 'out') return matchesSearch && item.status === 'Out of Stock';
            } else {
                if (currentTab === 'active') return matchesSearch && item.status === 'Available';
                if (currentTab === 'limited') return matchesSearch && item.status === 'Limited';
                if (currentTab === 'unavailable') return matchesSearch && item.status === 'Unavailable';
            }

            return matchesSearch;
        });
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowUploadModal(true);
    };
    const UploadModal = () => {
        const [uploadedImage, setUploadedImage] = useState(null);
        const [base64Image, setBase64Image] = useState(null);
        const fileInputRef = useRef(null);

        const convertToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result;
                        resolve(base64String);
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('Not a valid image file'));
                }
            });
        };

        const handleImageUpload = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const base64String = await convertToBase64(file);
                    setUploadedImage(base64String);
                    setBase64Image(base64String);
                    console.log('Base64 image:', base64String);
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
                    console.log('Base64 image (drop):', base64String);
                } catch (error) {
                    console.error('Error converting dropped image to base64:', error);
                }
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
        };

        const handleAcceptImage = () => {
            // Handle accepting the image here
            console.log('Image accepted with base64:', base64Image);
            // Here you can send the base64Image to your API or store it in your form state
        };

        const handleCancelImage = () => {
            setUploadedImage(null);
            setBase64Image(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold mb-4">
                        {modalType === 'product' ? 'Upload New Product' : 'Add New Service'}
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {modalType === 'product' ? 'Product Name' : 'Service Name'}
                            </label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder={`Enter ${modalType} name`} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                                <option value="">Select category</option>
                                {modalType === 'product' ? (
                                    <>
                                        <option value="electronics">Electronics</option>
                                        <option value="apparel">Apparel</option>
                                        <option value="home">Home Goods</option>
                                        <option value="kitchen">Kitchen</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="digital">Digital</option>
                                        <option value="design">Design</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="consulting">Consulting</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {modalType === 'product' ? 'Stock' : 'Duration'}
                                </label>
                                {modalType === 'product' ? (
                                    <input type="number" className="w-full p-2 border border-gray-300 rounded-md" placeholder="0" />
                                ) : (
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g. 2 hours, 1 week" />
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {modalType === 'product' ? 'Product Image' : 'Service Image'}
                            </label>
                            {!uploadedImage ? (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer"
                                    onClick={() => fileInputRef.current.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-1 text-sm text-gray-500">Drag and drop an image or click to browse</p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={uploadedImage}
                                        alt="Uploaded"
                                        className="w-full h-48 object-contain border rounded-md"
                                    />
                                    <div className="absolute top-2 right-2 flex space-x-2">
                                        <button
                                            onClick={handleAcceptImage}
                                            className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleCancelImage}
                                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Optional: Display Base64 preview (for debugging) */}
                        {base64Image && (
                            <div className="border p-2 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Base64 Image String (Preview):</label>
                                <div className="bg-gray-100 p-2 rounded overflow-auto max-h-24 text-xs">
                                    {base64Image.substring(0, 100)}...
                                </div>
                            </div>
                        )}

                        {modalType === 'service' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    rows="3"
                                    placeholder="Describe what this service includes..."
                                ></textarea>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                            {modalType === 'product' ? 'Upload Product' : 'Add Service'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Dashboard Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
                </div>
            </div>

            {/* Main Section Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <div className="border-b border-gray-200">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => {
                                setActiveSection('products');
                                setCurrentTab('all');
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeSection === 'products'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Package className="mr-2 h-5 w-5" />
                            Products
                        </button>
                        <button
                            onClick={() => {
                                setActiveSection('services');
                                setCurrentTab('all');
                            }}
                            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeSection === 'services'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <Briefcase className="mr-2 h-5 w-5" />
                            Services
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white shadow rounded-lg">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <h2 className="text-lg font-medium text-gray-900">
                            {activeSection === 'products' ? 'Your Products' : 'Your Services'}
                        </h2>

                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={activeSection === 'products' ? "Search products..." : "Search services..."}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={() => handleOpenModal(activeSection === 'products' ? 'product' : 'service')}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {activeSection === 'products' ? 'Add Product' : 'Add Service'}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                        <nav className="flex space-x-6">
                            <button
                                onClick={() => setCurrentTab('all')}
                                className={`px-1 py-2 text-sm font-medium ${currentTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                All {activeSection === 'products' ? 'Products' : 'Services'}
                            </button>
                            <button
                                onClick={() => setCurrentTab('active')}
                                className={`px-1 py-2 text-sm font-medium ${currentTab === 'active' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                {activeSection === 'products' ? 'Active' : 'Available'}
                            </button>
                            <button
                                onClick={() => setCurrentTab(activeSection === 'products' ? 'low' : 'limited')}
                                className={`px-1 py-2 text-sm font-medium ${(activeSection === 'products' && currentTab === 'low') ||
                                    (activeSection === 'services' && currentTab === 'limited')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {activeSection === 'products' ? 'Low Stock' : 'Limited'}
                            </button>
                            <button
                                onClick={() => setCurrentTab(activeSection === 'products' ? 'out' : 'unavailable')}
                                className={`px-1 py-2 text-sm font-medium ${(activeSection === 'products' && currentTab === 'out') ||
                                    (activeSection === 'services' && currentTab === 'unavailable')
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {activeSection === 'products' ? 'Out of Stock' : 'Unavailable'}
                            </button>
                        </nav>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {activeSection === 'products' ? 'Product' : 'Service'}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {activeSection === 'products' ? 'Stock' : 'Duration'}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {getFilteredItems().length > 0 ? (
                                    getFilteredItems().map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-md object-cover" src={item.image} alt={item.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {activeSection === 'products' ? item.stock : item.duration}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${(activeSection === 'products' && item.status === 'Active') ||
                                                        (activeSection === 'services' && item.status === 'Available')
                                                        ? 'bg-green-100 text-green-800'
                                                        : (activeSection === 'products' && item.status === 'Low Stock') ||
                                                            (activeSection === 'services' && item.status === 'Limited')
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <button className="text-blue-600 hover:text-blue-900">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <AlertCircle className="h-8 w-8 text-gray-400" />
                                                <p>No {activeSection === 'products' ? 'products' : 'services'} found. Try a different search or add a new {activeSection === 'products' ? 'product' : 'service'}.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{getFilteredItems().length}</span> of <span className="font-medium">
                                {activeSection === 'products' ? products.length : services.length}
                            </span> {activeSection === 'products' ? 'products' : 'services'}
                        </div>

                        <div className="flex space-x-2">
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && <UploadModal />}
        </div>
    );
};

export default VendorDashboard;