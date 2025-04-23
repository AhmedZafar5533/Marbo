import React, { useState, useEffect } from 'react';
import {
    Filter,
    Search,
    Download,
    Eye,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    TruckIcon,
    
} from 'lucide-react';

// You would typically import this from your data file
const mockOrders = [
    {
        id: 'ORD-9385',
        customer: 'Alice Johnson',
        email: 'alice@example.com',
        date: '2025-02-25T14:30:00',
        total: 234.50,
        status: 'Delivered',
        paymentStatus: 'Paid',
        items: [
            { id: 1, name: 'Organic Coffee Beans', quantity: 2, price: 45.00 },
            { id: 2, name: 'Ceramic Mug Set', quantity: 1, price: 144.50 }
        ],
        vendor: 'Coffee Emporium',
        shippingAddress: '123 Main St, Portland, OR 97201',
        trackingNumber: 'TRK78945612'
    },
    {
        id: 'ORD-8273',
        customer: 'Bob Smith',
        email: 'bob@example.com',
        date: '2025-02-24T10:15:00',
        total: 89.99,
        status: 'Processing',
        paymentStatus: 'Paid',
        items: [
            { id: 3, name: 'Handmade Soap Set', quantity: 1, price: 89.99 }
        ],
        vendor: 'Natural Essentials',
        shippingAddress: '456 Pine Ave, Seattle, WA 98101',
        trackingNumber: null
    },
    {
        id: 'ORD-7162',
        customer: 'Carol Davis',
        email: 'carol@example.com',
        date: '2025-02-23T16:45:00',
        total: 320.75,
        status: 'Shipped',
        paymentStatus: 'Paid',
        items: [
            { id: 4, name: 'Handcrafted Wooden Bowl', quantity: 1, price: 175.50 },
            { id: 5, name: 'Artisan Cheese Board', quantity: 1, price: 145.25 }
        ],
        vendor: 'Woodland Crafts',
        shippingAddress: '789 Oak Rd, Austin, TX 78701',
        trackingNumber: 'TRK36925814'
    },
    {
        id: 'ORD-6051',
        customer: 'David Wilson',
        email: 'david@example.com',
        date: '2025-02-22T09:30:00',
        total: 65.00,
        status: 'Cancelled',
        paymentStatus: 'Refunded',
        items: [
            { id: 6, name: 'Scented Candle Set', quantity: 1, price: 65.00 }
        ],
        vendor: 'Aroma Haven',
        shippingAddress: '321 Maple Dr, Denver, CO 80202',
        trackingNumber: null
    },
    {
        id: 'ORD-5940',
        customer: 'Eva Brown',
        email: 'eva@example.com',
        date: '2025-02-21T13:20:00',
        total: 410.25,
        status: 'Delivered',
        paymentStatus: 'Paid',
        items: [
            { id: 7, name: 'Handwoven Basket', quantity: 1, price: 120.00 },
            { id: 8, name: 'Organic Tea Sampler', quantity: 1, price: 85.25 },
            { id: 9, name: 'Artisan Chocolate Box', quantity: 1, price: 205.00 }
        ],
        vendor: 'Global Artisans',
        shippingAddress: '654 Birch St, Chicago, IL 60601',
        trackingNumber: 'TRK14725836'
    }
];

const Orders = () => {
    const [orders, setOrders] = useState(mockOrders);
    const [filteredOrders, setFilteredOrders] = useState(orders);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filterOption, setFilterOption] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        applyFilters();
    }, [orders, searchQuery, filterOption, statusFilter]);

    const applyFilters = () => {
        let filtered = [...orders];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(query) ||
                order.customer.toLowerCase().includes(query) ||
                order.email.toLowerCase().includes(query) ||
                order.vendor.toLowerCase().includes(query)
            );
        }

        // Apply date filter
        if (filterOption === 'recent') {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (filterOption === 'oldest') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (filterOption === 'highest') {
            filtered.sort((a, b) => b.total - a.total);
        } else if (filterOption === 'lowest') {
            filtered.sort((a, b) => a.total - b.total);
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleFilterChange = (option) => {
        setFilterOption(option);
        setShowFilterMenu(false);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered':
                return <CheckCircle2 size={16} className="mr-1" />;
            case 'Processing':
                return <Clock size={16} className="mr-1" />;
            case 'Shipped':
                return <TruckIcon size={16} className="mr-1" />;
            case 'Cancelled':
                return <XCircle size={16} className="mr-1" />;
            default:
                return <AlertTriangle size={16} className="mr-1" />;
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage and track customer orders
                </p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="pl-10 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusFilterChange('all')}
                            className={`px-3 py-1.5 text-sm rounded-md ${statusFilter === 'all' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => handleStatusFilterChange('Processing')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Processing' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <Clock size={16} className="mr-1" /> Processing
                        </button>
                        <button
                            onClick={() => handleStatusFilterChange('Shipped')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Shipped' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <TruckIcon size={16} className="mr-1" /> Shipped
                        </button>
                        <button
                            onClick={() => handleStatusFilterChange('Delivered')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Delivered' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <CheckCircle2 size={16} className="mr-1" /> Delivered
                        </button>
                        <button
                            onClick={() => handleStatusFilterChange('Cancelled')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Cancelled' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <XCircle size={16} className="mr-1" /> Cancelled
                        </button>
                    </div>

                    <div className="relative ml-2">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Filter size={16} />
                            <span>Sort</span>
                        </button>

                        {showFilterMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleFilterChange('recent')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Most Recent
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('oldest')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Oldest First
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('highest')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Highest Amount
                                    </button>
                                    <button
                                        onClick={() => handleFilterChange('lowest')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Lowest Amount
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Vendor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {order.customer}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {order.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(order.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {order.vendor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center ">
                                                <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="p-1 text-white cursor-pointer"
                                                    title="View Details"
                                                >
                                                   Veiw Details
                                                </button>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setShowOrderDetails(false)}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            Order {selectedOrder.id}
                                            <span className={`ml-3 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(selectedOrder.status)}`}>
                                                {getStatusIcon(selectedOrder.status)}
                                                {selectedOrder.status}
                                            </span>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Placed on {formatDate(selectedOrder.date)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowOrderDetails(false)}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Customer Information
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.customer}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedOrder.email}</p>
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                            Shipping Address
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.shippingAddress}</p>
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                            Vendor
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.vendor}</p>
                                        </div>

                                        {selectedOrder.trackingNumber && (
                                            <>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                                    Tracking Information
                                                </h4>
                                                <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center">
                                                    <TruckIcon size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedOrder.trackingNumber}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Order Summary
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <div className="space-y-3">
                                                {selectedOrder.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-900 dark:text-white">{item.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                                        </div>
                                                        <p className="text-sm text-gray-900 dark:text-white">{formatCurrency(item.price)}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                                                <div className="flex justify-between text-sm">
                                                    <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">{formatCurrency(selectedOrder.total * 0.9)}</p>
                                                </div>
                                                <div className="flex justify-between text-sm mt-2">
                                                    <p className="text-gray-500 dark:text-gray-400">Shipping</p>
                                                    <p className="text-gray-900 dark:text-white">Free</p>
                                                </div>
                                                <div className="flex justify-between text-sm mt-2">
                                                    <p className="text-gray-500 dark:text-gray-400">Tax</p>
                                                    <p className="text-gray-900 dark:text-white">{formatCurrency(selectedOrder.total * 0.1)}</p>
                                                </div>
                                                <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-gray-900 dark:text-white">Total</p>
                                                    <p className="text-gray-900 dark:text-white">{formatCurrency(selectedOrder.total)}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedOrder.paymentStatus === 'Paid' ? 'bg-green-500' : selectedOrder.paymentStatus === 'Refunded' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">Payment Status:</span>
                                                    </div>
                                                    <span className="text-sm text-gray-900 dark:text-white">{selectedOrder.paymentStatus}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowOrderDetails(false)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Print Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;