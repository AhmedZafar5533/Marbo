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
import { useServiceStore } from '../../Store/servicesStore';
import LoadingSpinner from '../components/LoadingSpinner';

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





// Redesigned Service Card
const ServiceCard = ({ service, redirectUrl, highlighted = false }) => {
    const [isLiked, setIsLiked] = useState(false);


    return (
        <div
            className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${highlighted
                ? "shadow-lg shadow-red-100 ring-1 ring-red-200"
                : "shadow-md hover:shadow-gray-200"
                }`}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden">
                <img
                    src={service.image.url}
                    alt={service.serviceName}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Like Button */}
                <button
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${isLiked
                        ? "bg-red-500 shadow-lg"
                        : "bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                        }`}
                    onClick={() => setIsLiked(!isLiked)}
                >
                    <Heart
                        size={16}
                        className={`${isLiked ? "text-white fill-white" : "text-gray-600"
                            } transition-colors duration-200`}
                    />
                </button>

                {/* Recommended Badge */}
                {highlighted && (
                    <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <Sparkles size={12} className="mr-1" />
                            Recommended
                        </span>
                    </div>
                )}

                {/* Category */}
                <div className="absolute bottom-3 left-3">
                    <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        {service.category}
                    </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="ml-1 text-xs font-semibold text-gray-800">{service.rating}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                    {service.serviceName}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description || "Professional service with excellent quality and customer satisfaction guaranteed."}
                </p>

                {/* Vendor */}
                <div className="flex items-center mb-4">
                    <img
                        src='https://www.gravatar.com/avatar/?d=mp&s=200'
                        alt={service.vendorName}
                        className="w-8 h-8 rounded-full mr-3 border-2 border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{service.vendorName}</p>
                        <p className="text-xs text-gray-500 truncate">{service.vendorTitle}</p>
                    </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center ">
                    {/* <div>
                        <span className="text-xl font-bold text-gray-900">${service.price}</span>
                        <span className="text-sm text-gray-500 ml-1">per service</span>
                    </div> */}

                    <a href={`/service/${redirectUrl}/${service._id}`} className='ml-auto'>
                        <button className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 flex items-center">
                            View
                            <ArrowRight size={14} className="ml-1" />
                        </button>
                    </a>
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


    const categories = ["Groceries", "Interior Design", 'Domestic Staffing', "Utility Payments", 'Water Bill Payments', "School Fee Payments", 'Holiday Lets', "Arts and Crafts", "Hotel Booking", "Medical Care", "Health Insurance", "Properties For Sale", "Rental Properties", "Land For Sale", "Money Transfer Services", "Rent Collection", "Tech Supplies", "Telcom Services", "Construction Services", "Agricultural Services", "Event Planning", "Hardware Suppliers", "Fashion Services", "Traditional Clothing"];

    const [recommendedServices, setRecommendedServices] = useState([]);
    const [displayedServices, setDisplayedServices] = useState([]);
    const [displayedRecommended, setDisplayedRecommended] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [redirectUrl, setRedirectUrl] = useState()
    const [showFilters, setShowFilters] = useState(false);
    const { getAllServices, allServices, loading } = useServiceStore()

    const itemsPerLoad = 6;

    const { category } = useParams();



    useEffect(() => {
        getAllServices(category);
    }, [getAllServices, category]);

    useEffect(() => {
        if (allServices && allServices.length > 0) {
            setRecommendedServices(allServices);
            setDisplayedServices(allServices.slice(0, itemsPerLoad));
            setDisplayedRecommended(allServices.slice(0, itemsPerLoad));
            if (categories.includes(category)) {
                const formattedCategory = category.replace(/ /g, '-');
                setRedirectUrl(formattedCategory);
            }

        }

    }, [allServices]);



    // useEffect(() => {
    //     let categoryServices = [];

    //     switch (type) {
    //         case "home":
    //             categoryServices = mockHomeServices;
    //             break;
    //         case "payments":
    //             categoryServices = mockPaymentsUtilities;
    //             break;
    //         case "lifestyle":
    //             categoryServices = mockLifestyle;
    //             break;
    //         case "health":
    //             categoryServices = mockHealthWellness;
    //             break;
    //         case "real-estate":
    //             categoryServices = mockRealEstate;
    //             break;
    //         case "financial":
    //             categoryServices = mockFinancialServices;
    //             break;
    //         case "technology":
    //             categoryServices = mockTechnology;
    //             break;
    //         case "professional":
    //             categoryServices = mockProfessionalServices;
    //             break;
    //         default:
    //             categoryServices = []; // Optionally use mockAllServices or similar
    //     }

    //     setRecommendedServices(categoryServices);
    //     setDisplayedServices(categoryServices.slice(0, itemsPerLoad));
    //     setDisplayedRecommended(categoryServices.slice(0, itemsPerLoad));
    // }, [type]);

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
    if (loading)
        return <LoadingSpinner />

    return (
        <>
            {
                !loading && allServices.length < 1 ? (
                    <div className="min-h-screen bg-gray-50 pb-16 pt-10">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Beautiful No Services Found State */}
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                                <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-8 shadow-lg">
                                    <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <div className="max-w-md mx-auto">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">No Services Found</h2>
                                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                        We couldn't find any services at the moment. Our team is working to bring you amazing services soon!
                                    </p>

                                    <a href='/services'>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors shadow-md">
                                                Browse Categories
                                            </button>

                                        </div></a>
                                </div>
                            </div>

                            {/* Support CTA - Always Show */}
                            <div className="mt-16 bg-white p-8 rounded-2xl shadow-md border border-slate-100 max-w-3xl mx-auto">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="md:w-1/3 flex justify-center">
                                        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                                            <FaHeadset className="w-10 h-10 text-red-600" />
                                        </div>
                                    </div>
                                    <div className="md:w-2/3 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Need help?</h3>
                                        <p className="text-slate-600 mb-4">We're here 24/7 to help you.</p>
                                        <Link to={'/contact-us'} >
                                            <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                                                Contact Us
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
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
                                        <ServiceCard key={service._id} service={service} highlighted redirectUrl={redirectUrl} />
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
                                        <ServiceCard key={service._id} service={service} redirectUrl={redirectUrl} />
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

                            {/* Support CTA - Always Show */}
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
                                        <Link to={'/contact-us'} >
                                            <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                                                Contact Us
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default ServicesProviders;


