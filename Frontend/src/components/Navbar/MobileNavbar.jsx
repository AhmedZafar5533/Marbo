import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, ArrowRight, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../Store/authStore';

const MobileNavbar = ({ menuItems, performSearch, isScrolled }) => {
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
                <div
                    className={`flex justify-between  items-center transition-all duration-300 ${isScrolled ? 'h-20' : 'h-22'
                        }`}
                >
                    <div className="flex items-center">
                        {/* Hamburger */}
                        <div className="mr-4">
                            <button
                                onClick={toggleMenu}
                                className={`inline-flex items-center justify-center rounded-md text-red-600 hover:text-red-500 hover:bg-red-100 focus:outline-none transition-all duration-300 ${isScrolled ? 'p-2' : 'p-2.5'
                                    }`}
                                aria-label="Main menu"
                            >
                                <Menu
                                    className={`block transition-all duration-300 ${isScrolled ? 'h-7 w-7' : 'h-8 w-8'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a
                                href="/"
                                aria-label="Go to homepage"
                                className="p-5 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 group"
                            >
                                <div
                                    className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110"
                                >
                                    <span className="text-white font-extrabold text-2xl">T</span>
                                    <span className="absolute inset-0 rounded-full ring-2 ring-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                </div>
                            </a>
                        </div>

                    </div>

                    {/* Search & Auth */}
                    <div className="flex items-center">
                        <button
                            onClick={toggleSearch}
                            className={`rounded-md text-red-600 hover:text-red-500 hover:bg-red-100 transition-all duration-300 ${isScrolled ? 'p-1.5' : 'p-2'
                                }`}
                            aria-label="Search"
                        >
                            <Search
                                className={`transition-all duration-300 ${isScrolled ? 'h-7 w-7' : 'h-8 w-8'
                                    }`}
                            />
                        </button>

                        {isLoggedIn ? (
                            <div className="ml-4 relative">
                                <button
                                    onClick={toggleProfileMenu}
                                    className={`rounded-full bg-red-100 border-2 border-red-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${isScrolled ? 'h-9 w-9' : 'h-11 w-11'
                                        }`}
                                    aria-label="User profile"
                                    aria-haspopup="true"
                                    aria-expanded={showProfileMenu}
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=mp&s=200"
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </button>

                                {showProfileMenu && (
                                    <div
                                        ref={profileMenuRef}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu"
                                    >
                                        <div className="py-1">
                                            <a
                                                href={user?.role === 'admin' ? '/admin' : `/dashboard/${user?.role}/profile`}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
                                                onClick={() => setShowProfileMenu(false)}
                                            >
                                                <User size={16} className="mr-2 text-red-600" />
                                                Dashboard
                                            </a>
                                            <button
                                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
                                                onClick={() => {
                                                    sendLogoutRequest();
                                                    setShowProfileMenu(false);
                                                }}
                                            >
                                                <LogOut size={16} className="mr-2 text-red-600" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/signup" onClick={closeMenu}>
                                <button
                                    className={`ml-4 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all duration-300 ${isScrolled ? 'px-4 py-1.5 text-sm' : 'px-5 py-2 text-base'
                                        }`}
                                >
                                    Sign up
                                </button>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white shadow-xl rounded-b-2xl">
                        <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
                            <form onSubmit={handleSearchSubmit} className="search-container flex items-center">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-red-500" />
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        className="w-full pl-12 pr-10 py-3 border-2 border-red-300 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                            </form>
                        </div>

                        {/* Results */}
                        {searchQuery.trim() !== '' && (
                            <div className="px-2 pb-6">
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                    {searchResults.length} Results
                                </div>

                                {searchResults.length > 0 ? (
                                    <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                                        {searchResults.map((result, idx) => (
                                            <a
                                                key={idx}
                                                href={result.link}
                                                className="flex items-start p-4 hover:bg-red-50 transition-colors duration-200"
                                                onClick={() => setIsSearchOpen(false)}
                                            >
                                                <div className="flex-grow">
                                                    <div className="text-base font-medium text-gray-900">{result.name}</div>
                                                    <div className="text-sm text-gray-500">{result.description}</div>
                                                    <div className="mt-1 inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                                        {result.category}
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-red-500 ml-2 mt-2" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-4 py-8 text-center">
                                        <p className="text-gray-500">No results found for "{searchQuery}"</p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            Try different keywords or check spelling
                                        </p>
                                    </div>
                                )}

                                {searchResults.length > 0 && (
                                    <div className="px-4 py-3 mt-3 border-t border-gray-200 text-center">
                                        <a
                                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                                            className="inline-flex items-center text-red-600 font-medium"
                                            onClick={() => setIsSearchOpen(false)}
                                        >
                                            See all results&nbsp;
                                            <ArrowRight className="h-4 w-4" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Menu Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black transition-opacity duration-400 ease-in-out"
                style={{
                    opacity: isOpen ? 0.6 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                }}
                onClick={toggleMenu}
            />

            {/* Slide-in Menu */}
            <div
                className="fixed inset-y-0 left-0 z-50 w-full max-w-sm h-full bg-white shadow-xl transition-transform duration-400 ease-in-out transform mobile-menu"
                style={{
                    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <div className="text-red-600 font-bold text-2xl tracking-tight">
                        Marbo Global
                    </div>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-full text-gray-700 hover:text-red-600 hover:bg-gray-100 transition-colors duration-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto h-full pb-20">
                    <nav className="pt-5 pb-3 px-2">
                        {menuItems.map((item, idx) => (
                            <div key={idx} className="mb-2">
                                {item.submenu.length > 0 ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(idx)}
                                            className="w-full flex justify-between items-center px-4 py-3.5 text-base font-medium text-gray-800 hover:bg-red-50 rounded-xl transition-colors duration-300"
                                        >
                                            {item.title}
                                            <ChevronDown
                                                className={`ml-1 h-5 w-5 transition-transform duration-400 ease-in-out ${activeDropdown === idx ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        <div
                                            className="overflow-hidden transition-all duration-400 ease-in-out px-2"
                                            style={{
                                                maxHeight:
                                                    activeDropdown === idx
                                                        ? `${item.submenu.length * 100 + 60}px`
                                                        : '0px',
                                                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        >
                                            <div className="py-2 space-y-1 pl-2 mt-1 rounded-xl">
                                                {item.submenu.map((sub, sIdx) => (
                                                    <a
                                                        key={sIdx}
                                                        href={sub.link || '#'}
                                                        className="flex items-start px-4 py-3 text-base text-gray-700 hover:bg-red-50 rounded-xl transition-colors duration-300"
                                                        onClick={closeMenu}
                                                    >
                                                        <div>
                                                            <div className="font-medium">{sub.name}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {sub.description}
                                                            </div>
                                                        </div>
                                                    </a>
                                                ))}
                                                <div className="pt-3 pb-1 pl-4">
                                                    <a
                                                        href={item.link || '#'}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                                        onClick={closeMenu}
                                                    >
                                                        Browse more&nbsp;
                                                        <ArrowRight className="ml-1 h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <a
                                        href={item.link}
                                        className="block px-4 py-3.5 text-base font-medium text-gray-800 hover:bg-red-50 rounded-xl transition-colors duration-300"
                                        onClick={closeMenu}
                                    >
                                        {item.title}
                                    </a>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="px-6 pt-6 pb-8 border-t border-gray-200">
                        {!isLoggedIn ? (
                            <>
                                <a href="/login" onClick={closeMenu}>
                                    <button className="mb-2 w-full px-4 py-3 text-center text-sm font-medium text-gray-700 hover:text-red-600 border border-gray-300 rounded-xl transition-colors duration-300">
                                        Login
                                    </button>
                                </a>
                                <a href="/redirect" onClick={closeMenu}>
                                    <button className="w-full px-4 py-3 text-center text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                        Sign up
                                    </button>
                                </a>
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
        </>
    );
};

export default MobileNavbar;