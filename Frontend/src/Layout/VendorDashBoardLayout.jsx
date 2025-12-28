import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  X,
  Menu,
  Briefcase,
  CreditCard,
  Package,
  Warehouse,
  Users,
  Star,
  MapPin,
} from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import { FaOilCan } from "react-icons/fa";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { sendLogoutRequest: handleLogout } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendLogoutRequest = async () => {
    handleLogout();
    navigate("/", { replace: true });
  };

  const navItems = [
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/dashboard/vendor/profile",
    },
    {
      name: "Services",
      icon: <Briefcase size={20} />,
      path: "/dashboard/vendor/services",
    },
    {
      name: "Reviews",
      icon: <Star size={20} />,
      path: "/dashboard/vendor/reviews",
    },
    {
      name: "Orders",
      icon: <Package size={20} />,
      path: "/dashboard/vendor/orders",
    },
    {
      name: "Manage Staff",
      icon: <Users size={20} />,
      path: "/dashboard/vendor/domestic-staffing-management",
    },
    {
      name: "Manage Hotel",
      icon: <Users size={20} />,
      path: "/dashboard/vendor/hotel-managment",
    },
    {
      name: "Manage Offers",
      icon: <FaOilCan size={20} />,
      path: "/dashboard/vendor/manage/oil",
    },
    {
      name: "Manage Holiday Spots",
      icon: <Users size={20} />,
      path: "/dashboard/vendor/manage/holiday-lets",
    },
    {
      name: "Manage Tours ",
      icon: <MapPin size={20} />,
      path: "/dashboard/vendor/tour-management",
    },
    {
      name: "Add Tours",
      icon: <Users size={20} />,
      path: "/dashboard/vendor/add/tours",
    },
    {
      name: "Manage Medical Staff",
      icon: <Users size={20} />,
      path: "/dashboard/vendor/manage/medical-staff",
    },
    {
      name: "Inventory",
      icon: <Warehouse size={20} />,
      path: "/dashboard/vendor/inventory",
    },
    {
      name: "Tech Inventory",
      icon: <Warehouse size={20} />,
      path: "/dashboard/vendor/add/tech-products",
    },
    {
      name: "Clothes Inventory",
      icon: <Warehouse size={20} />,
      path: "/dashboard/vendor/manage/clothes",
    },
    {
      name: "Subscriptions",
      icon: <CreditCard size={20} />,
      path: "/dashboard/subscriptions/vendor",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 fixed md:static top-0 bottom-0 left-0 z-30 flex flex-col
              ${isSidebarOpen ? "w-64" : "w-20"}
              ${
                isSidebarOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              }
              h-screen overflow-y-auto`}
      >
        <div
          className={`flex items-center px-4 py-6 ${
            !isSidebarOpen && "justify-center"
          }`}
        >
          <Link to="/" className="flex items-center gap-3">
            <div className="h-8 w-8 bg-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-semibold text-gray-800">
                Triple Portion
              </span>
            )}
          </Link>
        </div>

        <nav className="mt-6 px-3 flex-1 flex flex-col">
          <ul className="space-y-1 flex-1">
            {navItems.map((item, index) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-3 rounded-lg transition-colors relative
                      ${
                        isActive
                          ? "bg-blue-100 text-indigo-600 font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <span className="inline-flex">{item.icon}</span>
                    {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              );
            })}

            {/* Logout button now behaves like other nav items */}
            <li>
              <button
                onClick={sendLogoutRequest}
                className="w-full flex items-center px-3 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
              >
                <LogOut size={20} />
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>

        <button
          className="md:hidden absolute top-4 right-4 text-gray-500"
          onClick={toggleSidebar}
        >
          <X size={20} />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center text-gray-500 text-sm">
                <span className="font-medium text-gray-800">Dashboard</span>
                <span className="mx-2">/</span>
                <span>{location.pathname.split("/").pop()}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                JD
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900/50 bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;
