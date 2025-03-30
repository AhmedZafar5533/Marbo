import React, { useState, useEffect } from 'react';
import {
    Star,
    MapPin,
    Heart,
    Sparkles,
    TrendingUp
} from "lucide-react";
import { useServiceStore } from '../../Store/servicesStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

// Mock data for recommended services and all services
const mockRecommended = [
    {
        _id: "rec1",
        serviceName: "Premium Interior Design",
        category: "Home & Living",
        price: 299,
        rating: 4.9,
        location: "New York, USA",
        vendorName: "Sophia Chen",
        vendorTitle: "Interior Design Expert",
        vendorImage: "https://randomuser.me/api/portraits/women/44.jpg",
        image: { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1932" }
    },
    {
        _id: "rec2",
        serviceName: "Wedding Photography",
        category: "Photography",
        price: 799,
        rating: 5.0,
        location: "Los Angeles, USA",
        vendorName: "Michael Ross",
        vendorTitle: "Professional Photographer",
        vendorImage: "https://randomuser.me/api/portraits/men/67.jpg",
        image: { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1770" }
    },
    {
        _id: "rec3",
        serviceName: "Gourmet Catering",
        category: "Food & Beverages",
        price: 599,
        rating: 4.8,
        location: "Chicago, USA",
        vendorName: "Olivia Martinez",
        vendorTitle: "Executive Chef",
        vendorImage: "https://randomuser.me/api/portraits/women/23.jpg",
        image: { url: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1770" }
    }
];

const mockAllServices = [

    {
        _id: "s3",
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
        _id: "s5",
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
        _id: "s6",
        serviceName: "Financial Consulting",
        category: "Business",
        price: 350,
        rating: 4.9,
        location: "San Francisco, USA",
        vendorName: "Sarah Kim",
        vendorTitle: "Financial Advisor",
        vendorImage: "https://randomuser.me/api/portraits/women/28.jpg",
        image: { url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1770" }
    }
];

const ServiceCard = ({ service, highlighted = false }) => {
    return (
        <div
            className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group ${highlighted ? "ring-2 ring-red-500 ring-opacity-50" : ""
                }`}
        >
            <div className="relative">
                <img
                    src={service.image.url}
                    alt={service.serviceName}
                    className="h-60 w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                    <button className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-red-50 transition-colors">
                        <Heart size={20} className="text-gray-400 hover:text-red-500" />
                    </button>
                </div>
                {highlighted && (
                    <div className="absolute top-4 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <Sparkles size={14} className="mr-1" /> Recommended
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full">
                        {service.category}
                    </span>
                    <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-full">
                        <Star size={16} className="text-amber-500 fill-amber-500" />
                        <span className="ml-1 text-sm font-semibold text-amber-700">{service.rating}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {service.serviceName}
                </h3>

                <div className="flex items-center mb-3 text-gray-500">
                    <MapPin size={16} className="mr-2 text-red-500" />
                    <span className="text-sm">{service.location}</span>
                </div>

                <div className="flex items-center mb-4">
                    <img
                        src={service.vendorImage}
                        alt={service.vendorName}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-white shadow-sm"
                    />
                    <div>
                        <p className="text-sm font-medium text-gray-800">{service.vendorName}</p>
                        <p className="text-xs text-gray-500">{service.vendorTitle}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <span className="text-slate-600">From</span>
                        <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                            ${service.price}
                        </span>
                    </div>

                    <Link to={`/view/${service._id}`}>
                        <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                            Book Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ServicesProviders = () => {
    const [services, setServicesData] = useState([]);
    const [recommendedServices, setRecommendedServices] = useState([]);
    const { getAllServices, allServices, loading } = useServiceStore();

    useEffect(() => {
        getAllServices();
        setRecommendedServices(mockRecommended);
    }, [getAllServices]);

    useEffect(() => {
        if (allServices.length > 0) {
            setServicesData(mockAllServices);
        } else {
            setServicesData(mockAllServices);
        }
    }, [allServices]);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Recommended Services Section */}
            <section className="pt-12 pb-4 bg-white bg-gradient-to-t  from-[#FCE6A6] to-[#FFFFFF]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#FD1A03]">Recommended for You</h2>
                            <p className="text-gray-600 mt-2">Our recommended services</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">
                        {recommendedServices.map((service) => (
                            <ServiceCard key={service._id} service={service} highlighted={true} />
                        ))}
                    </div>
                </div>
                {/* Wave-like separator */}
                <div className="relative h-16 -mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-16">
                        <path
                            fill="#f9fafb"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,160C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
                        </path>
                    </svg>
                </div>
            </section>

            {/* All Services Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">All Services</h2>
                    <p className="text-gray-600 mt-1">Explore our full catalog of top quality services</p>
                </div>

                {services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="text-center">
                            <div className="text-6xl font-bold text-gray-200 mb-6">
                                Empty State
                            </div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Services Available</h2>
                            <p className="text-lg text-gray-600 max-w-md mx-auto">
                                We're working on bringing exciting services to you. Stay tuned!
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ServicesProviders;