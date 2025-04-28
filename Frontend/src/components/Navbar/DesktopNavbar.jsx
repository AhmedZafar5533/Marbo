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
            {/* Primary Navigation Container - Responsive width control */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16 md:h-18 lg:h-20' : 'h-18 md:h-20 lg:h-22'}`}>
                    <div className="flex items-center">
                        {/* Logo - Becomes smaller on smaller screens */}
                        <div className="flex-shrink-0">
                            <a
                                href="/"
                                aria-label="Go to homepage"
                                className="flex items-center space-x-2 md:space-x-3 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 group"
                            >
                                {/* Logo icon - Responsive sizing */}
                                <div
                                    className="relative h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110"
                                >
                                    <span className="text-white font-extrabold text-lg md:text-xl lg:text-2xl">M</span>
                                    <span className="absolute inset-0 rounded-full ring-2 ring-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                                </div>

                                {/* Brand name - Responsive text and hidden on smaller screens */}
                                <span className={`hidden sm:block ${isScrolled ? 'text-xl md:text-2xl' : 'text-xl md:text-2xl lg:text-[1.7rem]'} transition-all duration-300 font-extrabold text-gray-900 group-hover:text-red-600`}>
                                    Marbo Global
                                </span>
                            </a>
                        </div>

                        {/* Desktop Navigation - Adjusts spacing and font size responsively */}
                        <div className="hidden md:flex ml-4 lg:ml-8 xl:ml-12 space-x-2 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10">
                            {menuItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {item.submenu.length > 0 ? (
                                        <button
                                            className={`inline-flex items-center px-1 sm:px-2 md:px-3 py-2 transition-all duration-300 text-sm lg:text-base ${isScrolled ? 'text-sm md:text-base' : 'text-sm md:text-base lg:text-lg'} font-medium text-gray-800 hover:text-red-600`}
                                            aria-haspopup="true"
                                            aria-expanded={hoverItem === index}
                                        >
                                            {item.title}
                                            <ChevronDown
                                                className={`ml-1 transition-transform duration-400 ease-in-out ${isScrolled ? 'h-3 w-3 md:h-4 md:w-4' : 'h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5'}`}
                                                style={{
                                                    transform: hoverItem === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                }}
                                            />
                                        </button>
                                    ) : (
                                        <a
                                            href={item.link}
                                            className={`inline-flex items-center px-1 sm:px-2 md:px-3 py-2 transition-all duration-300 text-sm lg:text-base ${isScrolled ? 'text-sm md:text-base' : 'text-sm md:text-base lg:text-lg'} font-medium text-gray-800 hover:text-red-600`}
                                        >
                                            {item.title}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Responsive adjustments for search and auth */}
                    <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
                        {/* Search - Changes width and visibility based on screen size */}
                        <div className="relative group search-container">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                                        <Search className={`transition-all duration-300 ${isScrolled ? 'h-4 w-4 md:h-5 md:w-5' : 'h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6'} text-gray-400 group-hover:text-red-500`} />
                                    </div>
                                    <input
                                        type="text"
                                        className={`hidden sm:block transition-all duration-300 ${isScrolled ? 'w-32 md:w-40 lg:w-46 text-xs md:text-sm py-1.5 md:py-2' : 'w-36 md:w-44 lg:w-50 text-sm md:text-base py-1.5 md:py-2'} pl-8 sm:pl-10 pr-2 sm:pr-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 group-hover:w-40 md:group-hover:w-52 lg:group-hover:w-64`}
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setShowResults(searchQuery.trim() !== '')}
                                        aria-label="Search"
                                    />
                                    {/* Mobile search icon only */}
                                    <button
                                        type="button"
                                        className="sm:hidden p-2 text-gray-500 hover:text-red-600 focus:outline-none"
                                        onClick={() => alert('Search clicked (mobile)')}
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                            {showResults && (
                                <div className="absolute z-20 mt-2 w-full sm:w-72 md:w-80 lg:w-96 bg-white rounded-lg shadow-lg border border-gray-200 search-results right-0">
                                    {searchResults.length > 0 ? (
                                        <div className="py-2 max-h-72 md:max-h-96 overflow-y-auto">
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
                                            No results found for "{searchQuery}"
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Auth Buttons / Profile - Responsive sizing and conditional display */}
                        {!authenticationState ? (
                            <>
                                <a
                                    href="/login"
                                    className={`hidden sm:inline-block cursor-pointer transition-all duration-300 ${isScrolled ? 'px-3 sm:px-4 md:px-5 py-1.5 md:py-2 text-xs sm:text-sm' : 'px-4 sm:px-5 md:px-6 py-2 md:py-2.5 text-sm md:text-base'} font-medium text-gray-800 hover:text-red-600`}
                                >
                                    Log in
                                </a>
                                <a
                                    href="/redirect"
                                    className={`cursor-pointer transition-all duration-300 ${isScrolled ? 'px-3 sm:px-4 md:px-5 py-1.5 md:py-2 text-xs sm:text-sm' : 'px-3 sm:px-4 md:px-6 py-1.5 md:py-2.5 text-xs sm:text-sm md:text-base'} font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
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
                                    style={{
                                        width: isScrolled ? '2rem' : '2.5rem',
                                        height: isScrolled ? '2rem' : '2.5rem'
                                    }}
                                    aria-haspopup="true"
                                    aria-expanded={showProfileMenu}
                                >
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=mp&s=200"
                                        alt={`${user?.name || 'User'}'s profile`}
                                        className="w-full h-full"
                                    />
                                </div>
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu">
                                        <div className="py-1">
                                            <a
                                                href={user?.role === 'admin' ? '/admin' : `/dashboard/${user?.role || 'user'}/profile`}
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