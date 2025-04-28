import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load components based on screen size
const DesktopNavbar = lazy(() => import('./DesktopNavbar'));
const MobileNavbar = lazy(() => import('./MobileNavbar'));

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Scroll event handler for shrinking effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 30);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Menu data
    const menuItems = [
        {
            title: 'Services',
            link: '/services',
            submenu: [
                { name: 'Home Services', description: 'Groceries, design, and domestic help', link: '/providers/home' },
                { name: 'Payments & Utilities', description: 'Bills, school fees, and more', link: '/providers/payments' },
                { name: 'Lifestyle', description: 'Clothing, rentals, crafts, and fashion', link: '/providers/lifestyle' },
                { name: 'Health & Wellness', description: 'Medical care and health insurance', link: '/providers/health' },
                { name: 'Real Estate & Property', description: 'Buy, rent, and manage properties', link: '/providers/real-estate' },
                { name: 'Financial Services', description: 'Transfers, banking, and mortgages', link: '/providers/financial' },
                { name: 'Technology & Communication', description: 'Devices and mobile services', link: '/providers/technology' },
                { name: 'Professional Services', description: 'Construction, farming, events, and ads', link: '/providers/professional' },
            ]
        },
        {
            title: 'Boost now',
            link: '/pricing',
            submenu: [],
        },
        {
            title: 'Contact Us',
            link: '/contact-us',
            submenu: [],
        }
    ];

    // Search function
    const performSearch = (query) => {
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

        if (!query.trim()) return [];

        return allItems.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    };

    if (isMobile === null) {
        return (
            <div className="h-16 bg-indigo-50 shadow-md" aria-hidden="true"></div>
        );
    }

    return (
        <nav
            className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-lg' : 'shadow-md'
                }`}
            role="navigation"
            aria-label="Main Navigation"
        >

            <Suspense
                fallback={
                    <div className={`${isScrolled ? 'h-16 lg:h-24' : 'h-18 lg:h-24'} bg-white`} aria-hidden="true"></div>
                }
            >
                {isMobile ? (
                    <MobileNavbar
                        menuItems={menuItems}
                        performSearch={performSearch}
                        isScrolled={isScrolled}
                    />
                ) : (
                    <DesktopNavbar
                        menuItems={menuItems}
                        performSearch={performSearch}
                        isScrolled={isScrolled}
                    />
                )}
            </Suspense>
        </nav>
    );
};

export default Navbar;
