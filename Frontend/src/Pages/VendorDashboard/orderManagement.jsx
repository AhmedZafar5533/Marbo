import { useState } from 'react';
import { Clock, Package, Check, AlertCircle, Search, Filter, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function VendorOrderDashboard() {
    // Sample order data based on the provided schema
    const initialOrders = [
        {
            id: 'ORD-2025042201',
            userId: '60d21b4967d0d8992e610c85',
            vendorId: '60d21b4967d0d8992e610c90',
            serviceName: 'Web Development',
            category: 'IT Services',
            price: 499.99,
            status: 'Processing',
            createdAt: '2025-04-20T10:30:00Z'
        },
        {
            id: 'ORD-2025042102',
            userId: '60d21b4967d0d8992e610c85',
            vendorId: '60d21b4967d0d8992e610c91',
            serviceName: 'Logo Design',
            category: 'Design',
            price: 149.50,
            status: 'Completed',
            createdAt: '2025-04-18T14:45:00Z'
        },
        {
            id: 'ORD-2025041503',
            userId: '60d21b4967d0d8992e610c86',
            vendorId: '60d21b4967d0d8992e610c92',
            serviceName: 'Content Writing',
            category: 'Content',
            price: 79.99,
            status: 'Processing',
            createdAt: '2025-04-15T09:15:00Z'
        },
        {
            id: 'ORD-2025041004',
            userId: '60d21b4967d0d8992e610c85',
            vendorId: '60d21b4967d0d8992e610c93',
            serviceName: 'SEO Optimization',
            category: 'Marketing',
            price: 299.95,
            status: 'Completed',
            createdAt: '2025-04-10T16:20:00Z'
        },
        {
            id: 'ORD-2025040505',
            userId: '60d21b4967d0d8992e610c87',
            vendorId: '60d21b4967d0d8992e610c90',
            serviceName: 'Mobile App Development',
            category: 'IT Services',
            price: 899.99,
            status: 'Completed',
            createdAt: '2025-04-05T11:10:00Z'
        },
        {
            id: 'ORD-2025033006',
            userId: '60d21b4967d0d8992e610c85',
            vendorId: '60d21b4967d0d8992e610c94',
            serviceName: 'Social Media Management',
            category: 'Marketing',
            price: 199.99,
            status: 'Cancelled',
            createdAt: '2025-03-30T08:30:00Z'
        }
    ];

    // State
    const [orders, setOrders] = useState(initialOrders);
    const [activeTab, setActiveTab] = useState('current');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    // Filter orders based on tab
    const currentOrders = orders.filter(order =>
        ['Processing'].includes(order.status)
    );

    const pastOrders = orders.filter(order =>
        ['Completed', 'Cancelled'].includes(order.status)
    );

    // Get unique categories for filter
    const categories = ['All Categories', ...new Set(orders.map(order => order.category))];

    // Filter orders based on search and category
    const filteredOrders = (activeTab === 'current' ? currentOrders : pastOrders)
        .filter(order => {
            const matchesSearch =
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.status.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === 'All Categories' || order.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });

    // Format date function
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Handle sort
    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing':
                return <Clock className="text-blue-500" size={18} />;
            case 'Completed':
                return <Check className="text-green-500" size={18} />;
            case 'Cancelled':
                return <AlertCircle className="text-red-500" size={18} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Service Order Management</h1>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 mr-4">
                                    <Clock size={24} className="text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Processing Orders</p>
                                    <p className="text-2xl font-semibold">{orders.filter(o => o.status === 'Processing').length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 mr-4">
                                    <Check size={24} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Completed Orders</p>
                                    <p className="text-2xl font-semibold">{orders.filter(o => o.status === 'Completed').length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-red-100 mr-4">
                                    <AlertCircle size={24} className="text-red-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Cancelled Orders</p>
                                    <p className="text-2xl font-semibold">{orders.filter(o => o.status === 'Cancelled').length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 mr-4">
                                    <Calendar size={24} className="text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                    <p className="text-2xl font-semibold">{orders.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                        <div className="flex border-b">
                            <button
                                className={`py-4 px-6 font-medium text-sm ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('current')}
                            >
                                Current Orders
                            </button>
                            <button
                                className={`py-4 px-6 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('history')}
                            >
                                Order History
                            </button>
                        </div>

                        {/* Search and filters */}
                        <div className="p-4 bg-gray-50 border-b">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Search by service name, category, or status..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <select
                                            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={categoryFilter}
                                            onChange={(e) => setCategoryFilter(e.target.value)}
                                        >
                                            {categories.map((category, index) => (
                                                <option key={index} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <Filter className="absolute right-2 top-2.5 text-gray-400" size={18} />
                                    </div>
                                    <div className="relative">
                                        <select className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Last 30 days</option>
                                            <option>Last 90 days</option>
                                            <option>This year</option>
                                            <option>All time</option>
                                        </select>
                                        <Filter className="absolute right-2 top-2.5 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Orders table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('id')}
                                        >
                                            <div className="flex items-center">
                                                Order ID
                                                {sortConfig.key === 'id' && (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('createdAt')}
                                        >
                                            <div className="flex items-center">
                                                Date
                                                {sortConfig.key === 'createdAt' && (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {sortConfig.key === 'status' && (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('serviceName')}
                                        >
                                            <div className="flex items-center">
                                                Service
                                                {sortConfig.key === 'serviceName' && (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('category')}
                                        >
                                            <div className="flex items-center">
                                                Category
                                                {sortConfig.key === 'category' && (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort('price')}
                                        >
                                            <div className="flex items-center">
                                                Price
                                                {sortConfig.key === 'price' && (
                                                    sortConfig.direction === 'asc' ?
                                                        <ChevronUp size={16} className="ml-1" /> :
                                                        <ChevronDown size={16} className="ml-1" />
                                                )}
                                            </div>
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedOrders.length > 0 ? (
                                        sortedOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(order.status)}
                                                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                              ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                              ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                            `}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.serviceName}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.category}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    ${order.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button className="text-blue-600 hover:text-blue-900">Details</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No orders found. Try adjusting your search or filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedOrders.length}</span> of{" "}
                                        <span className="font-medium">{sortedOrders.length}</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <a
                                            href="#"
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            &larr;
                                        </a>
                                        <a
                                            href="#"
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            1
                                        </a>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                                            2
                                        </span>
                                        <a
                                            href="#"
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            3
                                        </a>
                                        <a
                                            href="#"
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            &rarr;
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Order details modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-full overflow-y-auto">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-medium">Order Details</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-medium">{selectedOrder.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Created At</p>
                                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="flex items-center">
                                        {getStatusIcon(selectedOrder.status)}
                                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                      ${selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="font-medium">${selectedOrder.price.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="font-medium mb-2">Service Details</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p><span className="text-gray-500">Service Name:</span> {selectedOrder.serviceName}</p>
                                        <p><span className="text-gray-500">Category:</span> {selectedOrder.category}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Vendor Information</h4>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p><span className="text-gray-500">Vendor ID:</span> {selectedOrder.vendorId}</p>
                                        <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                                            View Vendor Profile
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="font-medium mb-2">User Information</h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p><span className="text-gray-500">User ID:</span> {selectedOrder.userId}</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded mr-2"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Close
                                </button>
                                {selectedOrder.status === 'Processing' && (
                                    <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded mr-2">
                                        Cancel Order
                                    </button>
                                )}
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                                    Contact Vendor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}