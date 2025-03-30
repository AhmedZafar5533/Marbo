import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ChevronDown, Search, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../Store/authStore';

// Lazy load the MegaMenu component
const MegaMenu = lazy(() => import('./MegaMenu'));

const DesktopNavbar = ({ menuItems, performSearch }) => {
    const [hoverItem, setHoverItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const timeoutRef = useRef(null);
    const profileTimeoutRef = useRef(null);
    const { authenticationState, sendLogoutRequest, user } = useAuthStore();

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        const results = performSearch(query);
        setSearchResults(results);
        setShowResults(query.trim() !== '');
    };

    // Handle search submission
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const results = performSearch(searchQuery);
        setSearchResults(results);
        setShowResults(searchQuery.trim() !== '');
    };

    // Handle click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close search results if clicking outside search area
            if (
                showResults &&
                !event.target.closest('.search-results') &&
                !event.target.closest('.search-container')
            ) {
                setShowResults(false);
            }

            // Close profile menu if clicking outside
            if (
                showProfileMenu &&
                !event.target.closest('.profile-menu') &&
                !event.target.closest('.profile-container')
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
        };
    }, [showResults, showProfileMenu]);

    const handleMouseEnter = (index) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHoverItem(index);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHoverItem(null);
        }, 200); // Delay for smoother transitions
    };

    // New function to close the mega menu immediately when an option is clicked
    const handleOptionClick = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHoverItem(null);
    };

    const handleProfileMouseEnter = () => {
        if (profileTimeoutRef.current) clearTimeout(profileTimeoutRef.current);
        setShowProfileMenu(true);
    };

    const handleProfileMouseLeave = () => {
        profileTimeoutRef.current = setTimeout(() => {
            setShowProfileMenu(false);
        }, 200); // Delay for smoother transitions
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-3 md:px-4 lg:px-3">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <div className="text-red-600 font-bold text-2xl tracking-tight">
                                <Link to="/">Marbo Global</Link>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="ml-12 flex space-x-10">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {item.submenu.length > 0 ? (
                                        <button className="inline-flex items-center px-3 py-2 text-base font-medium text-gray-800 hover:text-red-600 transition-colors duration-300">
                                            {item.title}
                                            <ChevronDown
                                                className="ml-1 h-4 w-4 transition-transform duration-400 ease-in-out"
                                                style={{
                                                    transform: hoverItem === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </button>
                                    ) : (
                                        <Link
                                            to={item.link}
                                            className="inline-flex items-center px-3 py-2 text-base font-medium text-gray-800 hover:text-red-600 transition-colors duration-300"
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section with Search and Authentication */}
                    <div className="flex items-center space-x-6">
                        {/* Search input */}
                        <div className="relative group search-container">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-48 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300 group-hover:w-64"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setShowResults(searchQuery.trim() !== '')}
                                    />
                                </div>
                            </form>

                            {/* Search Results */}
                            {showResults && (
                                <div className="absolute z-20 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 search-results">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2 max-h-96 overflow-y-auto">
                                            {searchResults.map((result, index) => (
                                                <Link
                                                    key={index}
                                                    to={result.link}
                                                    className="block px-4 py-3 hover:bg-red-50 transition-colors duration-200"
                                                    onClick={() => setShowResults(false)}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="flex-grow">
                                                            <div className="text-sm font-medium text-gray-900">{result.name}</div>
                                                            <div className="text-xs text-gray-500">{result.description}</div>
                                                        </div>
                                                        <div className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                            {result.category}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-6 text-center text-gray-500">
                                            <p>No results found for "{searchQuery}"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {!authenticationState ? (
                            <>
                                <Link to="/login">
                                    <button className="cursor-pointer px-5 py-2 text-sm font-medium text-gray-800 hover:text-red-600 transition-colors duration-300">
                                        Log in
                                    </button>
                                </Link>
                                <Link to="/redirect">
                                    <button className="cursor-pointer px-6 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                                        Sign up
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <div
                                className="relative profile-container"
                                onMouseEnter={handleProfileMouseEnter}
                                onMouseLeave={handleProfileMouseLeave}
                            >
                                <div
                                    className="rounded-full overflow-hidden border-2 border-white shadow-sm bg-red-600 cursor-pointer"
                                    style={{ width: 40, height: 40 }}
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=mp&s=200"
                                        alt="Profile"
                                        className="w-full h-full"
                                    />
                                </div>

                                {/* Profile Menu Tooltip */}
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu">
                                        <div className="py-1">
                                            <Link
                                                to={user.role === 'admin' ? '/admin' : '/dashboard/profile'}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
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
                        )}
                    </div>
                </div>
            </div>

            <Suspense fallback={null}>
                <MegaMenu
                    hoverItem={hoverItem}
                    menuItems={menuItems}
                    handleMouseLeave={handleMouseLeave}
                    timeoutRef={timeoutRef}
                    onOptionClick={handleOptionClick}
                />
            </Suspense>
        </>
    );
};

export default DesktopNavbar;
