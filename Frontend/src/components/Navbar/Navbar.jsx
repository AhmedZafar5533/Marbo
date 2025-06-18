import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// Lazy load desktop/mobile navbars
const DesktopNavbar = lazy(() => import('./DesktopNavbar'));
const MobileNavbar = lazy(() => import('./MobileNavbar'));

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const lastScrollY = useRef(0);

    // 1️⃣ Screen‐size detector
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 1024);

        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    // 2️⃣ Throttled & guarded scroll handler
    useEffect(() => {
        let ticking = false;

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const y = window.scrollY;
                    setIsScrolled(prev => {
                        const next = y >= 35;
                        return prev === next ? prev : next;
                    });
                    lastScrollY.current = y;
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
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
        { title: 'Boost now', link: '/pricing', submenu: [] },
        { title: 'Contact Us', link: '/contact-us', submenu: [] }
    ];

    // Search helper
    const performSearch = (query) => {
        const allItems = [
            ...menuItems.flatMap(cat =>
                cat.submenu.map(item => ({ ...item, category: cat.title }))
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

    // Initial blank placeholder while we detect screen size
    if (isMobile === null) {
        return <div className="h-16 bg-indigo-50 shadow-md" aria-hidden="true" />;
    }

    return (
        <nav
            className={`sticky top-0 inset-x-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'
                }`}
            role="navigation"
            aria-label="Main Navigation"
        >
            <Suspense
                fallback={
                    <div className={`bg-white ${isScrolled ? 'h-16 lg:h-24' : 'h-18 lg:h-24'}`} aria-hidden="true" />
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
