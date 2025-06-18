import { useEffect, useState } from 'react';
import { Heart, Star, Users, Bed, Maximize, MapPin, Clock } from 'lucide-react';
import { useHolidayLetsStore } from '../../Store/holidayLetsStore';
import { Link, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
// import { useHotelRoomStore } from '../../Store/hotelRoomStore';
// import LoadingSpinner from '../components/LoadingSpinner';

const PropertyShowcase = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [favorites, setFavorites] = useState(new Set());

    const { id } = useParams();


    // Sample property data matching the schema
    const [properties, setProperties] = useState();


    const { getProperties, properties: fetchedProperties, loading } = useHolidayLetsStore()


    useEffect(() => {
        getProperties(id)
    }, [id, getProperties]);


    useEffect(() => {
        if (fetchedProperties) {
            console.log(fetchedProperties);
            setProperties(fetchedProperties);
        }
    }, [fetchedProperties]);

    if (loading)
        return <LoadingSpinner />



    const toggleFavorite = (propertyId) => {
        setFavorites(prev => {
            const updated = new Set(prev);
            if (updated.has(propertyId)) {
                updated.delete(propertyId);
            } else {
                updated.add(propertyId);
            }
            return updated;
        });
    };


    const filters = [
        { key: 'all', label: 'All Properties', count: properties.length },
        { key: 'available', label: 'Available', count: properties.filter(p => p.availability === 'available').length },
        { key: 'house', label: 'Houses', count: properties.filter(p => p.propertyType === 'house').length },
        { key: 'apartment', label: 'Apartments', count: properties.filter(p => p.propertyType === 'apartment').length },
        { key: 'villa', label: 'Villas', count: properties.filter(p => p.propertyType === 'villa').length }
    ];

    const filteredProperties = properties.filter(property => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'available') return property.availability === 'available';
        if (['house', 'apartment', 'villa', 'condo', 'cabin', 'loft', 'bungalow'].includes(selectedFilter)) {
            return property.propertyType === selectedFilter;
        }
        return true;
    });

    const formatPropertyType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    const getPropertySize = (property) => {
        if (property.propertySize) {
            return `${property.propertySize} ${property.sizeUnit}`;
        }
        return 'Size not specified';
    };

    const getBedBathInfo = (property) => {
        const bedrooms = property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`;
        const bathrooms = `${property.bathrooms} bath`;
        return `${bedrooms}, ${bathrooms}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
            {/* Header */}
            <header className="py-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Premium Properties</h1>
                <p className="text-xl text-gray-600">Find your perfect stay with us.</p>
            </header>

            {/* Filter Buttons */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="flex flex-wrap justify-center gap-4">
                    {filters.map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setSelectedFilter(filter.key)}
                            className={`px-6 py-2 rounded-full font-semibold text-sm transition-colors duration-200
                                ${selectedFilter === filter.key
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                                }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Properties Grid or No Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredProperties.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No properties found</h2>
                        <p className="text-gray-600 mb-6">It looks like there are no properties under the selected filter.</p>
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-200"
                        >
                            View All Properties
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredProperties.map((property) => (
                            <div key={property._id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200">
                                {/* Image Section */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={property.images?.[0]?.imageUrl || '/api/placeholder/400/300'}
                                        alt={property.title}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Overlays */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            {formatPropertyType(property.propertyType)}
                                        </span>
                                        {property.availability === 'unavailable' && (
                                            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Unavailable
                                            </span>
                                        )}
                                        {property.availability === 'draft' && (
                                            <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Draft
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => toggleFavorite(property._id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${favorites.has(property._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                        />
                                    </button>

                                    {/* Price Badge */}
                                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-red-600">${property.pricePerNight}</div>
                                            <div className="text-xs text-gray-600">/night</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{property.title}</h3>
                                            <p className="text-red-600 font-semibold text-sm">{formatPropertyType(property.propertyType)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs text-gray-500">{property.city}</span>
                                        </div>
                                    </div>

                                    {/* Property Details */}
                                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{property.maxGuests} guests</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4" />
                                            <span>{getBedBathInfo(property)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Maximize className="w-4 h-4" />
                                            <span>{getPropertySize(property)}</span>
                                        </div>
                                    </div>



                                    {/* Features */}
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-2">
                                            {property.features?.slice(0, 3).map((feature, index) => (
                                                <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                    {feature}
                                                </span>
                                            ))}
                                            {property.features?.length > 3 && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                                                    +{property.features.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>



                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <a href={'/service/Holiday-Lets/details/' + property._id}
                                            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-2xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 text-center"
                                        >
                                            View Details

                                        </a>
                                        {property.availability === 'available' && (
                                            <button
                                                onClick={() => alert(`Book ${property.title}`)}
                                                className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-200"
                                            >
                                                Book Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default PropertyShowcase;