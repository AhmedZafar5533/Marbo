import {
  FileText,
  Clock,
  User,
  DollarSign,
  IdCard,
  Calendar,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useCartStore } from "../../Store/cartStore";

// Bill Details Component
export const BillDetails = ({ existingBill, setExistingBill, deleteBill }) => {
  console.log(existingBill);
  const { addToCart } = useCartStore();
  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleAddToCart = () => {
    const cartItem = {
      productId: existingBill._id,
      typeOf: "bill",
      serviceId: existingBill.serviceId._id,
      name: existingBill.name,
      price: parseFloat(existingBill.amountDue),
      imageUrl: existingBill.image[0].url,
    };
    addToCart(cartItem);
  };

  const handleDeleteBill = () => {
    if (
      confirm(
        "Are you sure you want to delete this bill? This action cannot be undone."
      )
    ) {
      const success = deleteBill(existingBill._id);
      if (success) setExistingBill(null);
    }
  };

  const daysUntilDue = getDaysUntilDue(existingBill.dueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  return (
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center pb-6 border-b border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Your Bill Details
            </h3>
            <p className="text-gray-600">
              Review your uploaded bill information
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold ${
                isOverdue
                  ? "bg-red-100 text-red-700"
                  : isDueSoon
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>
                {isOverdue
                  ? `Overdue by ${Math.abs(daysUntilDue)} days`
                  : isDueSoon
                  ? `Due in ${daysUntilDue} days`
                  : `Due in ${daysUntilDue} days`}
              </span>
            </div>
          </div>

          {/* Bill Image */}
          <div className="relative group">
            <img
              src={existingBill.image[0].url}
              alt="Bill"
              className="w-full h-80 object-cover rounded-2xl border-2 border-gray-200 group-hover:scale-[1.02] transition-transform shadow-lg"
            />
          </div>

          {/* Bill Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">
                    Name on Bill
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {existingBill.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Amount Due
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${existingBill.amountDue}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">
                    Bill Number
                  </p>
                  <p className="text-lg font-bold text-gray-900 break-all">
                    {existingBill.billNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">
                    Due Date
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(existingBill.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleDeleteBill}
              className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-rose-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl hover:shadow-2xl"
            >
              <Trash2 className="w-6 h-6" />
              <span>Delete Bill</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-gray-600">
              <span className="font-medium">Uploaded:</span>{" "}
              {formatDate(existingBill.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
