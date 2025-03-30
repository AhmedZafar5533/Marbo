import React, { useState } from 'react';
import { Menu, X, User, Briefcase, LogOut, CreditCard } from 'lucide-react';
import { useAuthStore } from '../../Store/authStore';

const VendorSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { sendLogoutRequest } = useAuthStore()

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const navItems = [
        { name: 'Profile', icon: <User size={20} />, path: '/dashboard/profile' },
        { name: 'Services', icon: <Briefcase size={20} />, path: '/dashboard/vendor/services' },
        { name: 'Subscriptions', icon: <CreditCard size={20} />, path: '/dashboard/subscriptions/vendor' },
    ];

    return (
        <div className="flex">
            {/* Sidebar with same behavior on all screen sizes */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-indigo-700">Vendor Portal</h2>
                    <button
                        onClick={toggleSidebar}
                        className="p-1 hover:bg-gray-100 rounded-md focus:outline-none"
                    >
                        <X size={24} className="text-indigo-700" />
                    </button>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <a
                                    href={item.path}
                                    className="flex items-center p-3 rounded-md text-indigo-700 hover:bg-indigo-50 transition-colors duration-200"
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="absolute bottom-0 left-0 w-full p-4 border-t">
                    <button className="flex items-center w-full p-3 rounded-md text-indigo-700 hover:bg-indigo-50 transition-colors duration-200"
                        onClick={() => sendLogoutRequest()}>
                        <span className="mr-3">
                            <LogOut size={20} />
                        </span>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Hamburger menu button - always visible when sidebar is closed */}
            {!isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md hover:bg-gray-100 focus:outline-none "
                >
                    <Menu size={24} className="text-indigo-700" />
                </button>
            )}

            {/* Overlay - grayish transparent */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-500/50 z-30"
                    onClick={toggleSidebar}
                />
            )}


        </div>
    );
};

export default VendorSidebar;
