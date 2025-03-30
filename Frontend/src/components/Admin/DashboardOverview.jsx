
import {
    Users, DollarSign, ShoppingCart, TrendingUp,
    ArrowUp, ArrowDown, CheckCircle2, XCircle,
    Activity,
} from 'lucide-react';
import {


    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
    PieChart as RechartsPieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = ({
    monthlyStats,
    revenueData,
    recentActivities,
    approvedVendors,
    categoryData,
    COLORS
}) => {
    const activeVendors = approvedVendors.filter(vendor => vendor.status === 'active').length;
    const totalVendors = approvedVendors.length;
    const topVendors = [...approvedVendors]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }

        return null;
    };

    // Custom tooltip for pie chart
    const CustomPieTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium">{payload[0].name}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                        {payload[0].value}%
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Vendors"
                    value={totalVendors}
                    icon={<Users className="text-blue-600 dark:text-blue-400" />}
                    change={monthlyStats[0].vendors - monthlyStats[1].vendors}
                    changePercent={((monthlyStats[0].vendors - monthlyStats[1].vendors) / monthlyStats[1].vendors * 100).toFixed(1)}
                    changePeriod="vs. last month"
                />
                <StatCard
                    title="Active Vendors"
                    value={activeVendors}
                    icon={<CheckCircle2 className="text-green-600 dark:text-green-400" />}
                    change={activeVendors - (totalVendors - activeVendors)}
                    changePercent={((activeVendors / totalVendors) * 100).toFixed(1)}
                    changePeriod="active rate"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={formatCurrency(monthlyStats[0].revenue)}
                    icon={<DollarSign className="text-amber-600 dark:text-amber-400" />}
                    change={monthlyStats[0].revenue - monthlyStats[1].revenue}
                    changePercent={((monthlyStats[0].revenue - monthlyStats[1].revenue) / monthlyStats[1].revenue * 100).toFixed(1)}
                    changePeriod="vs. last month"
                    isCurrency={true}
                />
                <StatCard
                    title="Total Orders"
                    value={monthlyStats[0].orders}
                    icon={<ShoppingCart className="text-purple-600 dark:text-purple-400" />}
                    change={monthlyStats[0].orders - monthlyStats[1].orders}
                    changePercent={((monthlyStats[0].orders - monthlyStats[1].orders) / monthlyStats[1].orders * 100).toFixed(1)}
                    changePeriod="vs. last month"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Revenue Overview</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp size={18} className="text-green-500" />
                            <span>+{monthlyStats[0].growth}% growth</span>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={revenueData}
                                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" stroke="#a0a0a0" />
                                <YAxis stroke="#a0a0a0" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6, strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white md:p-6 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-auto p-6 pb-20">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Vendor Categories</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomPieTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </RechartsPieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Activities and Top Vendors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.slice(0, 4).map((activity) => (
                            <ActivityItem key={activity.id} activity={activity} />
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                        View All Activities
                    </button>
                </div>

                {/* Top Vendors */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">Top Vendors</h2>
                    <div className="space-y-4">
                        {topVendors.map((vendor) => (
                            <TopVendorItem key={vendor.id} vendor={vendor} formatCurrency={formatCurrency} />
                        ))}
                    </div>
                    <button className="mt-4 w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                        View All Vendors
                    </button>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ title, value, icon, change, changePercent, changePeriod, isCurrency }) => {
    const isPositive = change >= 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    {icon}
                </div>
            </div>
            <div className="mt-4 flex items-center">
                <div className={`flex items-center ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span className="text-sm font-medium ml-1">
                        {isPositive && '+'}{isCurrency ? new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }).format(change) : change} ({changePercent}%)
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{changePeriod}</span>
            </div>
        </div>
    );
};

// Activity Item Component
const ActivityItem = ({ activity }) => {
    // Get icon based on activity type
    const getIcon = (type) => {
        switch (type) {
            case 'new_vendor':
                return <Users size={16} />;
            case 'approval':
                return <CheckCircle2 size={16} />;
            case 'order':
                return <ShoppingCart size={16} />;
            case 'payment':
                return <DollarSign size={16} />;
            case 'review':
                return <Star size={16} />;
            default:
                return <Activity size={16} />;
        }
    };

    // Get color class based on activity type
    const getColorClass = (type) => {
        switch (type) {
            case 'new_vendor':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
            case 'approval':
                return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
            case 'order':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
            case 'payment':
                return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
            case 'review':
                return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-lg ${getColorClass(activity.type)}`}>
                {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.description}</p>
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {activity.time}
            </div>
        </div>
    );
};

// Top Vendor Item Component
const TopVendorItem = ({ vendor, formatCurrency }) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    {vendor.name.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{vendor.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{vendor.category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(vendor.revenue)}</p>
                <div className="flex items-center justify-end text-xs">
                    <span className={vendor.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {vendor.status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">
                        {vendor.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;