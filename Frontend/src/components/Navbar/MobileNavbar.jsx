import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, ArrowRight, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../Store/authStore';

const MobileNavbar = ({ menuItems, performSearch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const searchInputRef = useRef(null);
    const isOpenRef = useRef(isOpen);
    const isSearchOpenRef = useRef(isSearchOpen);
    const profileMenuRef = useRef(null);

    const { authenticationState: isLoggedIn, sendLogoutRequest, user } = useAuthStore();

    // Update refs when state changes
    useEffect(() => {
        isOpenRef.current = isOpen;
        isSearchOpenRef.current = isSearchOpen;
    }, [isOpen, isSearchOpen]);

    // Handle click outside to close dropdowns and profile menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && event.target.closest('.mobile-menu') === null) {
                setIsOpen(false);
            }

            // Close profile menu when clicking outside
            if (showProfileMenu &&
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target) &&
                !event.target.closest('.profile-trigger')) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, showProfileMenu]);

    // Focus search input when search overlay opens
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setIsSearchOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) setIsOpen(false);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const toggleDropdown = (index) => {
        if (activeDropdown === index) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(index);
        }
    };

    // New function to close mobile menu
    const closeMenu = () => {
        setIsOpen(false);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const results = performSearch(query);
        setSearchResults(results);
    };

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        performSearch(searchQuery);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-3 md:px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        {/* Mobile/Tablet hamburger menu button */}
                        <div className="flex mr-4">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-red-600 hover:text-red-500 hover:bg-red-100 focus:outline-none transition-colors duration-300"
                                aria-label="Main menu"
                            >
                                <Menu className="block h-6 w-6" />
                            </button>
                        </div>

                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="text-red-600 font-bold text-xl md:text-2xl tracking-tight">
                                <Link to="/" onClick={closeMenu}>Marbo Global</Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile/Tablet Right Section */}
                    <div className="flex items-center">
                        <button
                            onClick={toggleSearch}
                            className="p-2 rounded-md text-red-600 hover:text-red-500 hover:bg-red-100 transition-colors duration-300"
                            aria-label="Search"
                        >
                            <Search className="h-6 w-6" />
                        </button>

                        {isLoggedIn ? (
                            <div className="ml-4 relative">
                                {/* Profile Picture trigger */}
                                <button
                                    onClick={toggleProfileMenu}
                                    className="profile-trigger h-10 w-10 rounded-full bg-red-100 border-2 border-red-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500"
                                    aria-label="User profile"
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=mp&s=200"
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </button>

                                {/* Profile Menu Dropdown */}
                                {showProfileMenu && (
                                    <div
                                        ref={profileMenuRef}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu"
                                    >
                                        <div className="py-1">
                                            <Link
                                                to={user.role === 'admin' ? '/admin' : '/dashboard/profile'}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                <User size={16} className="mr-2 text-red-600" />
                                                <span>Dashboard</span>
                                            </Link>
                                            <button
                                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
                                                onClick={() => {
                                                    sendLogoutRequest();
                                                    setShowProfileMenu(false);
                                                }}
                                            >
                                                <LogOut size={16} className="mr-2 text-red-600" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/redirect" onClick={closeMenu}>
                                <button className="cursor-pointer ml-4 px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors duration-300">
                                    Sign up
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white shadow-xl rounded-b-2xl">
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="pt-6 pb-4">
                                <form onSubmit={handleSearchSubmit} className="search-container">
                                    <div className="flex items-center">
                                        <div className="flex-grow">
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Search className="h-5 w-5 text-red-500" />
                                                </div>
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    className="block w-full pl-12 pr-10 py-3 border-2 border-red-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                    placeholder="What are you looking for?"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    onClick={toggleSearch}
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                >
                                                    <X className="h-6 w-6 text-gray-500 hover:text-red-700" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Mobile Search Results */}
                            {searchQuery.trim() !== '' && (
                                <div className="pb-6 search-results">
                                    <div className="px-2 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {searchResults.length} Results
                                    </div>

                                    {searchResults.length > 0 ? (
                                        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                            {searchResults.map((result, index) => (
                                                <Link
                                                    key={index}
                                                    to={result.link}
                                                    className="flex items-start p-4 hover:bg-red-50 transition-colors duration-200"
                                                    onClick={() => {
                                                        setIsSearchOpen(false);
                                                    }}
                                                >
                                                    <div className="flex-grow">
                                                        <div className="text-base font-medium text-gray-900">{result.name}</div>
                                                        <div className="text-sm text-gray-500">{result.description}</div>
                                                        <div className="mt-1 inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                                            {result.category}
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-red-500 ml-2 mt-2" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <p className="text-gray-500">No results found for "{searchQuery}"</p>
                                            <p className="mt-1 text-sm text-gray-400">Try using different keywords or check spelling</p>
                                        </div>
                                    )}

                                    {searchResults.length > 0 && (
                                        <div className="px-4 py-3 mt-3 border-t border-gray-200">
                                            <Link
                                                to={`/search?q=${encodeURIComponent(searchQuery)}`}
                                                className="flex items-center justify-center text-red-600 font-medium"
                                                onClick={() => setIsSearchOpen(false)}
                                            >
                                                See all results
                                                <ArrowRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile/Tablet Menu Slide-in */}
            <div
                className="fixed inset-0 z-40 bg-black transition-opacity duration-400 ease-in-out"
                style={{
                    opacity: isOpen ? 0.6 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                }}
                onClick={toggleMenu}
            ></div>

            <div
                className="fixed inset-y-0 left-0 z-50 w-full max-w-sm h-full bg-white shadow-xl transition-transform duration-400 ease-in-out transform mobile-menu"
                style={{
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <div className="text-red-600 font-bold text-2xl tracking-tight">Marbo Global</div>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-full text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors duration-300"
                    >
                        <X className="block h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto h-full pb-20">
                    <nav className="pt-5 pb-3 px-2">
                        {menuItems.map((item, index) => (
                            <div key={index} className="mb-2">
                                {item.submenu.length > 0 ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className="w-full flex justify-between items-center px-4 py-3.5 text-base font-medium text-gray-800 hover:bg-red-50 rounded-xl transition-colors duration-300"
                                        >
                                            {item.title}
                                            <ChevronDown
                                                className={`ml-1 h-5 w-5 transition-transform duration-400 ease-in-out ${activeDropdown === index ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        <div
                                            className="overflow-hidden transition-all duration-400 ease-in-out px-2"
                                            style={{
                                                maxHeight: activeDropdown === index ? `${item.submenu.length * 100 + 60}px` : '0px',
                                                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        >
                                            <div className="py-2 space-y-1 pl-2 mt-1 rounded-xl">
                                                {item.submenu.map((subItem, subIndex) => (
                                                    <Link
                                                        key={subIndex}
                                                        to={subItem.link || '#'}
                                                        className="flex items-start px-4 py-3 text-base text-gray-700 hover:bg-red-50 rounded-xl transition-colors duration-300"
                                                        onClick={closeMenu}
                                                    >
                                                        <div>
                                                            <div className="font-medium">{subItem.name}</div>
                                                            <div className="text-sm text-gray-500">{subItem.description}</div>
                                                        </div>
                                                    </Link>
                                                ))}
                                                {item.submenu.length > 0 && (
                                                    <div className="pt-3 pb-1 pl-4">
                                                        <Link
                                                            to={item.link || '#'}
                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                            onClick={closeMenu}
                                                        >
                                                            Browse more
                                                            <ArrowRight className="ml-1 h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={item.link}
                                        className="block px-4 py-3.5 text-base font-medium text-gray-800 hover:bg-red-50 rounded-xl transition-colors duration-300"
                                        onClick={closeMenu}
                                    >
                                        {item.title}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="px-6 pt-6 pb-8 border-t border-gray-200">
                        <div className="space-y-4">
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/login" onClick={closeMenu}>
                                        <button className="mb-2 cursor-pointer w-full px-4 py-3 text-center text-sm font-medium text-gray-700 hover:text-red-600 border border-gray-300 rounded-xl hover:border-red-400 transition-colors duration-300">
                                            Login
                                        </button>
                                    </Link>
                                    <Link to="/redirect" onClick={closeMenu}>
                                        <button className="w-full px-4 py-3 text-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                            Sign up
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <button
                                    className="w-full px-4 py-3 text-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                    onClick={() => {
                                        sendLogoutRequest();
                                        setShowProfileMenu(false);
                                        closeMenu();
                                    }}
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileNavbar;
