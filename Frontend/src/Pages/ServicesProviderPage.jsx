import React, { useState, useEffect } from 'react';
import {
    Star,
    MapPin,
    Heart,
    Sparkles,
    TrendingUp,
    Filter,
    ChevronDown,
    ArrowRight,
    Sliders
} from "lucide-react";
// import { useServiceStore } from '../../Store/servicesStore';
// import LoadingSpinner from '../components/LoadingSpinner';
import { Link, useParams } from 'react-router-dom';
import { FaHeadset } from 'react-icons/fa';

// Keep mock data for popular services only
const mockPopularServices = [
    {
        _id: "s1",
        serviceName: "Personal Training",
        category: "Fitness",
        price: 75,
        rating: 4.9,
        location: "Denver, USA",
        vendorName: "Jason Miller",
        vendorTitle: "Certified Trainer",
        vendorImage: "https://randomuser.me/api/portraits/men/46.jpg",
        image: { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "s2",
        serviceName: "Home Cleaning",
        category: "Home Services",
        price: 120,
        rating: 4.7,
        location: "Boston, USA",
        vendorName: "Carlos Rodriguez",
        vendorTitle: "Service Manager",
        vendorImage: "https://randomuser.me/api/portraits/men/22.jpg",
        image: { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "s3",
        serviceName: "Financial Consulting",
        category: "Business",
        price: 350,
        rating: 4.9,
        location: "San Francisco, USA",
        vendorName: "Sarah Kim",
        vendorTitle: "Financial Advisor",
        vendorImage: "https://randomuser.me/api/portraits/women/28.jpg",
        image: { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1770" }
    },
];

// Home Services
const mockHomeServices = [
    {
        _id: "hs1",
        serviceName: "Deep House Cleaning",
        category: "Home Services",
        price: 149,
        rating: 4.8,
        location: "Seattle, USA",
        vendorName: "Elena Rodriguez",
        vendorTitle: "Cleaning Specialist",
        vendorImage: "https://randomuser.me/api/portraits/women/12.jpg",
        image: { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "hs2",
        serviceName: "Home Interior Design",
        category: "Home Services",
        price: 349,
        rating: 4.9,
        location: "Portland, USA",
        vendorName: "Marcus Johnson",
        vendorTitle: "Senior Interior Designer",
        vendorImage: "https://randomuser.me/api/portraits/men/33.jpg",
        image: { url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "hs3",
        serviceName: "Grocery Delivery",
        category: "Home Services",
        price: 25,
        rating: 4.7,
        location: "Austin, USA",
        vendorName: "Priya Patel",
        vendorTitle: "Delivery Manager",
        vendorImage: "https://randomuser.me/api/portraits/women/65.jpg",
        image: { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "hs4",
        serviceName: "Personal Chef",
        category: "Home Services",
        price: 199,
        rating: 4.9,
        location: "Chicago, USA",
        vendorName: "Jean-Pierre Dubois",
        vendorTitle: "Executive Chef",
        vendorImage: "https://randomuser.me/api/portraits/men/41.jpg",
        image: { url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Payments & Utilities
const mockPaymentsUtilities = [
    {
        _id: "pu1",
        serviceName: "Bill Payment Service",
        category: "Payments & Utilities",
        price: 10,
        rating: 4.8,
        location: "Dallas, USA",
        vendorName: "Thomas Williams",
        vendorTitle: "Financial Services Expert",
        vendorImage: "https://randomuser.me/api/portraits/men/55.jpg",
        image: { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "pu2",
        serviceName: "School Fee Processing",
        category: "Payments & Utilities",
        price: 15,
        rating: 4.7,
        location: "Phoenix, USA",
        vendorName: "Amanda Chen",
        vendorTitle: "Education Finance Specialist",
        vendorImage: "https://randomuser.me/api/portraits/women/36.jpg",
        image: { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "pu3",
        serviceName: "Utility Connection Setup",
        category: "Payments & Utilities",
        price: 49,
        rating: 4.6,
        location: "Houston, USA",
        vendorName: "Robert Garcia",
        vendorTitle: "Utility Coordinator",
        vendorImage: "https://randomuser.me/api/portraits/men/18.jpg",
        image: { url: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Lifestyle
const mockLifestyle = [
    {
        _id: "ls1",
        serviceName: "Personal Styling",
        category: "Lifestyle",
        price: 199,
        rating: 4.9,
        location: "Los Angeles, USA",
        vendorName: "Isabella Moore",
        vendorTitle: "Fashion Consultant",
        vendorImage: "https://randomuser.me/api/portraits/women/29.jpg",
        image: { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "ls2",
        serviceName: "Custom Tailoring",
        category: "Lifestyle",
        price: 159,
        rating: 4.8,
        location: "New York, USA",
        vendorName: "James Wong",
        vendorTitle: "Master Tailor",
        vendorImage: "https://randomuser.me/api/portraits/men/62.jpg",
        image: { url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "ls3",
        serviceName: "Craft Workshop",
        category: "Lifestyle",
        price: 89,
        rating: 4.7,
        location: "San Diego, USA",
        vendorName: "Emma Wilson",
        vendorTitle: "Artisan & Instructor",
        vendorImage: "https://randomuser.me/api/portraits/women/17.jpg",
        image: { url: "https://images.unsplash.com/photo-1605627079912-97c3810a11a4?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "ls4",
        serviceName: "Designer Rental Service",
        category: "Lifestyle",
        price: 129,
        rating: 4.6,
        location: "Miami, USA",
        vendorName: "Victoria Santos",
        vendorTitle: "Fashion Curator",
        vendorImage: "https://randomuser.me/api/portraits/women/52.jpg",
        image: { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Health & Wellness
const mockHealthWellness = [
    {
        _id: "hw1",
        serviceName: "Online Medical Consultation",
        category: "Health & Wellness",
        price: 99,
        rating: 4.9,
        location: "Boston, USA",
        vendorName: "Dr. Andrew Kim",
        vendorTitle: "General Physician",
        vendorImage: "https://randomuser.me/api/portraits/men/43.jpg",
        image: { url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "hw2",
        serviceName: "Health Insurance Advisory",
        category: "Health & Wellness",
        price: 79,
        rating: 4.7,
        location: "Washington DC, USA",
        vendorName: "Lisa Thompson",
        vendorTitle: "Insurance Specialist",
        vendorImage: "https://randomuser.me/api/portraits/women/49.jpg",
        image: { url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "hw3",
        serviceName: "Yoga & Meditation Classes",
        category: "Health & Wellness",
        price: 59,
        rating: 4.8,
        location: "Denver, USA",
        vendorName: "Raj Patel",
        vendorTitle: "Certified Yoga Instructor",
        vendorImage: "https://randomuser.me/api/portraits/men/77.jpg",
        image: { url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "hw4",
        serviceName: "Wellness Nutrition Planning",
        category: "Health & Wellness",
        price: 149,
        rating: 4.9,
        location: "San Francisco, USA",
        vendorName: "Emily Chen",
        vendorTitle: "Nutritionist",
        vendorImage: "https://randomuser.me/api/portraits/women/72.jpg",
        image: { url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Real Estate & Property
const mockRealEstate = [
    {
        _id: "re1",
        serviceName: "Property Management",
        category: "Real Estate & Property",
        price: 249,
        rating: 4.8,
        location: "Chicago, USA",
        vendorName: "Jonathan Barnes",
        vendorTitle: "Property Manager",
        vendorImage: "https://randomuser.me/api/portraits/men/72.jpg",
        image: { url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "re2",
        serviceName: "Real Estate Brokerage",
        category: "Real Estate & Property",
        price: 399,
        rating: 4.9,
        location: "Austin, USA",
        vendorName: "Sophia Martinez",
        vendorTitle: "Senior Real Estate Agent",
        vendorImage: "https://randomuser.me/api/portraits/women/19.jpg",
        image: { url: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "re3",
        serviceName: "Property Inspection",
        category: "Real Estate & Property",
        price: 179,
        rating: 4.7,
        location: "Seattle, USA",
        vendorName: "Marcus Johnson",
        vendorTitle: "Certified Property Inspector",
        vendorImage: "https://randomuser.me/api/portraits/men/29.jpg",
        image: { url: "https://images.unsplash.com/photo-1484482340112-e1e2682b4856?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "re4",
        serviceName: "Rental Property Search",
        category: "Real Estate & Property",
        price: 129,
        rating: 4.8,
        location: "Portland, USA",
        vendorName: "Olivia Wilson",
        vendorTitle: "Rental Specialist",
        vendorImage: "https://randomuser.me/api/portraits/women/33.jpg",
        image: { url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Financial Services
const mockFinancialServices = [
    {
        _id: "fs1",
        serviceName: "Financial Planning",
        category: "Financial Services",
        price: 299,
        rating: 4.9,
        location: "New York, USA",
        vendorName: "Richard Martinez",
        vendorTitle: "Certified Financial Planner",
        vendorImage: "https://randomuser.me/api/portraits/men/37.jpg",
        image: { url: "https://images.unsplash.com/photo-1565514158740-064f34bd6cfd?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "fs2",
        serviceName: "Money Transfer Services",
        category: "Financial Services",
        price: 19,
        rating: 4.7,
        location: "Dallas, USA",
        vendorName: "Karen Lee",
        vendorTitle: "Financial Services Agent",
        vendorImage: "https://randomuser.me/api/portraits/women/39.jpg",
        image: { url: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "fs3",
        serviceName: "Mortgage Advisory",
        category: "Financial Services",
        price: 199,
        rating: 4.8,
        location: "Boston, USA",
        vendorName: "David Chen",
        vendorTitle: "Mortgage Specialist",
        vendorImage: "https://randomuser.me/api/portraits/men/53.jpg",
        image: { url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "fs4",
        serviceName: "Tax Preparation",
        category: "Financial Services",
        price: 149,
        rating: 4.9,
        location: "Philadelphia, USA",
        vendorName: "Amanda Rodriguez",
        vendorTitle: "Certified Accountant",
        vendorImage: "https://randomuser.me/api/portraits/women/42.jpg",
        image: { url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Technology & Communication
const mockTechnology = [
    {
        _id: "tc1",
        serviceName: "Tech Support & Repair",
        category: "Technology & Communication",
        price: 89,
        rating: 4.8,
        location: "San Francisco, USA",
        vendorName: "Jason Wong",
        vendorTitle: "IT Specialist",
        vendorImage: "https://randomuser.me/api/portraits/men/15.jpg",
        image: { url: "https://images.unsplash.com/photo-1551703599-6b3e8242661f?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "tc2",
        serviceName: "Mobile Plan Consultation",
        category: "Technology & Communication",
        price: 49,
        rating: 4.7,
        location: "Atlanta, USA",
        vendorName: "Tiffany Johnson",
        vendorTitle: "Telecommunications Advisor",
        vendorImage: "https://randomuser.me/api/portraits/women/25.jpg",
        image: { url: "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "tc3",
        serviceName: "Smart Home Setup",
        category: "Technology & Communication",
        price: 159,
        rating: 4.9,
        location: "Denver, USA",
        vendorName: "Michael Stevens",
        vendorTitle: "Home Automation Expert",
        vendorImage: "https://randomuser.me/api/portraits/men/61.jpg",
        image: { url: "https://images.unsplash.com/photo-1558002038-bb4237d2f8ed?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "tc4",
        serviceName: "Device Selection Consulting",
        category: "Technology & Communication",
        price: 79,
        rating: 4.8,
        location: "Los Angeles, USA",
        vendorName: "Sarah Kim",
        vendorTitle: "Tech Product Specialist",
        vendorImage: "https://randomuser.me/api/portraits/women/56.jpg",
        image: { url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Professional Services
const mockProfessionalServices = [
    {
        _id: "ps1",
        serviceName: "Construction Management",
        category: "Professional Services",
        price: 499,
        rating: 4.8,
        location: "Houston, USA",
        vendorName: "Robert Williams",
        vendorTitle: "Construction Manager",
        vendorImage: "https://randomuser.me/api/portraits/men/49.jpg",
        image: { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "ps2",
        serviceName: "Agricultural Consulting",
        category: "Professional Services",
        price: 349,
        rating: 4.7,
        location: "Des Moines, USA",
        vendorName: "John Peterson",
        vendorTitle: "Agricultural Expert",
        vendorImage: "https://randomuser.me/api/portraits/men/27.jpg",
        image: { url: "https://images.unsplash.com/photo-1592982573551-817fa4dc8275?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "ps3",
        serviceName: "Event Planning & Management",
        category: "Professional Services",
        price: 799,
        rating: 4.9,
        location: "Miami, USA",
        vendorName: "Jessica Chen",
        vendorTitle: "Event Planning Director",
        vendorImage: "https://randomuser.me/api/portraits/women/68.jpg",
        image: { url: "https://images.unsplash.com/photo-1511795409834-432f578453b5?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "ps4",
        serviceName: "Marketing & Advertising",
        category: "Professional Services",
        price: 399,
        rating: 4.8,
        location: "Chicago, USA",
        vendorName: "Alex Rodriguez",
        vendorTitle: "Marketing Strategist",
        vendorImage: "https://randomuser.me/api/portraits/men/82.jpg",
        image: { url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1770" }
    }
];

// Categories for filter
const categories = [
    "All Categories",
    "Home & Living",
    "Photography",
    "Food & Beverages",
    "Fitness",
    "Home Services",
    "Business",
    "Events",
    "Transportation",
    "Beauty",
    "Technology",
    "Wellness",
    "Education"
];

// Redesigned Service Card
const ServiceCard = ({ service, highlighted = false }) => {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div
            className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border ${highlighted ? "border-red-200" : "border-gray-100"
                }`}
        >
            <div className="relative">
                <img
                    src={service.image.url}
                    alt={service.serviceName}
                    className="h-56 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Like button */}
                <button
                    className="absolute top-3 right-3 z-20 bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <Heart
                        size={18}
                        className={`${isLiked ? "text-red-500 fill-red-500" : "text-gray-400"} transition-colors`}
                    />
                </button>

                {/* Recommended badge */}
                {highlighted && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium flex items-center">
                            <Sparkles size={12} className="mr-1" /> Recommended
                        </span>
                    </div>
                )}

                {/* Category badge */}
                <div className="absolute bottom-3 left-3 z-20">
                    <span className="text-xs font-medium text-white bg-black/60 px-2.5 py-1 rounded-lg">
                        {service.category}
                    </span>
                </div>
            </div>

            <div className="p-5">
                {/* Title and rating */}
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {service.serviceName}
                    </h3>
                    <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="ml-1 text-xs font-medium text-amber-700">{service.rating}</span>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center mb-3 text-gray-500 text-sm">
                    <MapPin size={14} className="mr-1 text-gray-400" />
                    <span>{service.location}</span>
                </div>

                {/* Vendor info */}
                <div className="flex items-center mb-4">
                    <img
                        src={service.vendorImage}
                        alt={service.vendorName}
                        className="w-8 h-8 rounded-full mr-2 border border-white shadow-sm"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-800">{service.vendorName}</p>
                        <p className="text-xs text-gray-500">{service.vendorTitle}</p>
                    </div>
                </div>

                {/* Price and book button */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-lg font-bold text-red-600">
                        ${service.price}
                    </div>

                    <Link to={`/view/${service._id}`}>
                        <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center">
                            Book
                            <ArrowRight size={14} className="ml-1.5" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Redesigned Popular Service Card
const PopularServiceCard = ({ service }) => {
    return (
        <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm hover:shadow-md">
            <div className="flex space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                        src={service.image.url}
                        alt={service.serviceName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-grow">
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-1">{service.serviceName}</h3>
                    <div className="flex items-center mt-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="ml-1 text-xs text-gray-500">{service.rating}</span>
                        <span className="mx-1.5 text-gray-300">•</span>
                        <span className="text-xs font-medium text-red-500">${service.price}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                        <MapPin size={10} className="mr-1" />
                        {service.location}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Filter Pill Component
const FilterPill = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`text-sm px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${active
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
    >
        {label}
    </button>
);





const ServicesProviders = () => {
    const { type } = useParams();

    const [recommendedServices, setRecommendedServices] = useState([]);
    const [displayedServices, setDisplayedServices] = useState([]);
    const [displayedRecommended, setDisplayedRecommended] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerLoad = 6;

    useEffect(() => {
        let categoryServices = [];

        switch (type) {
            case "home":
                categoryServices = mockHomeServices;
                break;
            case "payments":
                categoryServices = mockPaymentsUtilities;
                break;
            case "lifestyle":
                categoryServices = mockLifestyle;
                break;
            case "health":
                categoryServices = mockHealthWellness;
                break;
            case "real-estate":
                categoryServices = mockRealEstate;
                break;
            case "financial":
                categoryServices = mockFinancialServices;
                break;
            case "technology":
                categoryServices = mockTechnology;
                break;
            case "professional":
                categoryServices = mockProfessionalServices;
                break;
            default:
                categoryServices = []; // Optionally use mockAllServices or similar
        }

        setRecommendedServices(categoryServices);
        setDisplayedServices(categoryServices.slice(0, itemsPerLoad));
        setDisplayedRecommended(categoryServices.slice(0, itemsPerLoad));
    }, [type]);

    const loadMoreServices = () => {
        setDisplayedServices((prev) =>
            recommendedServices.slice(0, prev.length + itemsPerLoad)
        );
    };

    const loadMoreRecommended = () => {
        setDisplayedRecommended((prev) =>
            recommendedServices.slice(0, prev.length + itemsPerLoad)
        );
    };

    const toggleFilters = () => setShowFilters(!showFilters);

    return (
        <div className="min-h-screen bg-gray-50 pb-16 pt-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Recommended Services */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Sparkles size={18} className="mr-2 text-red-500" />
                            Recommended for You
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedRecommended.map((service) => (
                            <ServiceCard key={service._id} service={service} highlighted />
                        ))}
                    </div>

                    {displayedRecommended.length < recommendedServices.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMoreRecommended}
                                className="text-sm text-red-600 font-medium border border-red-200 rounded-lg hover:bg-red-50 px-5 py-2"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </section>

                {/* Popular Services */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <TrendingUp size={18} className="mr-2 text-red-500" />
                            Popular Services
                        </h2>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockPopularServices.map((service) => (
                                <PopularServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* All Services */}
                <section>
                    <div className="max-w-6xl mx-auto py-6">
                        <div className="flex items-center justify-between mb-2">
                            <button
                                onClick={toggleFilters}
                                className="flex items-center text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50"
                            >
                                <Sliders size={16} className="mr-2" />
                                Filters
                            </button>
                        </div>

                        {showFilters && (
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 mt-3">
                                <div className="flex flex-wrap gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Price Range</p>
                                        <div className="flex gap-2">
                                            <FilterPill label="Any Price" active />
                                            <FilterPill label="$0-$100" />
                                            <FilterPill label="$100-$300" />
                                            <FilterPill label="$300+" />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Sort By</p>
                                        <div className="flex gap-2">
                                            <FilterPill label="Recommended" active />
                                            <FilterPill label="Newest" />
                                            <FilterPill label="Popular" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-gray-900">All Services</h2>
                        <div className="flex items-center text-sm text-gray-500">
                            <Filter size={14} className="mr-1" />
                            <span>{selectedCategory}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedServices.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>

                    {displayedServices.length < recommendedServices.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMoreServices}
                                className="bg-red-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                Load More Services
                            </button>
                        </div>
                    )}
                </section>

                {/* Support CTA */}
                <div className="mt-24 bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/3 flex justify-center">
                            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                                <FaHeadset className="w-10 h-10 text-red-600" />
                            </div>
                        </div>
                        <div className="md:w-2/3 text-center md:text-left">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Need help?</h3>
                            <p className="text-slate-600 mb-4">We're here 24/7 to help you.</p>
                            <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesProviders;


