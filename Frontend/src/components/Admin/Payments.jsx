import React, { useState } from 'react';
import {
    Search, Filter, MoreVertical, CheckCircle2, XCircle,
    Clock, AlertTriangle, XCircle as XIcon, Truck as TruckIcon
} from 'lucide-react';

// Updated mock data with extra fields for the modal
const mockPayments = [
    {
        id: 1,
        vendor: 'Store A',
        customer: { name: 'Alice Johnson', email: 'alice@example.com' },
        date: '2025-02-10',
        amount: 4500,
        status: 'Completed',
        shippingAddress: '123 Main St, Metropolis, USA',
        items: [
            { id: 1, name: 'Product A', quantity: 1, price: 2000 },
            { id: 2, name: 'Product B', quantity: 2, price: 1250 },
        ],
        total: 4500,
        paymentStatus: 'Paid',
        trackingNumber: 'TRACK12345'
    },
    {
        id: 2,
        vendor: 'Store B',
        customer: { name: 'Bob Smith', email: 'bob@example.com' },
        date: '2025-02-12',
        amount: 3200,
        status: 'Pending',
        shippingAddress: '456 Elm St, Gotham, USA',
        items: [
            { id: 1, name: 'Product C', quantity: 1, price: 3200 },
        ],
        total: 3200,
        paymentStatus: 'Pending'
    },
    {
        id: 3,
        vendor: 'Store C',
        customer: { name: 'Charlie Brown', email: 'charlie@example.com' },
        date: '2025-02-14',
        amount: 2900,
        status: 'Failed',
        shippingAddress: '789 Oak St, Star City, USA',
        items: [
            { id: 1, name: 'Product D', quantity: 1, price: 2900 },
        ],
        total: 2900,
        paymentStatus: 'Refunded'
    },
    {
        id: 4,
        vendor: 'Store D',
        customer: { name: 'Diana Prince', email: 'diana@example.com' },
        date: '2025-02-15',
        amount: 5100,
        status: 'Completed',
        shippingAddress: '321 Pine St, Central City, USA',
        items: [
            { id: 1, name: 'Product E', quantity: 2, price: 2550 },
        ],
        total: 5100,
        paymentStatus: 'Paid',
        trackingNumber: 'TRACK67890'
    },
    {
        id: 5,
        vendor: 'Store E',
        customer: { name: 'Evan Davis', email: 'evan@example.com' },
        date: '2025-02-16',
        amount: 6700,
        status: 'Pending',
        shippingAddress: '654 Maple St, Coast City, USA',
        items: [
            { id: 1, name: 'Product F', quantity: 1, price: 6700 },
        ],
        total: 6700,
        paymentStatus: 'Pending'
    },
];

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const Payments = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
    };

    const handleViewDetails = (payment) => {
        setSelectedPayment(payment);
        setShowPaymentDetails(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle2 size={16} className="mr-1" />;
            case 'Pending':
                return <Clock size={16} className="mr-1" />;
            case 'Failed':
                return <XCircle size={16} className="mr-1" />;
            default:
                return <AlertTriangle size={16} className="mr-1" />;
        }
    };

    const filteredPayments = mockPayments.filter(payment => {
        const matchesSearch = payment.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.id.toString().includes(searchQuery);
        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Manage and track vendor payments
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
                        placeholder="Search payments..."
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
                            onClick={() => handleStatusFilterChange('Completed')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <CheckCircle2 size={16} className="mr-1" /> Completed
                        </button>
                        <button
                            onClick={() => handleStatusFilterChange('Pending')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <Clock size={16} className="mr-1" /> Pending
                        </button>
                        <button
                            onClick={() => handleStatusFilterChange('Failed')}
                            className={`px-3 py-1.5 text-sm rounded-md flex items-center ${statusFilter === 'Failed' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <XCircle size={16} className="mr-1" /> Failed
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
                                        onClick={() => { setShowFilterMenu(false); /* Implement sorting as needed */ }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Most Recent
                                    </button>
                                    <button
                                        onClick={() => { setShowFilterMenu(false); /* Implement sorting as needed */ }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Oldest First
                                    </button>
                                    <button
                                        onClick={() => { setShowFilterMenu(false); /* Implement sorting as needed */ }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Highest Amount
                                    </button>
                                    <button
                                        onClick={() => { setShowFilterMenu(false); /* Implement sorting as needed */ }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        Lowest Amount
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex-1">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Payment ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Vendor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPayments.length > 0 ? (
                                filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {payment.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {payment.customer.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {payment.customer.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {payment.vendor}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(payment.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            {formatCurrency(payment.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(payment.status)}`}>
                                                {getStatusIcon(payment.status)}
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(payment)}
                                                    className="p-1  text-white  cursor-pointer"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No payments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPaymentDetails && selectedPayment && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={() => setShowPaymentDetails(false)}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                        </div>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            Payment {selectedPayment.id}
                                            <span className={`ml-3 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(selectedPayment.status)}`}>
                                                {getStatusIcon(selectedPayment.status)}
                                                {selectedPayment.status}
                                            </span>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Processed on {formatDate(selectedPayment.date)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPaymentDetails(false)}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <XIcon size={20} />
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Customer Information
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {selectedPayment.customer.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {selectedPayment.customer.email}
                                            </p>
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                            Shipping Address
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {selectedPayment.shippingAddress}
                                            </p>
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                            Vendor
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {selectedPayment.vendor}
                                            </p>
                                        </div>

                                        {selectedPayment.trackingNumber && (
                                            <>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                                    Tracking Information
                                                </h4>
                                                <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center">
                                                    <TruckIcon size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {selectedPayment.trackingNumber}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Payment Summary
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <div className="space-y-3">
                                                {selectedPayment.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-900 dark:text-white">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                Qty: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-gray-900 dark:text-white">
                                                            {formatCurrency(item.price)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                                                <div className="flex justify-between text-sm">
                                                    <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                                                    <p className="text-gray-900 dark:text-white font-medium">
                                                        {formatCurrency(selectedPayment.total * 0.9)}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between text-sm mt-2">
                                                    <p className="text-gray-500 dark:text-gray-400">Shipping</p>
                                                    <p className="text-gray-900 dark:text-white">Free</p>
                                                </div>
                                                <div className="flex justify-between text-sm mt-2">
                                                    <p className="text-gray-500 dark:text-gray-400">Tax</p>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {formatCurrency(selectedPayment.total * 0.1)}
                                                    </p>
                                                </div>
                                                <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-gray-900 dark:text-white">Total</p>
                                                    <p className="text-gray-900 dark:text-white">
                                                        {formatCurrency(selectedPayment.total)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedPayment.paymentStatus === 'Paid' ? 'bg-green-500' : selectedPayment.paymentStatus === 'Refunded' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                            Payment Status:
                                                        </span>
                                                    </div>
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {selectedPayment.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowPaymentDetails(false)}
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

export default Payments;
