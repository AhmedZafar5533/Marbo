import { useEffect, useState } from 'react';
import {

    Filter,

} from 'lucide-react';
// import VendorModal from '../../components/Modals/VendorDetailModal';
import { useAdminStore } from '../../../Store/adminStore';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner';

const PendingVendors = () => {


    const { pendingVendors, loading, getPendingVendors } = useAdminStore();

    const [filteredVendors, setFilteredVendors] = useState([]);
    const [filterOption, setFilterOption] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredVendors.slice(startIndex, startIndex + itemsPerPage);



    useEffect(() => {
        const gettingData = async () => {
            await getPendingVendors()
        }
        gettingData()
    }, [getPendingVendors]);

    useEffect(() => {
        setFilteredVendors(pendingVendors);
    }, [pendingVendors]);


    // Handle filter change and reset page to 1
    const handleFilterChange = (option) => {
        setFilterOption(option);
        setShowFilterMenu(false);
        setCurrentPage(1);
        if (option === 'all') {
            setFilteredVendors(pendingVendors);
        } else if (option === 'recent') {
            const recent = [...pendingVendors].sort(
                (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
            );
            setFilteredVendors(recent);
        } else if (option === 'oldest') {
            const oldest = [...pendingVendors].sort(
                (a, b) => new Date(a.applicationDate) - new Date(b.applicationDate)
            );
            setFilteredVendors(oldest);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1);
        if (query.trim() === '') {
            handleFilterChange(filterOption);
        } else {
            const results = pendingVendors.filter(
                vendor =>
                    vendor.businessName.toLowerCase().includes(query) ||
                    vendor.email.toLowerCase().includes(query) ||
                    vendor.businessType.toLowerCase().includes(query)
            );
            setFilteredVendors(results);
        }
    };




    if (loading) {
        return <LoadingSpinner></LoadingSpinner>;
    }

    return (
        <div className="h-full flex flex-col mb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Vendors</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Review and approve vendor applications
                </p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg w-full sm:w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">
                        {filteredVendors.length} vendors
                    </span>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Filter size={16} />
                            <span>
                                {filterOption === 'all'
                                    ? 'All Vendors'
                                    : filterOption === 'recent'
                                        ? 'Most Recent'
                                        : 'Oldest First'}
                            </span>
                        </button>
                        {showFilterMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleFilterChange('all')}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        All Vendors
                                    </button>
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Vendor List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex-1">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Vendor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Business Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Application Date
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
                            {currentItems.length > 0 ? (
                                currentItems.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                                                    {vendor.businessName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {vendor.businessName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {vendor.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {vendor.businessType}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(vendor.applicationDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 dark:text-gray-400">
                                            <Link to={`/vendor-details/${vendor.id}`}><button className='text-white cursor-pointer'>View Details</button></Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        No pending vendors found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Results Footer */}
                <div className="mt-4 px-6 py-1 text-sm text-gray-500 dark:text-gray-400">
                    Showing results {startIndex + 1} to {startIndex + currentItems.length} of {filteredVendors.length}
                </div>
                {/* Pagination Controls */}
                <div className="flex items-center justify-between mt-4 px-6 pb-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>


        </div>
    );
};

export default PendingVendors;
