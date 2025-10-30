import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { ChevronDown, Search, User, LogOut } from "lucide-react";
import { useAuthStore } from "../../../Store/authStore";

const MegaMenu = lazy(() => import("./MegaMenu"));

const DesktopNavbar = ({ menuItems, performSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const timeoutRef = useRef(null);
  const profileTimeoutRef = useRef(null);
  const { authenticationState, sendLogoutRequest, user } = useAuthStore();

  // Debounced scroll event listener
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY > 10;
          setIsScrolled((prev) => {
            if (prev !== scrollTop) return scrollTop;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const results = performSearch(query);
    setSearchResults(results);
    setShowResults(query.trim() !== "");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const results = performSearch(searchQuery);
    setSearchResults(results);
    setShowResults(searchQuery.trim() !== "");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showResults &&
        !event.target.closest(".search-results") &&
        !event.target.closest(".search-container")
      ) {
        setShowResults(false);
      }
      if (
        showProfileMenu &&
        !event.target.closest(".profile-menu") &&
        !event.target.closest(".profile-container")
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <div
          className={`flex justify-between items-center transition-[height] duration-300 ease-in-out
                        ${
                          isScrolled
                            ? "h-14 sm:h-16 lg:h-18"
                            : "h-16 sm:h-18 lg:h-20"
                        }`}
        >
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <div className="flex-shrink-0">
              <a
                href="/"
                aria-label="Go to homepage"
                className="flex items-center space-x-2 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 group"
              >
                <div className="relative h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110">
                  <span className="text-white font-extrabold text-sm sm:text-base lg:text-lg xl:text-xl">
                    T
                  </span>
                  <span className="absolute inset-0 rounded-full ring-2 ring-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </div>
                <span
                  className={`hidden sm:block ${
                    isScrolled
                      ? "text-lg sm:text-xl lg:text-2xl"
                      : "text-lg sm:text-xl lg:text-2xl xl:text-[1.7rem]"
                  } transition-all duration-300 font-extrabold text-gray-900 group-hover:text-red-600 whitespace-nowrap`}
                >
                  Triple Portion
                </span>
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex space-x-1 xl:space-x-4 2xl:space-x-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.submenu && item.submenu.length > 0 ? (
                    <button
                      className={`inline-flex items-center px-2 xl:px-3 py-2 transition-all duration-300 ${
                        isScrolled
                          ? "text-sm xl:text-base"
                          : "text-sm xl:text-base 2xl:text-lg"
                      } font-medium text-gray-800 hover:text-red-600 whitespace-nowrap`}
                      aria-haspopup="true"
                      aria-expanded={hoverItem === index}
                    >
                      {item.title}
                      <ChevronDown
                        className={`ml-1 transition-transform duration-400 ease-in-out ${
                          isScrolled
                            ? "h-3 w-3 xl:h-4 xl:w-4"
                            : "h-3 w-3 xl:h-4 xl:w-4 2xl:h-5 2xl:w-5"
                        }`}
                        style={{
                          transform:
                            hoverItem === index
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      />
                    </button>
                  ) : (
                    <a
                      href={item.link}
                      className={`inline-flex items-center px-2 xl:px-3 py-2 transition-all duration-300 ${
                        isScrolled
                          ? "text-sm xl:text-base"
                          : "text-sm xl:text-base 2xl:text-lg"
                      } font-medium text-gray-800 hover:text-red-600 whitespace-nowrap`}
                    >
                      {item.title}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Section - Search & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Search - Progressive enhancement */}
            <div className="relative group search-container">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                    <Search
                      className={`transition-all duration-300 ${
                        isScrolled ? "h-4 w-4" : "h-4 w-4 lg:h-5 lg:w-5"
                      } text-gray-400 group-hover:text-red-500`}
                    />
                  </div>
                  <input
                    type="text"
                    className={`hidden md:block transition-all duration-300 ${
                      isScrolled
                        ? "w-28 lg:w-32 xl:w-40 text-xs lg:text-sm py-1.5"
                        : "w-32 lg:w-36 xl:w-44 text-sm py-2"
                    } pl-8 pr-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 group-hover:w-36 lg:group-hover:w-44 xl:group-hover:w-52`}
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(searchQuery.trim() !== "")}
                    aria-label="Search"
                  />
                  {/* Mobile search icon */}
                  <button
                    type="button"
                    className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
              {showResults && (
                <div className="absolute z-20 mt-2 w-72 lg:w-80 xl:w-96 bg-white rounded-lg shadow-lg border border-gray-200 search-results right-0">
                  {searchResults.length > 0 ? (
                    <div className="py-2 max-h-72 lg:max-h-96 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <a
                          key={idx}
                          href={result.link}
                          className="block px-4 py-3 hover:bg-red-50 transition-colors duration-200"
                          onClick={() => setShowResults(false)}
                        >
                          <div className="flex items-start">
                            <div className="flex-grow">
                              <div className="text-sm font-medium text-gray-900">
                                {result.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {result.description}
                              </div>
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

            {/* Authentication - Single button approach */}
            {!authenticationState ? (
              <a
                href="/login"
                className={`transition-all duration-300 ${
                  isScrolled
                    ? "px-3 sm:px-4 lg:px-5 py-1.5 text-xs sm:text-sm"
                    : "px-3 sm:px-4 lg:px-6 py-1.5 lg:py-2 text-xs sm:text-sm lg:text-base"
                } font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap`}
              >
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Login</span>
              </a>
            ) : (
              <div
                className="relative profile-container"
                onMouseEnter={handleProfileMouseEnter}
                onMouseLeave={handleProfileMouseLeave}
              >
                <div
                  className="rounded-full overflow-hidden border-2 border-white shadow-sm bg-red-600 cursor-pointer"
                  style={{
                    width: isScrolled ? "1.75rem" : "2rem",
                    height: isScrolled ? "1.75rem" : "2rem",
                  }}
                  aria-haspopup="true"
                  aria-expanded={showProfileMenu}
                >
                  <img
                    src="https://www.gravatar.com/avatar/?d=mp&s=200"
                    alt={`${user?.name || "User"}'s profile`}
                    className="w-full h-full"
                  />
                </div>
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 profile-menu">
                    <div className="py-1">
                      <a
                        href={
                          user?.role === "admin"
                            ? "/admin"
                            : `/dashboard/${user?.role || "user"}/profile`
                        }
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
