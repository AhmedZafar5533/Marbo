// mockData.js
export const mockVendors = [
    {
        id: 1,
        name: "Tech Solutions Inc.",
        category: "Technology",
        status: "approved",
        date: "2025-01-15",
        revenue: 12500,
    },
    {
        id: 2,
        name: "Fresh Foods Co.",
        category: "Food & Beverage",
        status: "approved",
        date: "2025-01-18",
        revenue: 8750,
    },
    {
        id: 3,
        name: "Style Boutique",
        category: "Fashion",
        status: "approved",
        date: "2025-01-20",
        revenue: 9200,
    },
    {
        id: 4,
        name: "Fitness Gear",
        category: "Sports",
        status: "approved",
        date: "2025-01-22",
        revenue: 6500,
    },
    {
        id: 5,
        name: "Home Essentials",
        category: "Home Goods",
        status: "approved",
        date: "2025-01-25",
        revenue: 11000,
    },
];

export const pendingVendors = [
    {
        id: 6,
        name: "Organic Farms",
        category: "Food & Beverage",
        status: "pending",
        date: "2025-02-10",
        documents: 5,
    },
    {
        id: 7,
        name: "Digital Marketing Pro",
        category: "Services",
        status: "pending",
        date: "2025-02-12",
        documents: 3,
    },
    {
        id: 8,
        name: "Eco Products",
        category: "Home Goods",
        status: "pending",
        date: "2025-02-14",
        documents: 4,
    },
    {
        id: 9,
        name: "Gadget World",
        category: "Technology",
        status: "pending",
        date: "2025-02-16",
        documents: 6,
    },
    {
        id: 10,
        name: "Beauty Supplies",
        category: "Health & Beauty",
        status: "pending",
        date: "2025-02-18",
        documents: 4,
    },
    {
        id: 11,
        name: "Office Supplies Co.",
        category: "Office",
        status: "pending",
        date: "2025-02-20",
        documents: 2,
    },
    {
        id: 12,
        name: "Pet Paradise",
        category: "Pets",
        status: "pending",
        date: "2025-02-22",
        documents: 3,
    },
];

export const approvedVendors = [
    {
        id: 1,
        name: "Tech Solutions Inc.",
        category: "Technology",
        status: "active",
        joinDate: "2025-01-15",
        revenue: 12500,
    },
    {
        id: 2,
        name: "Fresh Foods Co.",
        category: "Food & Beverage",
        status: "active",
        joinDate: "2025-01-18",
        revenue: 8750,
    },
    {
        id: 3,
        name: "Style Boutique",
        category: "Fashion",
        status: "active",
        joinDate: "2025-01-20",
        revenue: 9200,
    },
    {
        id: 4,
        name: "Fitness Gear",
        category: "Sports",
        status: "inactive",
        joinDate: "2025-01-22",
        revenue: 6500,
    },
    {
        id: 5,
        name: "Home Essentials",
        category: "Home Goods",
        status: "active",
        joinDate: "2025-01-25",
        revenue: 11000,
    },
    {
        id: 11,
        name: "Office Supplies Co.",
        category: "Office",
        status: "active",
        joinDate: "2025-01-30",
        revenue: 7300,
    },
    {
        id: 12,
        name: "Pet Paradise",
        category: "Pets",
        status: "active",
        joinDate: "2025-02-01",
        revenue: 5600,
    },
];

export const revenueData = [
    { name: "Jan", value: 42000 },
    { name: "Feb", value: 53000 },
    { name: "Mar", value: 49000 },
    { name: "Apr", value: 58000 },
    { name: "May", value: 63000 },
    { name: "Jun", value: 72000 },
    { name: "Jul", value: 78000 },
    { name: "Aug", value: 82000 },
    { name: "Sep", value: 92000 },
    { name: "Oct", value: 85000 },
    { name: "Nov", value: 98000 },
    { name: "Dec", value: 107000 },
];

export const serviceData = [
    { name: "Premium", value: 35 },
    { name: "Standard", value: 45 },
    { name: "Basic", value: 20 },
];

export const categoryData = [
    { name: "Technology", value: 25 },
    { name: "Food & Beverage", value: 20 },
    { name: "Fashion", value: 15 },
    { name: "Home Goods", value: 12 },
    { name: "Services", value: 10 },
    { name: "Health & Beauty", value: 8 },
    { name: "Other", value: 10 },
];

export const recentActivities = [
    {
        id: 1,
        title: "New Vendor Registered",
        description: "Organic Farms has submitted application",
        time: "10 minutes ago",
        type: "new_vendor",
    },
    {
        id: 2,
        title: "Vendor Approved",
        description: "Tech Solutions Inc. has been approved",
        time: "1 hour ago",
        type: "approval",
    },
    {
        id: 3,
        title: "New Order Placed",
        description: "Order #45678 worth $350 from Fresh Foods Co.",
        time: "2 hours ago",
        type: "order",
    },
    {
        id: 4,
        title: "Payment Received",
        description: "Received $1,200 from Style Boutique",
        time: "5 hours ago",
        type: "payment",
    },
    {
        id: 5,
        title: "Customer Review",
        description: "New 5-star review for Fitness Gear",
        time: "1 day ago",
        type: "review",
    },
];

export const monthlyStats = [
    {
        name: "Current Month",
        vendors: 120,
        revenue: 92000,
        orders: 1450,
        growth: 8.5,
    },
    {
        name: "Previous Month",
        vendors: 105,
        revenue: 85000,
        orders: 1320,
        growth: 5.2,
    },
];

export const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
    "#6C63FF",
    "#F44336",
];
