import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Package,
    DollarSign,
    ShoppingCart,
    X,
    Save,
    Upload
} from 'lucide-react';
import { useProductStore } from '../../../Store/productsStore';
import { Link } from 'react-router-dom';

const InventoryPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'view', 'edit', 'add'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    const { getInventory, products: inventory, loading } = useProductStore()

    // Mock data - replace with actual API calls
    // useEffect(() => {
    //     // Simulate API call
    //     const mockProducts = [
    //         {
    //             _id: '1',
    //             productName: 'Premium Wireless Headphones',
    //             category: 'Electronics',
    //             price: 299.99,
    //             description: 'High-quality wireless headphones with noise cancellation',
    //             features: ['Bluetooth 5.0', 'Noise Cancellation', '30hr Battery'],
    //             quantity: 45,
    //             images: [
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Headphones+1', publicId: 'img1' },
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Headphones+2', publicId: 'img2' }
    //             ],
    //             serviceId: 'service1',
    //             createdAt: new Date('2024-01-15'),
    //             updatedAt: new Date('2024-01-15')
    //         },
    //         {
    //             _id: '2',
    //             productName: 'Smart Watch Pro',
    //             category: 'Electronics',
    //             price: 399.99,
    //             description: 'Advanced fitness tracking with heart rate monitoring',
    //             features: ['Heart Rate Monitor', 'GPS', 'Water Resistant'],
    //             quantity: 23,
    //             images: [
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Watch+1', publicId: 'img3' }
    //             ],
    //             serviceId: 'service1',
    //             createdAt: new Date('2024-01-10'),
    //             updatedAt: new Date('2024-01-10')
    //         },
    //         {
    //             _id: '3',
    //             productName: 'Gaming Laptop',
    //             category: 'Computers',
    //             price: 1299.99,
    //             description: 'High-performance gaming laptop with RTX graphics',
    //             features: ['RTX 4060', '16GB RAM', '1TB SSD'],
    //             quantity: 8,
    //             images: [
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+1', publicId: 'img4' },
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+2', publicId: 'img5' },
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+3', publicId: 'img6' }
    //             ],
    //             serviceId: 'service2',
    //             createdAt: new Date('2024-01-05'),
    //             updatedAt: new Date('2024-01-05')
    //         },
    //         {
    //             _id: '4',
    //             productName: 'Wireless Bluetooth Speaker',
    //             category: 'Audio',
    //             price: 149.99,
    //             description: 'Portable speaker with rich bass and long battery life',
    //             features: ['360° Sound', '12hr Battery', 'Waterproof'],
    //             quantity: 67,
    //             images: [
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Speaker+1', publicId: 'img7' }
    //             ],
    //             serviceId: 'service1',
    //             createdAt: new Date('2024-01-12'),
    //             updatedAt: new Date('2024-01-12')
    //         },
    //         {
    //             _id: '5',
    //             productName: 'Professional Camera',
    //             category: 'Photography',
    //             price: 899.99,
    //             description: 'DSLR camera perfect for professional photography',
    //             features: ['4K Video', '24MP Sensor', 'WiFi Connectivity'],
    //             quantity: 12,
    //             images: [
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Camera+1', publicId: 'img8' },
    //                 { imageUrl: 'https://via.placeholder.com/300x200?text=Camera+2', publicId: 'img9' }
    //             ],
    //             serviceId: 'service3',
    //             createdAt: new Date('2024-01-08'),
    //             updatedAt: new Date('2024-01-08')
    //         }
    //     ];
    //     setProducts(mockProducts);
    // }, []);

    useEffect(() => {
        getInventory()
    }, [getInventory]);

    useEffect(() => {
        if (!loading && inventory && inventory.length > 0) {
            console.log("Products fetched:", inventory);
            setProducts(inventory);
        }

    }, [inventory]);

    // Filter and search logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === '' || product.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const categories = [...new Set(products.map(product => product.category))];

    const handleViewProduct = (product) => {
        setSelectedProduct(product);
        setModalType('view');
        setShowModal(true);
    };

    const handleEditProduct = (product) => {
        setSelectedProduct({ ...product });
        setModalType('edit');
        setShowModal(true);
    };



    const handleDeleteProduct = (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(product => product._id !== productId));
        }
    };

    const handleSaveProduct = () => {
        if (modalType === 'add') {
            const newProduct = {
                ...selectedProduct,
                _id: Date.now().toString(),
                createdAt: new Date(),
                updatedAt: new Date()
            };
            setProducts([...products, newProduct]);
        } else if (modalType === 'edit') {
            setProducts(products.map(product =>
                product._id === selectedProduct._id
                    ? { ...selectedProduct, updatedAt: new Date() }
                    : product
            ));
        }
        setShowModal(false);
    };

    const ProductCard = ({ product }) => (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative">
                <img
                    src={product.images[0]?.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 20 ? 'bg-green-100 text-green-800' :
                        product.quantity > 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {product.quantity} in stock
                    </span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg truncate">{product.productName}</h3>
                    <span className="text-indigo-600 font-bold">${product.price}</span>
                </div>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mb-3">
                    <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
                        {product.category}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {product.features.length} features
                    </span>
                </div>

                <div className="flex justify-between">
                    <button
                        onClick={() => handleViewProduct(product)}
                        className="flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                    </button>
                    <button
                        onClick={() => handleEditProduct(product)}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                    >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const Modal = () => {
        if (!showModal || !selectedProduct) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {modalType === 'view' ? 'Product Details' :
                                modalType === 'edit' ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="p-6">
                        {modalType === 'view' ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Product Images</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedProduct.images.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image.imageUrl}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="font-semibold text-gray-700">Name:</label>
                                            <p className="text-gray-600">{selectedProduct.productName}</p>
                                        </div>
                                        <div>
                                            <label className="font-semibold text-gray-700">Category:</label>
                                            <p className="text-gray-600">{selectedProduct.category}</p>
                                        </div>
                                        <div>
                                            <label className="font-semibold text-gray-700">Price:</label>
                                            <p className="text-gray-600">${selectedProduct.price}</p>
                                        </div>
                                        <div>
                                            <label className="font-semibold text-gray-700">Quantity:</label>
                                            <p className="text-gray-600">{selectedProduct.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700">Description:</label>
                                    <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700">Features:</label>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedProduct.features.map((feature, index) => (
                                            <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            value={selectedProduct.productName}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, productName: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input
                                            type="number"
                                            value={selectedProduct.price}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="0.00"
                                            step="0.01"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            value={selectedProduct.quantity}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={selectedProduct.description}
                                        onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter product description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={selectedProduct.features.join(', ')}
                                        onChange={(e) => setSelectedProduct({
                                            ...selectedProduct,
                                            features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                                        })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Feature 1, Feature 2, Feature 3"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProduct}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Product
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Product Inventory</h1>
                    <p className="text-gray-600">Manage your product catalog and inventory</p>
                </div>

                {/* Stats Cards
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-indigo-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Value</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${products.reduce((sum, product) => sum + (product.price * product.quantity), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <ShoppingCart className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {products.filter(product => product.quantity <= 10).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center">
                            <Filter className="h-8 w-8 text-purple-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Categories</p>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                            </div>
                        </div>
                    </div>
                </div> */}

                {/* Search and Filter Bar */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="md:w-64">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <Link to="/dashboard/vendor/add/products" >
                            <button

                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Product
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {currentProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-2">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg ${currentPage === i + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal />
        </div>
    );
};

export default InventoryPage;