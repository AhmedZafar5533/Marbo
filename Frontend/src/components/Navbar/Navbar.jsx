// Navbar.jsx
import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load components based on screen size
const DesktopNavbar = lazy(() => import('./DesktopNavbar'));
const MobileNavbar = lazy(() => import('./MobileNavbar'));

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(null);
    const [navbarVisible, setNavbarVisible] = useState(true);
    const lastScrollY = useRef(0);
    const navbarVisibleRef = useRef(navbarVisible);

    // Update refs when state changes
    useEffect(() => {
        navbarVisibleRef.current = navbarVisible;
    }, [navbarVisible]);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        // Initial check
        checkScreenSize();

        // Add resize listener
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Scroll event handler
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY === 0) {
                setNavbarVisible(true);
                lastScrollY.current = currentScrollY;
                return;
            }

            if (currentScrollY > lastScrollY.current) {
                // Scrolling down
                if (navbarVisibleRef.current && currentScrollY > 100) {
                    setNavbarVisible(false);
                }
            } else {
                // Scrolling up
                if (!navbarVisibleRef.current) {
                    setNavbarVisible(true);
                }
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Sample menu data (moved to parent component to share between mobile/desktop)
    const menuItems = [

        {
            title: 'Services',
            link: '/services',
            submenu: [
                { name: 'Telemedicine', description: 'Remote healthcare consultations', link: '/services' },
                { name: 'Online Courses', description: 'Virtual educational programs', link: '/services' },
                { name: 'Renewable Energy Solutions', description: 'Solar and wind power installations', link: '/services' },
                { name: 'Residential Construction', description: 'Building and renovating homes', link: '/services' },
                { name: 'Water Purification', description: 'Clean drinking water systems', link: '/services' },
                { name: 'Mental Wellness Programs', description: 'Therapy and counseling services', link: '/services' },
                { name: 'Financial Planning', description: 'Wealth management and investment advice', link: '/services' },
            ],
        },
        {
            title: 'Boost your Business',
            link: '/pricing',
            submenu: [],
        },
        {
            title: 'Contact Us',
            link: '/contact-us',
            submenu: [],
        }
    ];

    // Shared search function
    const performSearch = (query) => {
        // Mock search implementation
        const allItems = [
            ...menuItems.flatMap(category =>
                category.submenu.map(item => ({
                    ...item,
                    category: category.title
                }))
            ),
            { name: 'About Us', description: 'Learn more about our company', link: '/', category: 'Company' },
            { name: 'Contact', description: 'Get in touch with our team', link: '/contact-us', category: 'Company' },
            { name: 'FAQ', description: 'Frequently asked questions', link: '/faq', category: 'Support' },
        ];

        if (!query.trim()) {
            return [];
        }

        return allItems.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    };

    if (isMobile === null) {
        // Initial loading state
        return <div className="h-16 bg-indigo-50 shadow-md"></div>;
    }
    return (
        <div className={`sticky top-0 inset-x-0 bg-indigo-50 shadow-md z-50 transition-transform duration-300 ${isMobile ? '' : (navbarVisible ? 'translate-y-0' : '-translate-y-full')
            }`}>
            <Suspense fallback={<div className="h-16 lg:h-20 bg-indigo-50"></div>}>
                {isMobile ? (
                    <MobileNavbar menuItems={menuItems} performSearch={performSearch} />
                ) : (
                    <DesktopNavbar menuItems={menuItems} performSearch={performSearch} />
                )}
            </Suspense>
        </div>
    );
};

export default Navbar;