import React, { useState, useEffect } from "react";
import { Star, X } from "lucide-react";
import { useVendorStore } from "../../../Store/vendorStore";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const VendorReviews = () => {
  const [selectedReview, setSelectedReview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { reviews, getReviews } = useVendorStore();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        await getReviews();
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const openModal = (review) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Reviews</h1>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Reviews</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Manage Reviews
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No reviews found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Vendor Reviews</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-auto">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr
                  key={review._id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => openModal(review)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {review._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {review.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    {[...Array(review.rating)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className="text-yellow-500 fill-yellow-500"
                      />
                    ))}
                    {[...Array(5 - review.rating)].map((_, index) => (
                      <Star
                        key={`empty-${index}`}
                        size={16}
                        className="text-gray-300"
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-600">
                      {review.rating}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                    {review.review}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      className="p-1 rounded-full text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => setSelectedReview(review)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{reviews.length}</span> of{" "}
              <span className="font-medium">{reviews.length}</span> results
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {modalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      Review {selectedReview._id}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Created on {formatDate(selectedReview.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      User Information
                    </h4>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedReview.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        User ID: {selectedReview.userId}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Rating & Review
                    </h4>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <div className="flex items-center">
                        {[...Array(selectedReview.rating)].map((_, index) => (
                          <Star
                            key={index}
                            size={20}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        ))}
                        {[...Array(5 - selectedReview.rating)].map(
                          (_, index) => (
                            <Star
                              key={`empty-${index}`}
                              size={20}
                              className="text-gray-300"
                            />
                          )
                        )}
                        <span className="ml-2 text-sm text-gray-600">
                          {selectedReview.rating}/5
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {selectedReview.review}
                      </p>
                      <h4 className="text-sm font-medium text-gray-500 mt-4">
                        Timestamps
                      </h4>
                      <div className="mt-2 border-t border-gray-200 pt-2">
                        <p className="text-xs text-gray-500">
                          Created: {formatDate(selectedReview.createdAt)}
                        </p>
                        {selectedReview.updatedAt && (
                          <p className="text-xs text-gray-500">
                            Updated: {formatDate(selectedReview.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
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

export default VendorReviews;
