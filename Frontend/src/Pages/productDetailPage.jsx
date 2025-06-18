import { useState, useEffect } from "react";
import { Heart, ArrowLeft, Share2, Check, Clock, MapPin, Star, Camera, MessageSquare, X } from "lucide-react";
import { useProductStore } from "../../Store/productsStore";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useOrderStore } from "../../Store/orderStore";

// Fallback gallery images from Unsplash
const fallbackGalleryImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800",
];

// Similar services with real images
const similarServices = [
    {
        id: "2",
        name: "Engagement Photography Session",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
    },
    {
        id: "3",
        name: "Event Photography Package",
        price: 1099.99,
        image: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600"
    }
];

export default function ServiceDetailPage() {
    const [isFavorite, setIsFavorite] = useState(false);
    const [activeImage, setActiveImage] = useState("");
    const [activeTab, setActiveTab] = useState("description");
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [serviceDetails, setServiceDetails] = useState(null);

    const { getProductById, fetchedProduct, loading } = useProductStore();

    const { addOrder, loading: loading2 } = useOrderStore()
    const { id } = useParams();

    // Format price to currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    useEffect(() => {
        if (id) {
            getProductById(id);
        }
    }, [getProductById, id]);

    useEffect(() => {
        if (fetchedProduct) {
            setServiceDetails(fetchedProduct);
            // Set the first available image as active
            if (fetchedProduct.serviceId?.image?.url) {
                setActiveImage(fetchedProduct.serviceId.image.url);
            } else if (fetchedProduct.images && fetchedProduct.images.length > 0) {
                setActiveImage(fetchedProduct.images[0].imageUrl);
            }
        }
    }, [fetchedProduct]);

    // Get all available images for the gallery
    const getAllImages = () => {
        if (!serviceDetails) return fallbackGalleryImages;

        const images = [];

        // Add main service image if available
        if (serviceDetails.serviceId?.image?.url) {
            images.push(serviceDetails.serviceId.image.url);
        }

        // Add product images
        if (serviceDetails.images && serviceDetails.images.length > 0) {
            serviceDetails.images.forEach(img => {
                if (img.imageUrl && !images.includes(img.imageUrl)) {
                    images.push(img.imageUrl);
                }
            });
        }

        // If no images available, use fallback
        if (images.length === 0) {
            return fallbackGalleryImages;
        }

        return images;
    };

    const openLightbox = (image) => {
        setLightboxImage(image);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const tabs = [
        { id: "description", label: "Overview", icon: <Camera size={16} /> },
        { id: "gallery", label: "Gallery", icon: <Star size={16} /> }
    ];

    // Generate included items based on features or use defaults
    const getIncludedItems = () => {
        if (serviceDetails?.features && serviceDetails.features.length > 0) {
            return serviceDetails.features;
        }
        return [
            "Professional service delivery",
            "Quality guarantee",
            "Customer support",
            "Timely completion"
        ];
    };

    if (loading || loading2 || !serviceDetails) {
        return (
            <LoadingSpinner />
        );
    }

    const buyHandler = async (id, price) => {
        addOrder({ id, price })
        console.log('Buying with id:', id, price)
    }

    const allImages = getAllImages();
    const includedItems = getIncludedItems();

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-800">
            {/* Modernized Header */}
            <header className="fixed top-0 left-0 right-0 z-10 transition-all duration-300 bg-transparent">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-neutral-100 transition"
                                aria-label="Go back"
                            >
                                <ArrowLeft size={20} className="text-neutral-800" />
                            </button>

                            <h1 className="ml-4 font-semibold text-lg transition-all duration-300 opacity-0">
                                {serviceDetails.productName}
                            </h1>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${isFavorite ? "bg-red-50" : "bg-white"
                                    } shadow-sm hover:bg-neutral-100 transition`}
                                onClick={() => setIsFavorite(!isFavorite)}
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                <Heart
                                    size={20}
                                    className={isFavorite ? "fill-red-500 text-red-500" : "text-neutral-800"}
                                />
                            </button>
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm hover:bg-neutral-100 transition"
                                aria-label="Share"
                            >
                                <Share2 size={20} className="text-neutral-800" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pb-16">
                {/* Hero Image Section with Left Side Gallery Controls */}
                <section className="relative h-[60vh] md:h-[70vh] bg-black overflow-hidden">
                    <img
                        src={activeImage || allImages[0]}
                        alt={serviceDetails.productName}
                        className="w-full h-full object-cover transition-all duration-700 ease-out"
                    />
                    {/* Simple overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Compact Vertical Gallery Controls */}
                    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20">
                        <div className="flex flex-col gap-2 py-3">
                            {allImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`relative group transition-all duration-500 cursor-pointer ${activeImage === img ? "scale-110" : "hover:scale-105"
                                        }`}
                                    onClick={() => setActiveImage(img)}
                                >
                                    <div className={`relative w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden transition-all duration-500 ${activeImage === img
                                        ? "ring-2 ring-white shadow-lg shadow-white/20"
                                        : "ring-1 ring-white/30 hover:ring-white/60 hover:shadow-md hover:shadow-black/50"
                                        }`}>
                                        <img
                                            src={img}
                                            alt={`Gallery ${idx + 1}`}
                                            className="w-full h-full object-cover transition-all duration-500"
                                        />
                                        {/* Dark hover overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                                    </div>

                                    {/* Smaller index number */}
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${activeImage === img
                                        ? "bg-white text-black text-[10px]"
                                        : "bg-black/70 text-white/90 group-hover:bg-black/90 text-[10px]"
                                        }`}>
                                        {idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Info Cards & Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                    {/* Service Info Card - Simplified and More Intuitive */}
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            {/* Service Info */}
                            <div className="flex-grow">
                                {/* Category Badge */}
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm font-medium mb-2">
                                    {serviceDetails.category}
                                </div>

                                {/* Service Title */}
                                <h1 className="text-2xl md:text-3xl font-bold">{serviceDetails.productName}</h1>

                                {/* Ratings */}
                                <div className="flex items-center mt-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={`${i < Math.floor(serviceDetails.serviceId?.rating || 0) ? "text-amber-400 fill-amber-400" : "text-neutral-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-neutral-600">
                                        {serviceDetails.serviceId?.rating || 0} ({Math.floor(Math.random() * 50) + 10} reviews)
                                    </span>
                                </div>

                                {/* Service Highlights */}
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <div className="flex items-center bg-neutral-50 px-4 py-2 rounded-lg">
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                                            <Check size={16} />
                                        </div>
                                        <span className="text-sm font-medium"> {serviceDetails.serviceId?.status || 'Available'}</span>
                                    </div>
                                    <div className="flex items-center bg-neutral-50 px-4 py-2 rounded-lg">
                                        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 mr-2 font-medium">
                                            {serviceDetails.serviceId?.vendorName?.charAt(0) || 'V'}
                                        </div>
                                        <span className="text-sm font-medium">{serviceDetails.serviceId?.vendorName || 'Vendor'}</span>
                                    </div>

                                    <div className="flex items-center bg-neutral-50 px-4 py-2 rounded-lg">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                                            <MapPin size={16} />
                                        </div>
                                        <span className="text-sm font-medium"> Location</span>
                                    </div>




                                </div>
                            </div>

                            {/* Price and Contact */}
                            <div className="flex flex-col items-start md:items-end space-y-3">
                                <div className="flex items-baseline">
                                    <p className="text-3xl font-bold text-neutral-900">{formatPrice(serviceDetails.price)}</p>
                                    <span className="ml-1 text-neutral-500 text-sm">/ service</span>
                                </div>
                                <button
                                    onClick={() => buyHandler(serviceDetails.serviceId?.id, serviceDetails.price)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2">
                                    <MessageSquare size={18} />
                                    Buy now
                                </button>
                            </div>
                        </div>

                        {/* Improved Tab Navigation */}
                        <div className="border-t border-neutral-200 mt-6 pt-4">
                            <nav className="flex gap-6 overflow-x-auto">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`pb-2 px-1 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id
                                            ? "border-red-600 text-red-600"
                                            : "border-transparent text-neutral-500 hover:text-neutral-800"
                                            }`}
                                        onClick={() => setActiveTab(tab.id)}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Tab Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                                {/* Description Tab */}
                                {activeTab === "description" && (
                                    <div className="animate-fadeIn">
                                        <h2 className="text-xl font-bold mb-4">About This Service</h2>
                                        <p className="text-neutral-700 leading-relaxed mb-6">
                                            {serviceDetails.description || "Professional service with attention to detail and customer satisfaction."}
                                        </p>

                                        {/* What's Included - More Visual */}
                                        <div className="mt-8">
                                            <h3 className="text-lg font-bold mb-4">What You'll Get</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {includedItems.map((item, idx) => (
                                                    <div key={idx} className="flex items-start p-3 bg-neutral-50 rounded-lg group hover:bg-neutral-100 transition-colors cursor-default">
                                                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 group-hover:scale-110 transition-transform">
                                                            <Check size={16} />
                                                        </div>
                                                        <span className="text-neutral-700 text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>




                                    </div>
                                )}

                                {/* Gallery Tab - Improved */}
                                {activeTab === "gallery" && (
                                    <div className="animate-fadeIn">
                                        <h2 className="text-xl font-bold mb-6">Photo Gallery</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {allImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="rounded-lg overflow-hidden aspect-square cursor-pointer relative group shadow-md hover:shadow-lg transition-shadow"
                                                    onClick={() => openLightbox(img)}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Gallery ${idx + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <div className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <circle cx="11" cy="11" r="8"></circle>
                                                                <path d="m21 21-4.35-4.35"></path>
                                                                <path d="M11 8v6"></path>
                                                                <path d="M8 11h6"></path>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Similar Services */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Similar Services You Might Like</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {similarServices.map((service, idx) => (
                                        <div key={idx} className="bg-neutral-50 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={service.image}
                                                    alt={service.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition">
                                                        <Heart size={16} className="text-neutral-600" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-neutral-900 mb-2 line-clamp-1">{service.name}</h3>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-red-600">{formatPrice(service.price)}</p>
                                                    <button className="text-sm bg-neutral-200 hover:bg-neutral-300 px-3 py-1 rounded-full transition-colors">View Details</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Vendor Info */}
                        <div className="lg:col-span-1">
                            {/* Vendor info card */}
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
                                <div className="p-5">
                                    <div className="flex items-center mb-4">
                                        <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 font-bold mr-3">
                                            {serviceDetails.serviceId?.vendorName?.charAt(0) || 'V'}
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{serviceDetails.serviceId?.vendorName || 'Vendor'}</h3>
                                            <p className="text-sm text-neutral-500">Service Provider</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        <div className="flex items-center text-sm text-neutral-600">
                                            <Clock size={16} className="mr-1" />
                                            <span>Response time: ~2 hours</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="text-neutral-600">Status:</span>
                                            <span className={`font-medium ${serviceDetails.serviceId?.status?.toLowerCase() === 'available'
                                                ? 'text-green-600'
                                                : 'text-yellow-600'
                                                }`}>
                                                {serviceDetails.serviceId?.status || 'Available'}
                                            </span>
                                        </div>

                                    </div>

                                    <button className="w-full bg-white border border-neutral-300 text-neutral-800 font-medium py-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    <button
                        className="absolute top-6 right-6 text-white h-12 w-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                        aria-label="Close lightbox"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Enlarged view"
                        className="max-w-screen-lg max-h-screen object-contain p-4"
                    />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                        <div className="flex gap-2 overflow-x-auto px-4">
                            {allImages.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition transform ${lightboxImage === img ? "border-white scale-110" : "border-transparent hover:border-white/60"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setLightboxImage(img);
                                    }}
                                >
                                    <img
                                        src={img}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}