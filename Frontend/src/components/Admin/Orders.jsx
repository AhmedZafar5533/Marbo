import React, { useState, useEffect } from "react";
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
  Package,
} from "lucide-react";
import { useAdminStore } from "../../../Store/adminStore";

const Orders = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { orders, getOrders } = useAdminStore();

  // Fetch orders on component mount and when dependencies change
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        await getOrders();
      } catch (err) {
        setError("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [getOrders]);

  // Apply filters whenever orders or filter criteria change
  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, filterOption, statusFilter]);

  const applyFilters = () => {
    if (!orders || !Array.isArray(orders)) {
      setFilteredOrders([]);
      return;
    }

    let filtered = [...orders];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const orderId = order._id?.toLowerCase() || "";
        const customerName = order.userId?.name?.toLowerCase() || "";
        const customerEmail = order.userId?.email?.toLowerCase() || "";

        return (
          orderId.includes(query) ||
          customerName.includes(query) ||
          customerEmail.includes(query)
        );
      });
    }

    // Apply date filter
    if (filterOption === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterOption === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (filterOption === "highest") {
      filtered.sort((a, b) => b.subtotal - a.subtotal);
    } else if (filterOption === "lowest") {
      filtered.sort((a, b) => a.subtotal - b.subtotal);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
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
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="mr-1" />;
      case "processing":
        return <Clock size={16} className="mr-1" />;
      case "shipped":
        return <TruckIcon size={16} className="mr-1" />;
      case "cancelled":
        return <XCircle size={16} className="mr-1" />;
      case "pending":
        return <Package size={16} className="mr-1" />;
      default:
        return <AlertTriangle size={16} className="mr-1" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPaymentStatusText = (isPaid) => {
    console.log(isPaid)
    return isPaid  ? "Paid" : "Pending";
  };

  const getPaymentStatusColor = (isPaid) => {
    return isPaid ? "bg-green-500" : "bg-yellow-500";
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Loading orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
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
              onClick={() => handleStatusFilterChange("pending")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "pending"
                  ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <Package size={16} className="mr-1" /> Pending
            </button>
            <button
              onClick={() => handleStatusFilterChange("processing")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "processing"
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <Clock size={16} className="mr-1" /> Processing
            </button>
            <button
              onClick={() => handleStatusFilterChange("shipped")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "shipped"
                  ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <TruckIcon size={16} className="mr-1" /> Shipped
            </button>
            <button
              onClick={() => handleStatusFilterChange("completed")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "completed"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <CheckCircle2 size={16} className="mr-1" /> Completed
            </button>
            <button
              onClick={() => handleStatusFilterChange("cancelled")}
              className={`px-3 py-1.5 text-sm rounded-md flex items-center ${
                statusFilter === "cancelled"
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
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
                    onClick={() => handleFilterChange("recent")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Most Recent
                  </button>
                  <button
                    onClick={() => handleFilterChange("oldest")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Oldest First
                  </button>
                  <button
                    onClick={() => handleFilterChange("highest")}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    Highest Amount
                  </button>
                  <button
                    onClick={() => handleFilterChange("lowest")}
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
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order._id?.slice(-8).toUpperCase() || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.userId?.name || "Unknown Customer"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.userId?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(order.subtotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        title="View Details"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={() => setShowOrderDetails(false)}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      Order {selectedOrder._id?.slice(-8).toUpperCase()}
                      <span
                        className={`ml-3 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${getStatusBadgeClass(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </span>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Placed on {formatDate(selectedOrder.createdAt)}
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
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedOrder.userId?.name || "Unknown Customer"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedOrder.userId?.email || "No email provided"}
                      </p>
                    </div>

                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                      Order Information
                    </h4>
                    <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Order ID:</span>{" "}
                        {selectedOrder._id}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-medium">Items:</span>{" "}
                        {selectedOrder.itemCount}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(selectedOrder.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Order Summary
                    </h4>
                    <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500 dark:text-gray-400">
                          Subtotal
                        </p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {formatCurrency(selectedOrder.subtotal)}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <p className="text-gray-500 dark:text-gray-400">
                          Shipping
                        </p>
                        <p className="text-gray-900 dark:text-white">Free</p>
                      </div>
                      <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-900 dark:text-white">Total</p>
                        <p className="text-gray-900 dark:text-white">
                          {formatCurrency(selectedOrder.subtotal)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${getPaymentStatusColor(
                              selectedOrder.isPaid
                            )}`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Payment Status:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getPaymentStatusText(selectedOrder.isPaid)}
                        </span>
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
                  <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    Update Status
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
