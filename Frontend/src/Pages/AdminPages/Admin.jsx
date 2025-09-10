import { useState, useEffect, lazy, Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShoppingCart,
  CreditCard,
  Star,
  MessageSquare,
  LogOut,
  Users,
  Settings as SettingsIcon,
  Home,
  Briefcase,
} from "lucide-react";

import {
  revenueData,
  categoryData,
  recentActivities,
  monthlyStats,
  pendingVendors,
  approvedVendors,
  COLORS,
} from "../MochData";
import { useAuthStore } from "../../../Store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "../../components/LoadingSpinner";

const Dashboard = lazy(() =>
  import("../../components/Admin/DashboardOverview")
);

function AdminDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { redirectToOtp, loading, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from current URL path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/admin/listed-vendors")) return "vendors";
    if (path.includes("/admin/pending-vendors")) return "pending";
    if (path.includes("/admin/orders")) return "orders";
    if (path.includes("/admin/payments")) return "payments";
    if (path.includes("/admin/messages")) return "messages";
    if (path.includes("/admin/reviews")) return "reviews";
    if (path.includes("/admin/manage-services")) return "manage";

    return "dashboard";
  };

  const activeTab = getActiveTab();

  useEffect(() => {
    if (redirectToOtp) {
      toast.error("Please verify your account");
      navigate("/verify");
    }
  }, [redirectToOtp, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (!loading && user && user?.role !== "admin") {
      navigate("/");
    }
  }, [loading, user, navigate]);


  return (
    <>
      {!user?.role === "admin" ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-full h-full bg-black"></div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          {isMobileOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
          )}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeTab={activeTab}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobileOpen={isMobileOpen}
              setIsMobileOpen={setIsMobileOpen}
            />
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
              <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center px-4 py-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsMobileOpen(true)}
                      className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                    >
                      <Menu size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <span className="font-medium text-sm">AZ</span>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Ahmed Zafar
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Administrator
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
              {/* Main content area */}
              <main className="flex-1 overflow-auto p-6">
                {/* Render Dashboard component when at /admin, otherwise let routes handle it */}
                {location.pathname === "/admin" ? (
                  <Suspense fallback={<LoadingSpinner />}>
                    <Dashboard
                      monthlyStats={monthlyStats}
                      revenueData={revenueData}
                      recentActivities={recentActivities}
                      approvedVendors={approvedVendors}
                      categoryData={categoryData}
                      COLORS={COLORS}
                    />
                  </Suspense>
                ) : (
                  <div>
                    <Outlet />
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const Sidebar = ({
  activeTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { sendLogoutRequest } = useAuthStore();

  const primaryNavItems = [
    {
      id: "dashboard",
      icon: <Home size={20} />,
      label: "Dashboard",
      path: "/admin",
    },
    {
      id: "vendors",
      icon: <Users size={20} />,
      label: "Approved Vendors",
      path: "/admin/listed-vendors",
    },
    {
      id: "pending",
      icon: <Clock size={20} />,
      label: "Pending Vendors",
      path: "/admin/pending-vendors",
    },
    {
      id: "manage",
      icon: <Briefcase size={20} />,
      label: "Manage Services",
      path: "/admin/manage-services",
    },
  ];

  const secondaryNavItems = [
    {
      id: "orders",
      icon: <ShoppingCart size={20} />,
      label: "Orders",
      path: "/admin/orders",
    },
    {
      id: "payments",
      icon: <CreditCard size={20} />,
      label: "Payments",
      path: "/admin/payments",
    },
    {
      id: "reviews",
      icon: <Star size={20} />,
      label: "Reviews",
      path: "/admin/reviews",
    },
    {
      id: "messages",
      icon: <MessageSquare size={20} />,
      label: "Messages",
      path: "/admin/messages",
    },
   
  ];

  return (
    <aside
      className={`fixed lg:relative h-screen bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
      lg:translate-x-0 
      ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <Link to="/">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Marbo Global
            </h1>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      <nav className="p-3 space-y-1">
        <div className="mb-6 space-y-1">
          {primaryNavItems.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              activeTab={activeTab}
              isCollapsed={isCollapsed}
              onClick={() => setIsMobileOpen(false)}
            />
          ))}
        </div>
        {!isCollapsed && (
          <div className="border-t border-gray-200 dark:border-gray-700 py-2 mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">
              MANAGEMENT
            </p>
          </div>
        )}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              activeTab={activeTab}
              isCollapsed={isCollapsed}
              onClick={() => setIsMobileOpen(false)}
            />
          ))}
        </div>
      </nav>
      {!isCollapsed && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            className="mt-4 w-full flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 justify-center py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => sendLogoutRequest()}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

const NavItem = ({
  id,
  icon,
  label,
  path,
  activeTab,
  isCollapsed,
  onClick,
}) => (
  <Link
    to={path}
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors
      ${
        activeTab === id
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      }
      ${isCollapsed ? "justify-center" : ""}`}
    title={isCollapsed ? label : ""}
  >
    {icon}
    {!isCollapsed && <span className="font-medium">{label}</span>}
  </Link>
);

export default AdminDashboard;
