import { useEffect, useState } from 'react';
import {
    Search,
    ArrowUp,
    ArrowDown,

    AlertTriangle
} from 'lucide-react';
import { useAdminStore } from '../../../Store/adminStore';
import { Link } from 'react-router-dom';


const ListedVendors = () => {

    const { approvedVendors, loading, getApprovedVendors } = useAdminStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'joinDate', direction: 'desc' });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getApprovedVendors();
    }, [getApprovedVendors]);

    const categories = ['all', ...new Set(approvedVendors.map(vendor => vendor.category))];

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedVendors = [...approvedVendors]
        .filter(vendor =>
            vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === 'all' || vendor.category === selectedCategory)
        )
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    // Pagination configuration
    const itemsPerPage = 10;
    const totalPages = Math.ceil(sortedVendors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedVendors.slice(startIndex, startIndex + itemsPerPage);

    // Format date and currency
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Render sort indicator
    const renderSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc'
                ? <ArrowUp size={14} className="ml-1" />
                : <ArrowDown size={14} className="ml-1" />;
        }
        return null;
    };

    // Handlers for filter changes that also reset pagination
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-lg text-gray-700 dark:text-gray-300">Loading approved vendors...</p>
            </div>
        );
    }

    if (!loading && approvedVendors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <AlertTriangle size={36} className="text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No approved vendors found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">There are no approved vendors in the system yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mb-20">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Approved Vendors</h1>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex md:flex-row flex-col gap-3">
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'All Categories' : category}
                                    </option>
                                ))}
                            </select>
                            <ArrowDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>


                    </div>
                </div>
            </div>

            {/* Vendors Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('businessName')}>
                                        Vendor
                                        {renderSortIndicator('businessName')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('category')}>
                                        Category
                                        {renderSortIndicator('category')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('joinDate')}>
                                        Join Date
                                        {renderSortIndicator('joinDate')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    <div className="flex items-center cursor-pointer" onClick={() => requestSort('businessRevenue')}>
                                        Revenue
                                        {renderSortIndicator('businessRevenue')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.length > 0 ? (
                                currentItems.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                                                    {vendor.businessName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {vendor.businessName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        ID: {vendor.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                                                {vendor.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {formatDate(vendor.joinDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {formatCurrency(vendor.businessRevenue)}
                                        </td>
                                        <td className="px-3 py-4 text-white">
                                            <Link to={`/vendor-details/${vendor.id}?mode=view`} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">View</Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <AlertTriangle size={36} className="text-gray-400 dark:text-gray-500 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No vendors found</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {searchTerm || selectedCategory !== 'all'
                                                    ? "Try adjusting your search or filter criteria"
                                                    : "There are no approved vendors in the system yet"}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {sortedVendors.length > 0 && (
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing results {startIndex + 1} to {startIndex + currentItems.length} of {sortedVendors.length}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm ${currentPage === index + 1
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        } hover:bg-blue-600 hover:text-white transition-colors duration-300`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListedVendors;
