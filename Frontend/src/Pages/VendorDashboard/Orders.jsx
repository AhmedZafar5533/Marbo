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
  User,
  ShoppingBag,
  Calendar,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-react";
import { useVendorStore } from "../../../Store/vendorStore";

const VendorOrders = () => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const { orders, getOrders } = useVendorStore();

  // Fetch orders on component mount and when dependencies change
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        await getOrders();
      } catch (err) {
        setError("Failed to fetch service orders");
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
        const mainOrderId = order.mainOrderId?.toLowerCase() || "";
        const serviceId = order.serviceId?.toLowerCase() || "";
        const customerName = order.userId?.name?.toLowerCase() || "";
        const customerEmail = order.userId?.email?.toLowerCase() || "";

        return (
          orderId.includes(query) ||
          mainOrderId.includes(query) ||
          serviceId.includes(query) ||
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
    setExpandedItems({}); // Reset expanded items when opening new order
  };

  const toggleItemExpansion = (itemIndex) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 size={16} className="mr-1" />;
      case "processing":
        return <Clock size={16} className="mr-1" />;
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
    return isPaid ? "Paid" : "Pending";
  };

  const getPaymentStatusColor = (isPaid) => {
    return isPaid ? "bg-green-500" : "bg-yellow-500";
  };

  // Helper function to render sub-details in a structured way
  const renderSubDetails = (subDetails, itemName) => {
    if (!subDetails || Object.keys(subDetails).length === 0) {
      return (
        <div className="text-sm text-gray-400 italic text-center py-2">
          No additional details
        </div>
      );
    }

    const renderValue = (value, key = "") => {
      if (value === null || value === undefined) {
        return <span className="text-gray-400 italic">N/A</span>;
      }

      if (typeof value === "boolean") {
        return (
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-medium ${
              value
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {value ? "Yes" : "No"}
          </span>
        );
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        return (
          <div className="ml-4 mt-2 border-l pl-3 border-gray-200 space-y-1">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={subKey} className="flex gap-2">
                <span className="text-xs font-medium text-gray-600 capitalize min-w-[100px]">
                  {subKey
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  :
                </span>
                <div className="text-xs text-gray-700 break-words">
                  {renderValue(subValue, subKey)}
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (Array.isArray(value)) {
        return (
          <div className="ml-4 mt-2 space-y-1">
            {value.map((item, index) => (
              <div
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 rounded-md text-gray-700"
              >
                {typeof item === "object" ? renderValue(item) : String(item)}
              </div>
            ))}
          </div>
        );
      }

      if (
        typeof value === "string" &&
        (value.startsWith("http://") || value.startsWith("https://"))
      ) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium underline text-xs break-words"
          >
            🔗 View Link
          </a>
        );
      }

      return <span className="text-xs text-gray-700">{String(value)}</span>;
    };

    return (
      <div className="grid gap-3">
        {Object.entries(subDetails).map(([key, value]) => (
          <div
            key={key}
            className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-gray-800 capitalize min-w-[120px]">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </span>
              <div className="flex-1 text-sm">{renderValue(value, key)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
          <p className="text-gray-500 mt-1">
            Manage and track customer service orders
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading service orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
          <p className="text-gray-500 mt-1">
            Manage and track customer service orders
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
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
    <div className="h-full flex flex-col bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Orders</h1>
        <p className="text-gray-500 mt-1">
          Manage and track customer service orders
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search service orders..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 px-4 py-2 border border-gray-300 rounded-lg w-full bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters & buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Status Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {["all", "pending", "processing", "completed", "cancelled"].map(
              (status) => {
                const statusMap = {
                  all: { label: "All", color: "gray" },
                  pending: {
                    label: "Pending",
                    color: "yellow",
                    icon: <Package size={16} className="mr-1" />,
                  },
                  processing: {
                    label: "Processing",
                    color: "blue",
                    icon: <Clock size={16} className="mr-1" />,
                  },
                  completed: {
                    label: "Completed",
                    color: "green",
                    icon: <CheckCircle2 size={16} className="mr-1" />,
                  },
                  cancelled: {
                    label: "Cancelled",
                    color: "red",
                    icon: <XCircle size={16} className="mr-1" />,
                  },
                };
                const { label, color, icon } = statusMap[status];
                const isActive = statusFilter === status;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`px-3 py-1.5 text-sm rounded-md flex items-center transition-colors ${
                      isActive
                        ? `bg-${color}-100 text-${color}-800`
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {icon} {label}
                  </button>
                );
              }
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative ml-0 sm:ml-2 mt-2 sm:mt-0">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
            >
              <Filter size={16} />
              <span>Sort</span>
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {["recent", "oldest", "highest", "lowest"].map((sort) => {
                    const sortMap = {
                      recent: "Most Recent",
                      oldest: "Oldest First",
                      highest: "Highest Amount",
                      lowest: "Lowest Amount",
                    };
                    return (
                      <button
                        key={sort}
                        onClick={() => handleFilterChange(sort)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 transition-colors"
                      >
                        {sortMap[sort]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors mt-2 sm:mt-0 w-full sm:w-auto justify-center">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-auto flex-1">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order._id || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar size={14} className="text-gray-400 mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <ShoppingBag size={14} className="text-gray-400 mr-1" />
                        {order.itemCount}{" "}
                        {order.itemCount === 1 ? "item" : "items"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.subtotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${getPaymentStatusColor(
                            order.isPaid
                          )}`}
                        ></div>
                        <span className="text-xs font-medium">
                          {getPaymentStatusText(order.isPaid)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} className="mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">
                      No service orders found
                    </p>
                    <p className="text-sm">
                      Service orders will appear here once customers place them.
                    </p>
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="p-6 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      Service Order {selectedOrder._id?.slice(-6).toUpperCase()}
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
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Order Information
                    </h4>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Order ID:</span>{" "}
                        {selectedOrder._id}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Items:</span>{" "}
                        {selectedOrder.itemCount}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Last Updated:</span>{" "}
                        {formatDate(selectedOrder.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Order Summary
                    </h4>
                    <div className="mt-2 border-t border-gray-200 pt-2">
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500">Subtotal</p>
                        <p className="text-gray-900 font-medium">
                          {formatCurrency(selectedOrder.subtotal)}
                        </p>
                      </div>
                      <div className="flex justify-between text-base font-medium mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-900">Total</p>
                        <p className="text-gray-900">
                          {formatCurrency(selectedOrder.subtotal)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${getPaymentStatusColor(
                              selectedOrder.isPaid
                            )}`}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">
                            Payment Status:
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">
                          {getPaymentStatusText(selectedOrder.isPaid)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Items List with Sub-Details */}
                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">
                      Order Items & Details
                    </h4>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => {
                        const isExpanded = expandedItems[index];
                        const hasSubDetails =
                          item.subDetails &&
                          Object.keys(item.subDetails).length > 0;

                        return (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg bg-white"
                          >
                            {/* Item Header */}
                            <div className="p-4 border-b border-gray-100">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {item.imageUrl && (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.name}
                                      className="w-16 h-16 rounded-lg object-cover"
                                    />
                                  )}
                                  <div>
                                    <h5 className="text-base font-semibold text-gray-900">
                                      {item.name}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      Category: {item.category}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Product ID:{" "}
                                      {item.productId
                                        ?.slice(-6)
                                        .toUpperCase() || "N/A"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-6">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Quantity
                                    </p>
                                    <p className="text-base font-medium text-gray-900">
                                      {item.quantity}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Unit Price
                                    </p>
                                    <p className="text-base font-medium text-gray-900">
                                      {formatCurrency(item.unitPrice)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Total
                                    </p>
                                    <p className="text-base font-bold text-gray-900">
                                      {formatCurrency(item.totalPrice)}
                                    </p>
                                  </div>

                                  {hasSubDetails && (
                                    <button
                                      onClick={() => toggleItemExpansion(index)}
                                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
                                      title={`${
                                        isExpanded ? "Hide" : "Show"
                                      } item details`}
                                    >
                                      {isExpanded ? (
                                        <ChevronDown
                                          size={20}
                                          className="text-gray-500"
                                        />
                                      ) : (
                                        <ChevronRight
                                          size={20}
                                          className="text-gray-500"
                                        />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {hasSubDetails && !isExpanded && (
                                <div className="mt-3 flex items-center text-sm text-blue-600">
                                  <Info size={14} className="mr-1" />
                                  <span>
                                    Click to view additional specifications
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Expanded Sub-Details */}
                            {hasSubDetails && isExpanded && (
                              <div className="p-4 bg-gray-50">
                                <div className="flex items-center mb-3">
                                  <Info
                                    size={16}
                                    className="text-blue-600 mr-2"
                                  />
                                  <h6 className="text-sm font-semibold text-gray-700">
                                    Additional Specifications for "{item.name}"
                                  </h6>
                                </div>
                                {renderSubDetails(item.subDetails, item.name)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order-level Sub Details (if any) */}
                {selectedOrder.subDetails &&
                  Object.keys(selectedOrder.subDetails).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">
                        Order-Level Additional Information
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        {renderSubDetails(selectedOrder.subDetails, "Order")}
                      </div>
                    </div>
                  )}

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Update Status
                  </button>
                  <button className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors">
                    Export Details
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

export default VendorOrders;
