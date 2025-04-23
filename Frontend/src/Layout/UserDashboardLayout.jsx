import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    Menu,
    X,
    User,
    LogOut,
    Package
} from 'lucide-react';
import { useAuthStore } from '../../Store/authStore';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { sendLogoutRequest } = useAuthStore();
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
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navItems = [
        { name: 'Profile', icon: <User size={20} />, path: '/dashboard/customer/profile' },
        { name: 'Orders', icon: <Package size={20} />, path: '/dashboard/customer/orders' },
        
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-gray-200 transition-all duration-300 fixed md:static top-0 bottom-0 left-0 z-30 flex flex-col
                    ${isSidebarOpen ? 'w-64' : 'w-20'}
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className={`flex items-center px-4 py-6 border-b border-gray-200 ${!isSidebarOpen && 'justify-center'}`}>
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">M</span>
                        </div>
                        {isSidebarOpen && <span className="text-xl font-semibold text-gray-800">Marbo Global</span>}
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
                                            ${item.className || ''}
                                            ${isActive
                                                ? 'bg-blue-100 text-blue-700 font-semibold'
                                                : 'text-gray-600 hover:bg-gray-100'}`}
                                    >
                                        <span className="inline-flex">{item.icon}</span>
                                        {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {isSidebarOpen && (
                        <div className="mt-auto mb-6 px-3">
                            <button
                                onClick={() => sendLogoutRequest()}
                                className="flex cursor-pointer items-center px-3 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={20} />
                                <span className="ml-3">Logout</span>
                            </button>
                        </div>
                    )}
                </nav>

                <button className="md:hidden absolute top-4 right-4 text-gray-500" onClick={toggleSidebar}>
                    <X size={20} />
                </button>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center gap-4">
                            <button className="text-gray-600 hover:text-gray-900" onClick={toggleSidebar}>
                                <Menu size={24} />
                            </button>
                            <div className="hidden md:flex items-center text-gray-500 text-sm">
                                <span className="font-medium text-gray-800">Dashboard</span>
                                <span className="mx-2">/</span>
                                <span>{location.pathname.split('/').pop()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard/profile" className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                    JD
                                </div>
                            </Link>
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
                    className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
