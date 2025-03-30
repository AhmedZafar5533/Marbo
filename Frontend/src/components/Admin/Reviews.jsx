import React, { useState } from 'react';
import { MoreVertical, Star, X } from 'lucide-react';

const mockReviews = [
    {
        id: 1,
        customer: 'Customer #4582',
        vendor: 'Store A',
        rating: 5,
        comment: 'Excellent service and product quality!',
        date: '2025-02-10',
        status: 'Approved',
    },
    {
        id: 2,
        customer: 'Customer #3219',
        vendor: 'Store B',
        rating: 4,
        comment: 'Very good experience, but shipping was slow.',
        date: '2025-02-12',
        status: 'Pending',
    },
    {
        id: 3,
        customer: 'Customer #4021',
        vendor: 'Store C',
        rating: 3,
        comment: 'Average quality, not what I expected.',
        date: '2025-02-15',
        status: 'Approved',
    },
];

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const Reviews = () => {
    const [selectedReview, setSelectedReview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = (review) => {
        setSelectedReview(review);
        setModalOpen(true);
    };

    const closeModal = () => {
        setSelectedReview(null);
        setModalOpen(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reviews</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Manage Reviews
                </button>
            </div>

            {/* Reviews Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr className="border-b border-gray-200 dark:border-gray-600">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Review ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vendor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {mockReviews.map((review) => (
                                <tr
                                    key={review.id}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                    onClick={() => openModal(review)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{review.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{review.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{review.vendor}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 flex items-center">
                                        {[...Array(review.rating)].map((_, index) => (
                                            <Star key={index} size={16} className="text-yellow-500" />
                                        ))}
                                        <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">{review.rating}/5</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{review.comment}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatDate(review.date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {review.status === 'Approved' ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button
                                            className="p-1 rounded-full text-white cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{mockReviews.length}</span> of{' '}
                            <span className="font-medium">{mockReviews.length}</span> results
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Previous
                        </button>
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal for Review Details (Orders Modal Style) */}
            {modalOpen && selectedReview && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Overlay */}
                        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                        </div>
                        {/* Modal Content */}
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            Review {selectedReview.id}
                                            <span className={`ml-3 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${selectedReview.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {selectedReview.status}
                                            </span>
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Reviewed on {formatDate(selectedReview.date)}
                                        </p>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Customer Information
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedReview.customer}</p>
                                            {/* If you have additional customer details (e.g. email), you can add them here */}
                                        </div>

                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                            Vendor
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{selectedReview.vendor}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Rating & Comment
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <div className="flex items-center">
                                                {[...Array(selectedReview.rating)].map((_, index) => (
                                                    <Star key={index} size={16} className="text-yellow-500" />
                                                ))}
                                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{selectedReview.rating}/5</span>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{selectedReview.comment}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Close
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

export default Reviews;
