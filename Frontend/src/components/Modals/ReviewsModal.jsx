import React, { useState, useEffect } from "react";
import {
  Star,
  Edit3,
  Trash2,
  MessageCircle,
  Calendar,
  X,
  Plus,
  Send,
  RotateCcw,
} from "lucide-react";
import { useReviewStore } from "../../../Store/reviewsStore";
import { useParams } from "react-router-dom";

const ReviewsModal = ({ isOpen, onClose }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment:
        "Absolutely amazing experience! The quality exceeded my expectations and the customer service was outstanding. Will definitely recommend to friends and family.",
      date: "2024-01-15",
      isOwn: false,
      avatar: "SJ",
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 4,
      comment:
        "Great product overall. Fast delivery and good packaging. Only minor issue was the color was slightly different from the photos.",
      date: "2024-01-10",
      isOwn: false,
      avatar: "MC",
    },
    {
      id: 3,
      name: "You",
      rating: 5,
      comment:
        "Love this! Perfect quality and exactly what I was looking for. The design is beautiful and it works perfectly.",
      date: "2024-01-20",
      isOwn: true,
      avatar: "YO",
    },
  ]);

  const { id, serviceId } = useParams();

  document.body.style.overflow = "hidden";

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const [editingReview, setEditingReview] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const { isModelOpen, setisModelOpen, postReview } = useReviewStore();

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Sort reviews to show user's review first
  const sortedReviews = [...reviews].sort((a, b) => {
    if (a.isOwn && !b.isOwn) return -1;
    if (!a.isOwn && b.isOwn) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const userReview = reviews.find((review) => review.isOwn);
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  const handleAddReview = () => {
    if (newReview.comment.trim() && newReview.rating > 0) {
      const review = {
        rating: newReview.rating,
        serviceId: serviceId,
        productId: id || null,
        comment: newReview.comment,
        date: new Date().toISOString().split("T")[0],
        isOwn: true,
        avatar: "YO",
      };
      postReview(review);
      console.log(review);
      setReviews([...reviews, review]);
      setNewReview({ rating: 0, comment: "" });
      setShowAddForm(false);
    }
  };

  const handleDeleteReview = (id) => {
    setReviews(reviews.filter((review) => review.id !== id));
  };

  const handleEditReview = (review) => {
    setEditingReview({ ...review });
  };

  const handleUpdateReview = () => {
    setReviews(
      reviews.map((review) =>
        review.id === editingReview.id ? editingReview : review
      )
    );
    setEditingReview(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderInteractiveStars = (
    rating,
    onRatingChange,
    isEditing = false
  ) => {
    const currentRating = isEditing ? hoveredStar || rating : rating;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <span className="text-sm font-semibold text-gray-700">Rate:</span>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  star <= currentRating
                    ? "bg-gradient-to-br from-red-400 to-pink-500 text-white scale-105 shadow-lg"
                    : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400 hover:scale-105"
                }`}
                onClick={() => onRatingChange(star)}
                onMouseEnter={() => isEditing && setHoveredStar(star)}
                onMouseLeave={() => isEditing && setHoveredStar(0)}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= currentRating ? "fill-current" : ""
                  }`}
                />
              </button>
            ))}
          </div>
          {currentRating > 0 && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-bold shadow-sm">
              {currentRating} star{currentRating !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderDisplayStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              star <= rating ? "text-red-500 fill-red-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isModelOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-5xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-auto 
      "
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-br from-red-500 via-red-600 to-pink-600 text-white p-4 sm:p-6 relative">
          <button
            onClick={setisModelOpen}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pr-12 sm:pr-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-1">Reviews</h2>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  {renderDisplayStars(Math.round(averageRating))}
                  <span className="text-xl sm:text-2xl font-bold">
                    {averageRating}
                  </span>
                </div>
                <span className="hidden sm:block text-red-100">•</span>
                <span className="text-red-100 text-sm sm:text-base">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                Quick Actions:
              </span>
              <div className="flex flex-wrap gap-2">
                {!userReview && !showAddForm && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Review</span>
                  </button>
                )}
                {userReview && (
                  <button
                    onClick={() => handleEditReview(userReview)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit My Review</span>
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              Scroll to see all reviews
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(98vh-140px)] sm:max-h-[calc(95vh-200px)]">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Add Review Form */}
            {showAddForm && !userReview && (
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Share Your Experience
                  </h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    {renderInteractiveStars(
                      newReview.rating,
                      (rating) => setNewReview({ ...newReview, rating }),
                      true
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tell us about your experience
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      placeholder="What did you love about this product? Any suggestions for improvement?"
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
                      rows="4"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Minimum 10 characters
                      </span>
                      <span className="text-xs text-gray-500">
                        {newReview.comment.length}/500
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2 sm:pt-4">
                    <button
                      onClick={handleAddReview}
                      disabled={
                        newReview.rating === 0 || newReview.comment.length < 10
                      }
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Review</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewReview({ rating: 0, comment: "" });
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Review Form */}
            {editingReview && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 shadow-lg">
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Update Your Review
                  </h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div>
                    {renderInteractiveStars(
                      editingReview.rating,
                      (rating) =>
                        setEditingReview({ ...editingReview, rating }),
                      true
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Update your thoughts
                    </label>
                    <textarea
                      value={editingReview.comment}
                      onChange={(e) =>
                        setEditingReview({
                          ...editingReview,
                          comment: e.target.value,
                        })
                      }
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-sm sm:text-base"
                      rows="4"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={handleUpdateReview}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Update Review</span>
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3 sm:space-y-4">
              {sortedReviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
                    review.isOwn
                      ? "bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 shadow-md"
                      : "bg-white border border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0 ${
                        review.isOwn
                          ? "bg-gradient-to-br from-red-500 to-pink-500"
                          : "bg-gradient-to-br from-gray-500 to-gray-600"
                      }`}
                    >
                      {review.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
                          <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                            {review.name}
                          </h4>
                          {review.isOwn && (
                            <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-bold shadow-sm w-fit">
                              Your Review
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-4">
                        {renderDisplayStars(review.rating)}
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-bold">
                          {review.rating}/5
                        </span>
                      </div>

                      <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                        {review.comment}
                      </p>

                      {review.isOwn && (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 flex items-center justify-center sm:justify-start space-x-1 text-sm"
                            title="Edit review"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span className="font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center justify-center sm:justify-start space-x-1 text-sm"
                            title="Delete review"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="font-medium">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  No reviews yet
                </h3>
                <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-4">
                  Be the first to share your experience with this product!
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 mx-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Write First Review</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo component to show how to use the modal

export default ReviewsModal;
