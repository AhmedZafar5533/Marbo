import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Calendar, MapPin, Users, Bed, Bath, Home, Clock, Shield, Info, Star, Heart,
    Share2, Camera, Wifi, Car, Utensils, Snowflake, Tv, Coffee, ChevronLeft,
    ChevronRight, CheckCircle, X, User, MessageCircle, Key, ArrowLeft, Plus,
    Minus, Eye, Award, Sparkles, Phone, Mail, Check
} from 'lucide-react';
import { useHolidayLetsStore } from '../../Store/holidayLetsStore';
import LoadingSpinner from '../components/LoadingSpinner';

const PropertyDetailPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const { id } = useParams();
    const [property, setProperty] = useState(null);

    const { getProperty, loading, property: fetchedProperty } = useHolidayLetsStore()

    useEffect(() => {
        getProperty(id)
    }, [id])

    useEffect(() => {
        if (fetchedProperty) {
            setProperty(fetchedProperty);
        }
    }, [fetchedProperty]);

    if (loading)
        return <LoadingSpinner />

    if (!property) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Home className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
                    <p className="text-gray-600">The property you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const imageUrls = property.images?.map(img => img.imageUrl) || [];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    };

    const getAvailabilityStatus = () => {
        switch (property.availability) {
            case 'available':
                return { text: 'Available Now', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: CheckCircle };
            case 'booked':
                return { text: 'Currently Booked', color: 'bg-gradient-to-r from-red-500 to-rose-500', icon: X };
            case 'maintenance':
                return { text: 'Under Maintenance', color: 'bg-gradient-to-r from-yellow-500 to-amber-500', icon: Clock };
            default:
                return { text: 'Status Unknown', color: 'bg-gradient-to-r from-gray-500 to-slate-500', icon: Info };
        }
    };

    const availabilityStatus = getAvailabilityStatus();
    const StatusIcon = availabilityStatus.icon;

    const calculateTotal = () => {
        if (!checkInDate || !checkOutDate) return 0;
        const days = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
        return (property.pricePerNight * days) + (property.cleaningFee || 0) + (property.securityDeposit || 0);
    };

    const getDaysDifference = () => {
        if (!checkInDate || !checkOutDate) return 0;
        return Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Enhanced Hero Section */}
            <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
                <div className="absolute inset-0">
                    {imageUrls.length > 0 ? (
                        <div className="relative w-full h-full">
                            <img
                                src={imageUrls[currentImageIndex]}
                                alt="Property hero"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center">
                            <div className="text-center text-white">
                                <Camera className="w-24 h-24 mx-auto mb-4 opacity-60" />
                                <p className="text-xl font-medium">No Images Available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Enhanced Navigation */}
                <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <button className="group bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back</span>
                        </button>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className="group bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
                            >
                                <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'group-hover:scale-110'}`} />
                            </button>
                            <button className="group bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl hover:bg-white/20 transition-all duration-300">
                                <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            {imageUrls.length > 0 && (
                                <button
                                    onClick={() => setIsImageModalOpen(true)}
                                    className="group bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
                                >
                                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Image Navigation */}
                {imageUrls.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="hidden md:block absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 z-10 group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="hidden md:block absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300 z-10 group"
                        >
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </>
                )}

                {/* Enhanced Property Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 text-white">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div className="flex flex-wrap items-center gap-3 mb-3 md:mb-0">
                                    <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-semibold shadow-lg">
                                        {property.propertyType?.charAt(0).toUpperCase() + property.propertyType?.slice(1) || 'Property'}
                                    </div>
                                    <div className="flex items-center bg-white/10 rounded-full px-3 py-1">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm font-medium">5.0 · 89 reviews</span>
                                    </div>
                                </div>
                                <div className={`${availabilityStatus.color} px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-2 self-start md:self-auto`}>
                                    <StatusIcon className="w-4 h-4" />
                                    <span>{availabilityStatus.text}</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text">
                                {property.title}
                            </h1>

                            <div className="flex items-center text-lg mb-6">
                                <MapPin className="w-5 h-5 mr-2 text-red-400" />
                                <span>{property.city}, {property.stateRegion}, {property.country}</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
                                <div className="flex items-center bg-white/10 rounded-xl p-3">
                                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                                    <span>{property.maxGuests} Guests</span>
                                </div>
                                <div className="flex items-center bg-white/10 rounded-xl p-3">
                                    <Bed className="w-5 h-5 mr-2 text-purple-400" />
                                    <span>{property.bedrooms} Bedrooms</span>
                                </div>
                                <div className="flex items-center bg-white/10 rounded-xl p-3">
                                    <Bath className="w-5 h-5 mr-2 text-cyan-400" />
                                    <span>{property.bathrooms} Bathrooms</span>
                                </div>
                                <div className="flex items-center bg-white/10 rounded-xl p-3">
                                    <Home className="w-5 h-5 mr-2 text-green-400" />
                                    <span>{property.propertySize} {property.sizeUnit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Image Dots */}
                {imageUrls.length > 1 && (
                    <div className="absolute bottom-6 right-6 flex space-x-2 z-10">
                        {imageUrls.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                        ? 'bg-white shadow-lg'
                                        : 'bg-white/50 hover:bg-white/75'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Enhanced Content Section */}
            <div className="relative -mt-12 z-20">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Enhanced Main Content */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Enhanced Description Card */}
                            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        About this amazing place
                                    </h2>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed mb-8 font-light">
                                    {property.description}
                                </p>

                                {/* Enhanced Access Description */}
                                {property.accessDescription && (
                                    <div className="border-t border-gray-200 pt-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                                <Key className="w-4 h-4 text-white" />
                                            </div>
                                            Getting around
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed font-light">
                                            {property.accessDescription}
                                        </p>
                                    </div>
                                )}

                                {/* Enhanced Host Interaction */}
                                {property.hostInteraction && (
                                    <div className="border-t border-gray-200 pt-8 mt-8">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                                                <MessageCircle className="w-4 h-4 text-white" />
                                            </div>
                                            Host interaction
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed font-light">
                                            {property.hostInteraction}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Amenities Card */}
                            {property.features && property.features.length > 0 && (
                                <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            What this place offers
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(showAllAmenities ? property.features : property.features.slice(0, 8)).map((feature, index) => (
                                            <div key={index} className="group flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 hover:shadow-lg">
                                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-gray-800 font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {property.features.length > 8 && (
                                        <button
                                            onClick={() => setShowAllAmenities(!showAllAmenities)}
                                            className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                        >
                                            {showAllAmenities ? 'Show less' : `Show all ${property.features.length} amenities`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Enhanced Location Card */}
                            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
                                        <MapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        Where you'll be
                                    </h3>
                                </div>
                                <div className="space-y-2 text-gray-700 mb-6">
                                    <p className="font-semibold text-lg">{property.addressLine1}</p>
                                    {property.addressLine2 && <p className="text-base">{property.addressLine2}</p>}
                                    <p className="text-base">{property.city}, {property.stateRegion} {property.postalCode}</p>
                                    <p className="text-base font-medium">{property.country}</p>
                                </div>
                                <div className="h-64 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl flex items-center justify-center overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10"></div>
                                    <div className="text-center z-10">
                                        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                                            <MapPin className="w-8 h-8 text-white" />
                                        </div>
                                        {property.mapLink ? (
                                            <a
                                                href={property.mapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-block"
                                            >
                                                View on Map
                                            </a>
                                        ) : (
                                            <p className="text-gray-600">Map location not available</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Policies Card */}
                            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        House rules & policies
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                                            <Clock className="w-6 h-6 mr-3 text-blue-500" />
                                            Check-in & Check-out
                                        </h4>
                                        <div className="space-y-4 text-gray-700">
                                            <div className="flex justify-between items-center">
                                                <span>Check-in:</span>
                                                <span className="font-semibold text-blue-600">{property.checkinTime}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Check-out:</span>
                                                <span className="font-semibold text-blue-600">{property.checkoutTime}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Quiet hours:</span>
                                                <span className="font-semibold text-blue-600">{property.quietHours}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                                            <Shield className="w-6 h-6 mr-3 text-red-500" />
                                            Property Rules
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                                                <div className="flex items-center">
                                                    <X className="w-5 h-5 text-red-500 mr-3" />
                                                    <span className="text-gray-800">
                                                        {property.smokingPolicy === 'no-smoking' ? 'No Smoking' : 'Smoking Allowed'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                                                <div className="flex items-center">
                                                    <X className="w-5 h-5 text-red-500 mr-3" />
                                                    <span className="text-gray-800">
                                                        {property.petPolicy === 'no-pets' ? 'No Pets' : 'Pets Allowed'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                                                <div className="flex items-center">
                                                    <X className="w-5 h-5 text-red-500 mr-3" />
                                                    <span className="text-gray-800">
                                                        {property.partyPolicy === 'no-parties' ? 'No Parties' : 'Parties Allowed'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Booking Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl xl:sticky xl:top-8">
                                <div className="mb-8">
                                    <div className="flex items-baseline mb-3">
                                        <span className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                            ${property.pricePerNight}
                                        </span>
                                        <span className="text-xl text-gray-600 ml-2">/ night</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center bg-yellow-50 rounded-full px-3 py-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                            ))}
                                            <span className="text-sm text-gray-600 ml-2 font-medium">5.0 · 89 reviews</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Booking Form */}
                                <div className="space-y-4 mb-8">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="border-2 border-gray-200 rounded-2xl p-4 hover:border-red-300 transition-all duration-300 focus-within:border-red-400 focus-within:shadow-lg">
                                            <label className="block text-xs font-bold text-gray-700 mb-2">CHECK-IN</label>
                                            <input
                                                type="date"
                                                value={checkInDate}
                                                onChange={(e) => setCheckInDate(e.target.value)}
                                                className="w-full text-sm border-0 p-0 focus:ring-0 bg-transparent font-medium"
                                            />
                                        </div>
                                        <div className="border-2 border-gray-200 rounded-2xl p-4 hover:border-red-300 transition-all duration-300 focus-within:border-red-400 focus-within:shadow-lg">
                                            <label className="block text-xs font-bold text-gray-700 mb-2">CHECK-OUT</label>
                                            <input
                                                type="date"
                                                value={checkOutDate}
                                                onChange={(e) => setCheckOutDate(e.target.value)}
                                                className="w-full text-sm border-0 p-0 focus:ring-0 bg-transparent font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="border-2 border-gray-200 rounded-2xl p-4 hover:border-red-300 transition-all duration-300">
                                        <label className="block text-xs font-bold text-gray-700 mb-2">GUESTS</label>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-700">Guests (max {property.maxGuests})</span>
                                            <div className="flex items-center space-x-3">
                                                <button
                                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <Minus className="w-4h-4" />
                                                </button>
                                                <span className="font-semibold text-lg w-8 text-center">{guestCount}</span>
                                                <button
                                                    onClick={() => setGuestCount(Math.min(property.maxGuests, guestCount + 1))}
                                                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Pricing Breakdown */}
                                {checkInDate && checkOutDate && (
                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span>${property.pricePerNight} × {getDaysDifference()} nights</span>
                                                <span>${property.pricePerNight * getDaysDifference()}</span>
                                            </div>
                                            {property.cleaningFee && (
                                                <div className="flex justify-between">
                                                    <span>Cleaning fee</span>
                                                    <span>${property.cleaningFee}</span>
                                                </div>
                                            )}
                                            {property.securityDeposit && (
                                                <div className="flex justify-between">
                                                    <span>Security deposit</span>
                                                    <span>${property.securityDeposit}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 mt-3">
                                            <div className="flex justify-between items-center font-bold text-lg">
                                                <span>Total</span>
                                                <span className="text-red-500">${calculateTotal()}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Enhanced Reserve Button */}
                                <button
                                    disabled={property.availability !== 'available'}
                                    className={`w-full py-4 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${property.availability === 'available'
                                            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                                            : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    {property.availability === 'available' ? 'Reserve' : 'Not Available'}
                                </button>

                                <p className="text-center text-sm text-gray-500 mt-4">
                                    You won't be charged yet
                                </p>

                                {/* Enhanced Host Contact */}
                                {/* <div className="border-t border-gray-200 pt-6 mt-6">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-500" />
                                        Contact Host
                                    </h4>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors">
                                            <MessageCircle className="w-5 h-5 text-blue-500" />
                                            <span className="text-blue-600 font-medium">Send Message</span>
                                        </button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center justify-center space-x-2 py-3 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors">
                                                <Phone className="w-4 h-4 text-green-500" />
                                                <span className="text-green-600 font-medium text-sm">Call</span>
                                            </button>
                                            <button className="flex items-center justify-center space-x-2 py-3 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors">
                                                <Mail className="w-4 h-4 text-purple-500" />
                                                <span className="text-purple-600 font-medium text-sm">Email</span>
                                            </button>
                                        </div>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Image Modal */}
            {isImageModalOpen && imageUrls.length > 0 && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                    <div className="relative max-w-6xl max-h-full">
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-3 rounded-2xl hover:bg-white/20 transition-all duration-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={imageUrls[currentImageIndex]}
                            alt="Property image"
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
                        />
                        {imageUrls.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {imageUrls.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                            ? 'bg-white shadow-lg'
                                            : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertyDetailPage;