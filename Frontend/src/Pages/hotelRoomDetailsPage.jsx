import React, { useState, useRef, useEffect } from 'react';
import { Calendar, MapPin, Users, Bed, Bath, Home, Clock, Shield, Info, Star, Heart, Share2, Camera, Wifi, Car, Utensils, Snowflake, Tv, Coffee, ChevronLeft, ChevronRight, CheckCircle, X, Menu } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useHotelRoomStore } from '../../Store/hotelRoomStore';
import LoadingSpinner from '../components/LoadingSpinner';

const RoomDetailPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showAllFeatures, setShowAllFeatures] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState({});
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const imageContainerRef = useRef(null);
    console.log('rendering')

    // Get room details and loading state from store
    const { getRoomDeatils, loading, roomDetails } = useHotelRoomStore();
    const { id } = useParams();

    // Fetch room details when component mounts or id changes
    useEffect(() => {
        if (id) {
            getRoomDeatils(id);
        }
    }, [id, getRoomDeatils]);

    // Load images when room data is available
    useEffect(() => {
        if (roomDetails?.images?.length > 0) {
            const loadImage = (src, index) => {
                const img = new Image();
                img.onload = () => {
                    setImagesLoaded(prev => ({ ...prev, [index]: true }));
                };
                img.onerror = () => {
                    setImagesLoaded(prev => ({ ...prev, [index]: false }));
                };console.log(src)
                img.src = src;
            };

            // Load current image and adjacent images
            const imagesToLoad = [
                currentImageIndex,
                (currentImageIndex + 1) % roomDetails.images.length,
                (currentImageIndex - 1 + roomDetails.images.length) % roomDetails.images.length
            ];

            imagesToLoad.forEach(index => {
                if (imagesLoaded[index] === undefined) {
                    loadImage(roomDetails.images[index].imageUrl, index);
                }
            });
        }
    }, [currentImageIndex, roomDetails?.images, imagesLoaded]);

    // Show loading spinner while data is being fetched
    if (loading || !roomDetails) {
        return <LoadingSpinner />;
    }

    // Touch handlers for mobile swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            nextImage();
        }
        if (isRightSwipe) {
            prevImage();
        }
    };

    const nextImage = () => {
        if (roomDetails?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % roomDetails.images.length);
        }
    };

    const prevImage = () => {
        if (roomDetails?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + roomDetails.images.length) % roomDetails.images.length);
        }
    };

    const scrollToBooking = () => {
        const bookingSection = document.getElementById('booking-section');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Safe access to room properties with defaults
    const room = {
        images: roomDetails.images || [],
        title: roomDetails.title || 'Room Title',
        serviceName: roomDetails.serviceName || 'Hotel Name',
        serviceLocation: roomDetails.serviceLocation || 'Location',
        maxGuests: roomDetails.maxGuests || 2,
        bedType: roomDetails.bedType || 'double',
        size: roomDetails.size || 25,
        sizeUnit: roomDetails.sizeUnit || 'sqm',
        roomType: roomDetails.roomType || 'standard',
        availability: roomDetails.availability || 'available',
        description: roomDetails.description || 'Room description not available.',
        features: roomDetails.features || [],
        price: roomDetails.price || 100,
        cleaningFee: roomDetails.cleaningFee || 25,
        serviceFee: roomDetails.serviceFee || 15,
        rating: roomDetails.rating || 4.9,
        reviewCount: roomDetails.reviewCount || 67
    };

    // Don't render if no images available
    if (!room.images.length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
                <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No images available for this room.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 pb-4 sm:pb-6 lg:pb-10">
            {/* Hero Section with Full-Screen Image */}
            <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen">
                <div
                    className="absolute inset-0"
                    ref={imageContainerRef}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {imagesLoaded[currentImageIndex] ? (
                        <img
                            src={room.images[currentImageIndex].imageUrl}
                            alt="Room hero"
                            className="w-full h-full object-cover transition-opacity duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                            <Camera className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                {/* Navigation Overlay - Improved for mobile
                <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 lg:p-6">
                    <div className="flex justify-between items-center">
                        <button className="bg-white/20 backdrop-blur-md text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full hover:bg-white/30 transition-all text-sm sm:text-base flex items-center">
                            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                            <span className="hidden xs:inline">Back</span>
                        </button>
                        <div className="flex space-x-2 sm:space-x-3">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className="bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all"
                            >
                                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                            <button className="bg-white/20 backdrop-blur-md text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-all">
                                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>
                </div> */}

                {/* Image Navigation - Now visible on all devices */}
                {room.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 sm:left-3 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2 lg:p-3 rounded-full hover:bg-white/30 transition-all z-10 touch-manipulation"
                        >
                            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 sm:right-3 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-2 lg:p-3 rounded-full hover:bg-white/30 transition-all z-10 touch-manipulation"
                        >
                            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                        </button>
                    </>
                )}

                {/* Mobile Book Now Button - Repositioned */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10 sm:hidden">
                    <button
                        onClick={scrollToBooking}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-full shadow-lg transition-all transform hover:scale-105 text-sm"
                    >
                        Book Now
                    </button>
                </div>

                {/* Room Info Overlay - Improved mobile layout */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                                <div className="flex items-center mb-2 sm:mb-0">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-400 fill-current" />
                                        ))}
                                        <span className="ml-2 text-xs sm:text-sm">{room.rating} • {room.reviewCount} reviews</span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-green-500/80 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto capitalize">
                                    {room.availability}
                                </div>
                            </div>

                            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight">
                                {room.title}
                            </h1>

                            <div className="flex items-center text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                                <span className="truncate">{room.serviceName} • {room.serviceLocation}</span>
                            </div>

                            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-4 lg:gap-6 text-xs sm:text-sm lg:text-base">
                                <div className="flex items-center min-w-0">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                    <span className="truncate">Up to {room.maxGuests}</span>
                                </div>
                                <div className="flex items-center min-w-0">
                                    <Bed className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                    <span className="truncate capitalize">{room.bedType}</span>
                                </div>
                                <div className="flex items-center min-w-0">
                                    <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                    <span className="truncate">{room.size} {room.sizeUnit}</span>
                                </div>
                                <div className="flex items-center min-w-0">
                                    <span className="capitalize bg-white/20 px-2 py-1 rounded-lg text-xs">
                                        {room.roomType}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image Dots - Improved for mobile */}
                {room.images.length > 1 && (
                    <div className="absolute bottom-20 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full">
                        {room.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all touch-manipulation ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Swipe indicator for mobile */}
                {room.images.length > 1 && (
                    <div className="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-xs text-center">
                        <div className="flex items-center space-x-2">
                            <ChevronLeft className="w-3 h-3" />
                            <span>Swipe for more photos</span>
                            <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="relative -mt-8 sm:-mt-12 lg:-mt-20 z-20">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {/* Main Content */}
                        <div className="xl:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                            {/* Description Card */}
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                                    About this room
                                </h2>
                                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-6">
                                    {room.description}
                                </p>

                                {/* Room Specifications */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-red-600">{room.size}</div>
                                        <div className="text-xs sm:text-sm text-gray-600 uppercase">{room.sizeUnit}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-red-600">{room.maxGuests}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Max Guests</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-red-600 capitalize">{room.bedType}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Bed Type</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl sm:text-2xl font-bold text-red-600 capitalize">{room.roomType}</div>
                                        <div className="text-xs sm:text-sm text-gray-600">Room Type</div>
                                    </div>
                                </div>
                            </div>

                            {/* Features Card */}
                            {room.features.length > 0 && (
                                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                                        Room features & amenities
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        {(showAllFeatures ? room.features : room.features.slice(0, 8)).map((feature, index) => (
                                            <div key={index} className="flex items-center p-3 sm:p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg sm:rounded-xl hover:from-red-100 hover:to-orange-100 transition-all">
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-sm sm:text-base text-gray-800 font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {room.features.length > 8 && (
                                        <button
                                            onClick={() => setShowAllFeatures(!showAllFeatures)}
                                            className="mt-4 sm:mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 text-sm sm:text-base touch-manipulation"
                                        >
                                            {showAllFeatures ? 'Show less' : `Show all ${room.features.length} features`}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Booking Sidebar */}
                        <div className="xl:col-span-1" id="booking-section">
                            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl xl:sticky xl:top-8">
                                <div className="mb-6 sm:mb-8">
                                    <div className="flex items-baseline mb-2">
                                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                            ${room.price}
                                        </span>
                                        <span className="text-base sm:text-lg lg:text-xl text-gray-600 ml-2">/ night</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-xs sm:text-sm text-gray-600 ml-2">{room.rating} • {room.reviewCount} reviews</span>
                                    </div>
                                </div>

                                {/* Booking Form */}
                                <form className="space-y-3 sm:space-y-4">
                                    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-red-300 transition-colors">
                                                <label className="block text-xs font-bold text-gray-700 mb-2">CHECK-IN</label>
                                                <input type="date" className="w-full text-sm border-0 p-0 focus:ring-0 bg-transparent" />
                                            </div>
                                            <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-red-300 transition-colors">
                                                <label className="block text-xs font-bold text-gray-700 mb-2">CHECK-OUT</label>
                                                <input type="date" className="w-full text-sm border-0 p-0 focus:ring-0 bg-transparent" />
                                            </div>
                                        </div>
                                        <div className="border-2 border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-red-300 transition-colors">
                                            <label className="block text-xs font-bold text-gray-700 mb-2">GUESTS</label>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">Guests (max {room.maxGuests})</span>
                                                <input type="number" min="1" max={room.maxGuests} defaultValue={1} className="w-16 text-center border-0 p-0 focus:ring-0 bg-transparent text-sm" />
                                            </div>
                                        </div>
                                    </div>


                                    <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all transform hover:scale-105 shadow-lg mb-4 sm:mb-6 text-sm sm:text-base touch-manipulation">
                                        Reserve Room
                                    </button>
                                </form>

                                <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">You won't be charged yet</p>

                                {/* Price Breakdown */}
                                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
                                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                                        <span>${room.price} × 3 nights</span>
                                        <span>${room.price * 3}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                                        <span>Cleaning fee</span>
                                        <span>${room.cleaningFee}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base text-gray-700">
                                        <span>Service fee</span>
                                        <span>${room.serviceFee}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg sm:text-xl text-gray-900 pt-3 sm:pt-4 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>${room.price * 3 + room.cleaningFee + room.serviceFee}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailPage;