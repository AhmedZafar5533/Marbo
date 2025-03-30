import { useState, lazy, useEffect } from 'react';
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

  Home
} from 'lucide-react';

const Dashboard = lazy(() => import('../components/Admin/DashboardOverview'));
const ListedVendors = lazy(() => import('../components/Admin/RegisteredVendors'));
const PendingVendors = lazy(() => import('../components/Admin/PendingVendors'));
const Orders = lazy(() => import('../components/Admin/Oredrs'));
const Payments = lazy(() => import('../components/Admin/Payments'));
const Messages = lazy(() => import('../components/Admin/Messages'));
const Reviews = lazy(() => import('../components/Admin/Reviews'));



import {
  revenueData,
  categoryData,
  recentActivities,
  monthlyStats,
  pendingVendors,
  approvedVendors,
  COLORS
} from '../Pages/MochData';
import { useAuthStore } from '../../Store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';


function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { redirectToOtp, loading, user } = useAuthStore();
  const navigate = useNavigate()


  useEffect(() => {
    if (redirectToOtp) {
      toast.error('Please verify your account')
      navigate('/verify')
    }
  }, [redirectToOtp, navigate])

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    } else if (!loading && user && user.role !== 'admin') {
      navigate('/')
    }
  }, [loading, user, navigate])

  if (loading)
    return <LoadingSpinner />

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            monthlyStats={monthlyStats}
            revenueData={revenueData}
            recentActivities={recentActivities}
            approvedVendors={approvedVendors}
            categoryData={categoryData}
            COLORS={COLORS}
          />
        );
      case 'vendors':
        return <ListedVendors approvedVendors={approvedVendors} />;
      case 'pending':
        return <PendingVendors pendingVendors={pendingVendors} />;
      case 'orders':
        return <Orders />;
      case 'payments':
        return <Payments />;
      case 'messages':
        return <Messages />;
      case 'reviews':
        return <Reviews />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <Dashboard
            monthlyStats={monthlyStats}
            revenueData={revenueData}
            recentActivities={recentActivities}
            approvedVendors={approvedVendors}
            categoryData={categoryData}
            COLORS={COLORS}
          />
        );
    }
  };

  return (
    <>
      {!user.role === 'admin' ? (
        <div className="flex items-center justify-center h-screen">
          <div className='w-full h-full bg-black'></div>
        </div>
      ) : (<div className="h-screen flex flex-col">
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
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
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Ahmed Zafar</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                    </div>

                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              {renderActiveComponent()}
            </main>

          </div>
        </div>
      </div>)}
    </>

  );
}
/* eslint-disable react/prop-types */

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const { sendLogoutRequest } = useAuthStore()
  const primaryNavItems = [
    { id: 'dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'vendors', icon: <Users size={20} />, label: 'Approved Vendors' },
    { id: 'pending', icon: <Clock size={20} />, label: 'Pending Vendors' },
  ];
  const secondaryNavItems = [
    { id: 'orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { id: 'payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { id: 'reviews', icon: <Star size={20} />, label: 'Reviews' },
    { id: 'messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    { id: 'settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
  ];
  return (
    <aside className={`fixed lg:relative h-screen bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-20 
      ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
      lg:translate-x-0 
      ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!isCollapsed && <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</h1>}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-500 dark:text-gray-400"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
              setActiveTab={setActiveTab}
              isCollapsed={isCollapsed}
              onClick={() => setIsMobileOpen(false)}


            />
          ))}
        </div>
        {!isCollapsed && (
          <div className="border-t border-gray-200 dark:border-gray-700 py-2 mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2">MANAGEMENT</p>
          </div>
        )}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.id}
              {...item}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCollapsed={isCollapsed}
              onClick={() => setIsMobileOpen(false)}

            />
          ))}
        </div>
      </nav>
      {!isCollapsed && (
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">

          <button className="mt-4 w-full flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 justify-center py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => sendLogoutRequest}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};

const NavItem = ({ id, icon, label, activeTab, setActiveTab, isCollapsed, onClick }) => (
  <button
    onClick={() => {
      setActiveTab(id);
      if (onClick) onClick();
    }}
    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors
      ${activeTab === id
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}
      ${isCollapsed ? 'justify-center' : ''}`}
    title={isCollapsed ? label : ''}
  >
    {icon}
    {!isCollapsed && <span className="font-medium">{label}</span>}
  </button>
);



const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Display Settings</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100">Dark Mode</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme</p>
          </div>
          <div className="flex items-center">

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
