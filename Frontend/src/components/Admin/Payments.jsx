import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  XCircle as XIcon,
  Truck as TruckIcon,
} from "lucide-react";
import { useAdminStore } from "../../../Store/adminStore";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount); // Assuming amount is in cents
};

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { payments, getPayments, loading } = useAdminStore();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await getPayments();
      } catch (err) {
        setError("Failed to fetch payments");
        console.error("Error fetching payments:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [getPayments]);

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
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "succeeded":
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "failed":
      case "canceled":
      case "refunded":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "succeeded":
      case "completed":
      case "paid":
        return <CheckCircle2 size={16} className="mr-1" />;
      case "pending":
      case "processing":
        return <Clock size={16} className="mr-1" />;
      case "failed":
      case "canceled":
      case "refunded":
        return <XCircle size={16} className="mr-1" />;
      default:
        return <AlertTriangle size={16} className="mr-1" />;
    }
  };

  const getDisplayStatus = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "succeeded":
        return "Completed";
      case "processing":
        return "Pending";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  };

  const filteredPayments =
    payments?.filter((payment) => {
      const matchesSearch =
        payment.stipePaymentId
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        payment._id?.toString().includes(searchQuery) ||
        payment.userId?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        payment.userId?.email
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const paymentStatus = getDisplayStatus(payment.status);
      const matchesStatus =
        statusFilter === "all" || paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading payments...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4">
          <AlertTriangle size={48} />
        </div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payments
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage and track customer payments
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
              onClick={() => handleStatusFilterChange("all")}
              className={`px-3 py-1.5 text-sm rounded-md ${
                statusFilter === "all"
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilterChange("Completed")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "Completed"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <CheckCircle2 size={16} className="mr-1" /> Completed
            </button>
            <button
              onClick={() => handleStatusFilterChange("Pending")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "Pending"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <Clock size={16} className="mr-1" /> Pending
            </button>
            <button
              onClick={() => handleStatusFilterChange("Failed")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "Failed"
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
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
                    onClick={() => {
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Most Recent
                  </button>
                  <button
                    onClick={() => {
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => {
                      setShowFilterMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Highest Amount
                  </button>
                  <button
                    onClick={() => {
                      setShowFilterMenu(false);
                    }}
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
                  Service/Product
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
                  <tr
                    key={payment._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {payment.stipePaymentId || payment._id?.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.userId?.name || "Unknown Customer"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.userId?.email || "No email"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {payment.serviceId||
                            payment.productId ||
                            "Service/Product"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.serviceId
                            ? "Service"
                            : payment.productId
                            ? "Product"
                            : "Unknown"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(
                          payment.status
                        )}`}
                      >
                        {getStatusIcon(payment.status)}
                        {getDisplayStatus(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setShowPaymentDetails(false)}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      Payment Details
                      <span
                        className={`ml-3 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(
                          selectedPayment.status
                        )}`}
                      >
                        {getStatusIcon(selectedPayment.status)}
                        {getDisplayStatus(selectedPayment.status)}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Processed on {formatDate(selectedPayment.createdAt)}
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
                        {selectedPayment.userId?.name || "Unknown Customer"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPayment.userId?.email || "No email provided"}
                      </p>
                    </div>

                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                      Payment Information
                    </h4>
                    <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Payment ID:
                          </span>
                          <span className="text-gray-900 dark:text-white font-mono">
                            {selectedPayment.stipePaymentId ||
                              selectedPayment._id}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Currency:
                          </span>
                          <span className="text-gray-900 dark:text-white uppercase">
                            {selectedPayment.currency}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">
                            Created:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(selectedPayment.createdAt)}
                          </span>
                        </div>
                        {selectedPayment.updatedAt &&
                          selectedPayment.updatedAt !==
                            selectedPayment.createdAt && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Updated:
                              </span>
                              <span className="text-gray-900 dark:text-white">
                                {formatDate(selectedPayment.updatedAt)}
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Purchase Details
                    </h4>
                    <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPayment.serviceId?.name ||
                              selectedPayment.productId?.name ||
                              "Service/Product"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedPayment.serviceId
                              ? "Service"
                              : selectedPayment.productId
                              ? "Product"
                              : "Type: Unknown"}
                          </p>
                          {selectedPayment.serviceId?.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {selectedPayment.serviceId.description}
                            </p>
                          )}
                          {selectedPayment.productId?.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {selectedPayment.productId.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                        <div className="flex justify-between text-base font-medium">
                          <p className="text-gray-900 dark:text-white">
                            Total Amount
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            {formatCurrency(
                              selectedPayment.amount,
                              selectedPayment.currency
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                selectedPayment.status.toLowerCase() ===
                                "succeeded"
                                  ? "bg-green-500"
                                  : selectedPayment.status.toLowerCase() ===
                                    "failed"
                                  ? "bg-red-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Payment Status:
                            </span>
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">
                            {getDisplayStatus(selectedPayment.status)}
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
