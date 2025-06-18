import React, { useState } from 'react';
import { Star, MapPin, Calendar, Phone, Mail, MessageCircle, Heart, Share2, Award, Users, Clock, CheckCircle, ArrowRight, Shield } from 'lucide-react';

// Sample vendor data - replace with actual data
const vendorData = {
    name: "Sarah Johnson",
    title: "Professional Wedding Photographer",
    banner: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
    image: "https://images.unsplash.com/photo-1494790108755-2616b332c134?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    rating: 4.9,
    totalReviews: 127,
    location: "New York, NY",
    activeSince: "2019",
    verified: true,
    totalJobs: 250,
    responseTime: "2 hours",
    category: "Photography",
    description: "Passionate photographer specializing in weddings, portraits, and special events. With over 5 years of experience, I capture your most precious moments with artistic flair and professional excellence.",
    services: [
        { name: "Wedding Photography", price: 1200, rating: 4.9 },
        { name: "Portrait Session", price: 300, rating: 4.8 },
        { name: "Event Photography", price: 800, rating: 5.0 }
    ],
    reviews: [
        {
            id: 1,
            name: "Emily Chen",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
            rating: 5,
            date: "2 weeks ago",
            text: "Sarah captured our wedding perfectly! Her attention to detail and creative eye made our special day even more memorable."
        },
        {
            id: 2,
            name: "Michael Torres",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
            rating: 5,
            date: "1 month ago",
            text: "Professional, punctual, and delivers amazing results. Highly recommend for any photography needs!"
        },
        {
            id: 3,
            name: "Lisa Rodriguez",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
            rating: 4,
            date: "2 months ago",
            text: "Great experience overall. Sarah was easy to work with and the photos turned out beautiful."
        }
    ]
};

const VendorDetailPage = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [isFollowing, setIsFollowing] = useState(false);

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={14}
                className={`${i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative">
                {/* Banner */}
                <div className="h-72 bg-gradient-to-br from-gray-900 to-gray-700 overflow-hidden">
                    <img
                        src={vendorData.banner}
                        alt="Vendor banner"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* Vendor Profile Card */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-6">
                    <div className="bg-white rounded-3xl shadow-xl p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Profile Image */}
                            <div className="relative">
                                <img
                                    src={vendorData.image}
                                    alt={vendorData.name}
                                    className="w-28 h-28 rounded-3xl border-4 border-gray-100 shadow-lg"
                                />
                                {vendorData.verified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-2 border-2 border-white">
                                        <CheckCircle size={18} className="text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{vendorData.name}</h1>
                                    {vendorData.verified && (
                                        <div className="bg-green-100 px-2 py-1 rounded-full flex items-center gap-1">
                                            <Shield size={14} className="text-green-600" />
                                            <span className="text-xs font-semibold text-green-700">Verified</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600 font-medium text-lg mb-4">{vendorData.title}</p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
                                    <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-xl">
                                        <Star size={16} className="text-amber-400 fill-amber-400" />
                                        <span className="font-bold text-gray-900">{vendorData.rating}</span>
                                        <span className="text-gray-600">({vendorData.totalReviews} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={16} />
                                        <span>{vendorData.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} />
                                        <span>Since {vendorData.activeSince}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsFollowing(!isFollowing)}
                                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 ${isFollowing
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-gray-900 text-white hover:bg-black'
                                        }`}
                                >
                                    <Heart size={16} className={`inline mr-2 ${isFollowing ? 'fill-current text-red-500' : ''}`} />
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors">
                                    <Share2 size={16} className="text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2">
                            {/* Navigation Tabs */}
                            <div className="bg-white rounded-2xl shadow-sm mb-6 p-2">
                                <div className="flex">
                                    {['about', 'services', 'reviews'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex-1 px-6 py-3 font-semibold capitalize rounded-xl transition-all duration-200 ${activeTab === tab
                                                    ? 'bg-gray-900 text-white shadow-md'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'about' && (
                                <div className="bg-white rounded-2xl shadow-sm p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">About Me</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">{vendorData.description}</p>
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="space-y-4">
                                    {vendorData.services.map((service, index) => (
                                        <div key={index} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-900 text-lg mb-2">{service.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(service.rating)}
                                                        <span className="text-sm text-gray-500 ml-1">({service.rating})</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-900 mb-3">${service.price}</p>
                                                    <button className="bg-gray-900 text-white px-6 py-2 rounded-xl font-semibold hover:bg-black transition-colors flex items-center">
                                                        Book Now
                                                        <ArrowRight size={14} className="ml-2" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-4">
                                    {vendorData.reviews.map((review) => (
                                        <div key={review.id} className="bg-white rounded-2xl shadow-sm p-6">
                                            <div className="flex gap-4">
                                                <img
                                                    src={review.image}
                                                    alt={review.name}
                                                    className="w-14 h-14 rounded-2xl border-2 border-gray-100"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                        <span className="text-sm text-gray-500">{review.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <p className="text-gray-600 leading-relaxed">{review.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Stats</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                                            <Users size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{vendorData.totalJobs}</p>
                                            <p className="text-sm text-gray-500">Jobs Completed</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                                            <Clock size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{vendorData.responseTime}</p>
                                            <p className="text-sm text-gray-500">Avg Response Time</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                                            <Award size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-lg">{vendorData.category}</p>
                                            <p className="text-sm text-gray-500">Specialization</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Get in Touch</h3>
                                <div className="space-y-3">
                                    <button className="w-full bg-gray-900 text-white p-4 rounded-2xl font-semibold hover:bg-black transition-colors flex items-center justify-center gap-3">
                                        <MessageCircle size={18} />
                                        Send Message
                                    </button>
                                    <button className="w-full bg-gray-100 text-gray-700 p-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
                                        <Phone size={18} />
                                        Call Now
                                    </button>
                                    <button className="w-full bg-gray-100 text-gray-700 p-4 rounded-2xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-3">
                                        <Mail size={18} />
                                        Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailPage;