import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ChevronDown, Search, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../../Store/authStore';

// Lazy load the MegaMenu component
const MegaMenu = lazy(() => import('./MegaMenu'));

const DesktopNavbar = ({ menuItems, performSearch, isScrolled }) => {
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

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showResults &&
                !event.target.closest('.search-results') &&
                !event.target.closest('.search-container')
            ) {
                setShowResults(false);
            }
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
        }, 200);
    };

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
        }, 200);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 sm:px-3 md:px-4 lg:px-3">
                <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a
                                href="/"
                                aria-label="Go to homepage"
                                className="flex items-center space-x-3 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 group"
                            >
                                {/* Logo icon */}
                                <div
                                    className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110"
                                >
                                    <span className="text-white font-extrabold text-2xl">M</span>
                                    {/* subtle ring on hover */}
                                    <span className="absolute inset-0 rounded-full ring-2 ring-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                </div>

                                {/* Brand name */}
                                <span className="text-2xl font-extrabold text-gray-900 transition-colors group-hover:text-red-600">
                                    Marbo Global
                                </span>
                            </a>
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
                                        <button
                                            className={`inline-flex items-center px-3 py-2 transition-all duration-300 ${isScrolled ? 'text-sm' : 'text-base'} font-medium text-gray-800 hover:text-red-600`}
                                            aria-haspopup="true"
                                            aria-expanded={hoverItem === index}
                                        >
                                            {item.title}
                                            <ChevronDown
                                                className={`ml-1 transition-transform duration-400 ease-in-out ${isScrolled ? 'h-3.5 w-3.5' : 'h-4 w-4'}`}
                                                style={{
                                                    transform: hoverItem === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </button>
                                    ) : (
                                        <a
                                            href={item.link}
                                            className={`inline-flex items-center px-3 py-2 transition-all duration-300 ${isScrolled ? 'text-sm' : 'text-base'} font-medium text-gray-800 hover:text-red-600`}
                                        >
                                            {item.title}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-6">
                        {/* Search */}
                        <div className="relative group search-container">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4' : 'h-5 w-5'} text-gray-400 group-hover:text-red-500`} />
                                    </div>
                                    <input
                                        type="text"
                                        className={`block transition-all duration-300 ${isScrolled ? 'w-44 text-xs py-1.5' : 'w-48 text-sm py-2'} pl-10 pr-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 group-hover:w-64`}
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setShowResults(searchQuery.trim() !== '')}
                                        aria-label="Search"
                                    />
                                </div>
                            </form>
                            {showResults && (
                                <div className="absolute z-20 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 search-results">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2 max-h-96 overflow-y-auto">
                                            {searchResults.map((result, idx) => (
                                                <a
                                                    key={idx}
                                                    href={result.link}
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
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-4 py-6 text-center text-gray-500">
                                            No results found for “{searchQuery}”
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Auth Buttons / Profile */}
                        {!authenticationState ? (
                            <>
                                <a
                                    href="/login"
                                    className={`cursor-pointer transition-all duration-300 ${isScrolled ? 'px-4 py-1.5 text-xs' : 'px-5 py-2 text-sm'} font-medium text-gray-800 hover:text-red-600`}
                                >
                                    Log in
                                </a>
                                <a
                                    href="/redirect"
                                    className={`cursor-pointer transition-all duration-300 ${isScrolled ? 'px-5 py-1.5 text-xs' : 'px-6 py-2 text-sm'} font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                                >
                                    Sign up
                                </a>
                            </>
                        ) : (
                            <div
                                className="relative profile-container"
                                onMouseEnter={handleProfileMouseEnter}
                                onMouseLeave={handleProfileMouseLeave}
                            >
                                <div
                                    className="rounded-full overflow-hidden border-2 border-white shadow-sm bg-red-600 cursor-pointer"
                                    style={{ width: isScrolled ? 32 : 40, height: isScrolled ? 32 : 40 }}
                                    aria-haspopup="true"
                                    aria-expanded={showProfileMenu}
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=mp&s=200"
                                        alt={`${user.name || 'User'}’s profile`}
                                        className="w-full h-full"
                                    />
                                </div>
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu">
                                        <div className="py-1">
                                            <a
                                                href={user.role === 'admin' ? '/admin' : `/dashboard/${user.role}/profile`}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-red-50"
                                            >
                                                <User size={16} className="mr-2 text-red-600" />
                                                Dashboard
                                            </a>
                                            <button
                                                className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50"
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
                    isScrolled={isScrolled}
                />
            </Suspense>
        </>
    );
};

export default DesktopNavbar;
