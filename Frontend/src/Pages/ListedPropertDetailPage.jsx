import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Bed,
  Bath,
  Home,
  Clock,
  Shield,
  Info,
  Star,
  Heart,
  Share2,
  Camera,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Tv,
  Coffee,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  User,
  MessageCircle,
  Key,
  ArrowLeft,
  Plus,
  Minus,
  Eye,
  Award,
  Sparkles,
  Phone,
  Mail,
  Check,
  ShoppingCart,
  AlertCircle,
  Building,
  TreePine,
  Briefcase,
  Ruler,
  Layers,
  Compass,
  Droplets,
  Zap,
  FileText,
  DollarSign,
  HandHeart,
  CreditCard,
  Truck,
  School,
  Hospital,
  ShoppingBag,
  Fuel,
  Building2,
  Mountain,
  Warehouse,
} from "lucide-react";

// Mock property data - in real app this would come from API/store
const mockProperty = {
  id: "1",
  title: "Luxurious 3BHK Villa with Garden",
  propertyType: "villa",
  salePrice: 2500000,
  propertyStatus: "available",
  description:
    "Experience luxury living in this beautifully designed 3BHK villa featuring modern amenities, spacious rooms, and a private garden. Perfect for families looking for comfort and elegance in a prime location.",
  features: [
    "Swimming Pool",
    "Garden",
    "Parking",
    "Security",
    "Power Backup",
    "Elevator",
    "Gym",
    "Club House",
    "Children Play Area",
    "24/7 Water Supply",
    "Internet Ready",
    "Intercom",
  ],
  images: [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800",
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
    },
  ],

  // Building specific fields
  bedrooms: 3,
  bathrooms: 3,
  floors: 2,
  totalFloors: 2,
  propertySize: 2200,
  sizeUnit: "sqft",
  buildingAge: 2,
  furnishingStatus: "semi-furnished",
  facing: "east",

  // Land specific fields (for land type properties)
  landArea: 3000,
  landUnit: "sqft",
  landType: "residential",
  soilType: "clay",
  waterAvailability: "bore well",
  electricityAvailability: "available",
  roadAccess: "metalled road",

  // Commercial specific fields
  builtUpArea: 1800,
  carpetArea: 1600,
  floorNumber: "Ground Floor",
  washrooms: 2,
  cafeteria: "yes",
  conferenceRoom: "no",
  reception: "yes",

  // Location fields
  addressLine1: "123 Green Valley Society",
  addressLine2: "Near City Mall",
  city: "Mumbai",
  stateRegion: "Maharashtra",
  postalCode: "400001",
  country: "India",
  mapLink: "https://maps.google.com",

  // Legal & Additional
  ownershipType: "freehold",
  approvals: ["RERA", "NOC", "Building Plan Approved", "Occupancy Certificate"],
  nearbyFacilities: [
    "School",
    "Hospital",
    "Shopping Mall",
    "Bank",
    "Metro Station",
    "Park",
  ],
  parkingSpaces: 2,

  negotiable: true,
  readyToMove: true,
  loanAvailable: true,
};

const PropertyDetailPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showInterest, setShowInterest] = useState(false);

  const { id } = useParams();

  // In real app, this would fetch from API/store
  const property = mockProperty;
  const loading = false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!property && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Home className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property not found
          </h2>
          <p className="text-gray-600">
            The property you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const imageUrls = property.images?.map((img) => img.imageUrl) || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + imageUrls.length) % imageUrls.length
    );
  };

  const getStatusInfo = () => {
    switch (property.propertyStatus) {
      case "available":
        return {
          text: "Available",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          icon: CheckCircle,
        };
      case "sold":
        return {
          text: "Sold",
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          icon: X,
        };
      case "under-offer":
        return {
          text: "Under Offer",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          icon: Clock,
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          icon: Info,
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getPropertyTypeIcon = () => {
    switch (property.propertyType?.toLowerCase()) {
      case "apartment":
      case "flat":
        return Building2;
      case "villa":
      case "house":
        return Home;
      case "land":
      case "plot":
        return Mountain;
      case "commercial":
      case "office":
        return Briefcase;
      case "warehouse":
        return Warehouse;
      default:
        return Home;
    }
  };

  const PropertyTypeIcon = getPropertyTypeIcon();

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${price.toFixed(1)} $`;
    } else if (price >= 100000) {
      return `${price.toFixed(1)} $`;
    }
    return `${price.toLocaleString()}`;
  };

  const handleShowInterest = () => {
    setShowInterest(true);
    setTimeout(() => setShowInterest(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="relative bg-gray-100">
        <div className="absolute top-0 w-full z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <button className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/20 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full transition-colors ${
                    isLiked
                      ? "bg-red-600 text-white"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>
                <button className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                {imageUrls.length > 0 && (
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="hidden sm:flex items-center space-x-2 px-3 py-2 border border-white/70 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View Photos</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative">
          <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1] overflow-hidden bg-gray-200">
            {imageUrls.length > 0 ? (
              <div className="relative w-full h-full group">
                <img
                  src={imageUrls[currentImageIndex]}
                  alt="Property"
                  className="w-full h-full object-cover"
                />

                {/* Image Navigation */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="hidden md:flex absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white items-center justify-center rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="hidden md:flex absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white items-center justify-center rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">No Images Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Image Indicators */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center space-x-1">
                  <PropertyTypeIcon className="w-4 h-4" />
                  <span>
                    {property.propertyType?.charAt(0).toUpperCase() +
                      property.propertyType?.slice(1)}
                  </span>
                </span>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    4.8 · 12 reviews
                  </span>
                </div>
                <div
                  className={`flex items-center space-x-1 px-3 py-1 ${statusInfo.bgColor} rounded-full`}
                >
                  <StatusIcon className={`w-4 h-4 ${statusInfo.textColor}`} />
                  <span
                    className={`text-sm font-medium ${statusInfo.textColor}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2 text-red-500" />
                <span>
                  {property.city}, {property.stateRegion}, {property.country}
                </span>
              </div>

              {/* Property Specs - Conditional based on property type */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Common for residential properties */}
                {(property.propertyType === "apartment" ||
                  property.propertyType === "villa" ||
                  property.propertyType === "house") && (
                  <>
                    <div className="flex items-center bg-gray-50 rounded-xl p-3">
                      <Bed className="w-5 h-5 mr-3 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Bedrooms</p>
                        <p className="font-semibold">{property.bedrooms}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-xl p-3">
                      <Bath className="w-5 h-5 mr-3 text-red-500" />
                      <div>
                        <p className="text-sm text-gray-600">Bathrooms</p>
                        <p className="font-semibold">{property.bathrooms}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Size info */}
                <div className="flex items-center bg-gray-50 rounded-xl p-3">
                  <Ruler className="w-5 h-5 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-semibold">
                      {property.propertySize} {property.sizeUnit}
                    </p>
                  </div>
                </div>

                {/* Floors for buildings */}
                {property.floors && (
                  <div className="flex items-center bg-gray-50 rounded-xl p-3">
                    <Layers className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Floors</p>
                      <p className="font-semibold">{property.floors}</p>
                    </div>
                  </div>
                )}

                {/* Parking */}
                {property.parkingSpaces && (
                  <div className="flex items-center bg-gray-50 rounded-xl p-3">
                    <Car className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Parking</p>
                      <p className="font-semibold">
                        {property.parkingSpaces} spaces
                      </p>
                    </div>
                  </div>
                )}

                {/* Land area for land properties */}
                {property.propertyType === "land" && property.landArea && (
                  <div className="flex items-center bg-gray-50 rounded-xl p-3">
                    <Mountain className="w-5 h-5 mr-3 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Land Area</p>
                      <p className="font-semibold">
                        {property.landArea} {property.landUnit}
                      </p>
                    </div>
                  </div>
                )}

                {/* Commercial specific */}
                {property.propertyType === "commercial" && (
                  <>
                    {property.floorNumber && (
                      <div className="flex items-center bg-gray-50 rounded-xl p-3">
                        <Building className="w-5 h-5 mr-3 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Floor</p>
                          <p className="font-semibold">
                            {property.floorNumber}
                          </p>
                        </div>
                      </div>
                    )}
                    {property.washrooms && (
                      <div className="flex items-center bg-gray-50 rounded-xl p-3">
                        <Bath className="w-5 h-5 mr-3 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Washrooms</p>
                          <p className="font-semibold">{property.washrooms}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Additional Property Details */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {property.buildingAge && (
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-sm text-blue-600 font-medium">
                      {property.buildingAge} years old
                    </p>
                  </div>
                )}
                {property.facing && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Compass className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <p className="text-sm text-green-600 font-medium">
                      {property.facing} facing
                    </p>
                  </div>
                )}
                {property.furnishingStatus && (
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Home className="w-5 h-5 mx-auto text-purple-600 mb-1" />
                    <p className="text-sm text-purple-600 font-medium">
                      {property.furnishingStatus}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Land Specific Details */}
            {property.propertyType === "land" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Land Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {property.landType && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <TreePine className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Land Type</p>
                        <p className="font-semibold">{property.landType}</p>
                      </div>
                    </div>
                  )}
                  {property.soilType && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <Mountain className="w-5 h-5 text-brown-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Soil Type</p>
                        <p className="font-semibold">{property.soilType}</p>
                      </div>
                    </div>
                  )}
                  {property.waterAvailability && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <Droplets className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Water</p>
                        <p className="font-semibold">
                          {property.waterAvailability}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.electricityAvailability && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Electricity</p>
                        <p className="font-semibold">
                          {property.electricityAvailability}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.roadAccess && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Road Access</p>
                        <p className="font-semibold">{property.roadAccess}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Commercial Specific Details */}
            {property.propertyType === "commercial" && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Commercial Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.builtUpArea && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <Building className="w-5 h-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Built-up Area</p>
                        <p className="font-semibold">
                          {property.builtUpArea} sqft
                        </p>
                      </div>
                    </div>
                  )}
                  {property.carpetArea && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <Ruler className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Carpet Area</p>
                        <p className="font-semibold">
                          {property.carpetArea} sqft
                        </p>
                      </div>
                    </div>
                  )}
                  {property.cafeteria && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <Coffee className="w-5 h-5 text-orange-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Cafeteria</p>
                        <p className="font-semibold">{property.cafeteria}</p>
                      </div>
                    </div>
                  )}
                  {property.reception && (
                    <div className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <User className="w-5 h-5 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Reception</p>
                        <p className="font-semibold">{property.reception}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features/Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(showAllFeatures
                    ? property.features
                    : property.features.slice(0, 8)
                  ).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <Check className="w-3 h-3 text-red-600" />
                      </div>
                      <span className="text-gray-800">{feature}</span>
                    </div>
                  ))}
                </div>
                {property.features.length > 8 && (
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="mt-6 px-6 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    {showAllFeatures
                      ? "Show less"
                      : `Show all ${property.features.length} features`}
                  </button>
                )}
              </div>
            )}

            {/* Legal & Approvals */}
            {property.approvals && property.approvals.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-red-500" />
                  Legal Approvals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.approvals.map((approval, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-green-800 font-medium">
                        {approval}
                      </span>
                    </div>
                  ))}
                </div>
                {property.ownershipType && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-blue-800 font-medium">
                        Ownership Type: {property.ownershipType}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nearby Facilities */}
            {property.nearbyFacilities &&
              property.nearbyFacilities.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Nearby Facilities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.nearbyFacilities.map((facility, index) => {
                      let icon = MapPin;
                      let colorClass = "text-gray-600";

                      if (facility.toLowerCase().includes("school")) {
                        icon = School;
                        colorClass = "text-blue-600";
                      } else if (facility.toLowerCase().includes("hospital")) {
                        icon = Hospital;
                        colorClass = "text-red-600";
                      } else if (
                        facility.toLowerCase().includes("mall") ||
                        facility.toLowerCase().includes("shopping")
                      ) {
                        icon = ShoppingBag;
                        colorClass = "text-green-600";
                      } else if (facility.toLowerCase().includes("bank")) {
                        icon = CreditCard;
                        colorClass = "text-purple-600";
                      } else if (
                        facility.toLowerCase().includes("metro") ||
                        facility.toLowerCase().includes("station")
                      ) {
                        icon = Truck;
                        colorClass = "text-orange-600";
                      }

                      const IconComponent = icon;

                      return (
                        <div
                          key={index}
                          className="flex items-center p-3 border border-gray-200 rounded-lg"
                        >
                          <IconComponent
                            className={`w-5 h-5 mr-3 ${colorClass}`}
                          />
                          <span className="text-gray-800">{facility}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Location
              </h3>
              <div className="space-y-1 text-gray-700 mb-6">
                <p className="font-semibold">{property.addressLine1}</p>
                {property.addressLine2 && <p>{property.addressLine2}</p>}
                <p>
                  {property.city}, {property.stateRegion} {property.postalCode}
                </p>
                <p className="font-medium">{property.country}</p>
              </div>
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-red-600" />
                  </div>
                  {property.mapLink ? (
                    <a
                      href={property.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      View on Map
                    </a>
                  ) : (
                    <p className="text-gray-600">Map location not available</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Price & Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {formatPrice(property.salePrice)}
                </div>
                {/* {property.negotiable && (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    <HandHeart className="w-4 h-4 mr-1" />
                    Negotiable
                  </span>
                )} */}
              </div>

              {/* Special Features */}
              <div className="space-y-3 mb-6">
                {property.readyToMove && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">
                        Ready to Move
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleShowInterest}
                  disabled={
                    showInterest || property.propertyStatus !== "available"
                  }
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {showInterest ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Interest Sent!</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      <span>Show Interest</span>
                    </>
                  )}
                </button>

                <button className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Schedule Site Visit
                </button>
              </div>

              {/* Property ID */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-center text-sm text-gray-600">
                  Property ID:{" "}
                  <span className="font-mono font-semibold">{property.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl">
            <img
              src={imageUrls[currentImageIndex]}
              alt="Property view"
              className="w-full h-auto rounded-lg"
            />
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Image indicators inside modal */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
