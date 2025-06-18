import { useEffect, useState } from 'react';
import { Heart, Star, Users, Bed, Maximize } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useHotelRoomStore } from '../../Store/hotelRoomStore';
import LoadingSpinner from '../components/LoadingSpinner';

const HotelRoomsShowcase = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [favorites, setFavorites] = useState(new Set());
    const { id } = useParams();

    const [rooms, setHotelRooms] = useState([]);
    const { hotelRooms, getAllRooms, loading } = useHotelRoomStore();

    useEffect(() => {
        if (id) {
            getAllRooms(id);
        }
    }, [id, getAllRooms]);

    useEffect(() => {
        if (hotelRooms) {
            setHotelRooms(hotelRooms);
        }
    }, [hotelRooms]);

    const toggleFavorite = (roomId) => {
        setFavorites(prev => {
            const updated = new Set(prev);
            if (updated.has(roomId)) {
                updated.delete(roomId);
            } else {
                updated.add(roomId);
            }
            return updated;
        });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    const filters = [
        { key: 'all', label: 'All Rooms', count: rooms.length },
        { key: 'available', label: 'Available', count: rooms.filter(r => r.availability === 'available').length },
        { key: 'popular', label: 'Popular', count: rooms.filter(r => r.isPopular).length }
    ];

    const filteredRooms = rooms.filter(room => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'available') return room.availability === 'available';
        if (selectedFilter === 'suite') return room.type.includes('Suite');
        if (selectedFilter === 'popular') return room.isPopular;
        return true;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50">
            {/* Header */}
            <header className="py-8 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Luxurious Rooms</h1>
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

            {/* Rooms Grid or No Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {rooms.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No rooms available</h2>
                        <p className="text-gray-600 mb-6">There are currently no rooms listed for this hotel. Please check back later.</p>
                    </div>
                ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No rooms found</h2>
                        <p className="text-gray-600 mb-6">It looks like there are no rooms under the selected filter.</p>
                        <button
                            onClick={() => setSelectedFilter('all')}
                            className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-200"
                        >
                            View All Rooms
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredRooms.map((room) => (
                            <div key={room._id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200">
                                {/* Image Section */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={room.images[0].imageUrl}
                                        alt={room.title}
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Overlays */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {room.isPopular && (
                                            <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Popular
                                            </span>
                                        )}
                                        {room.availability === 'booked' && (
                                            <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                Booked
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => toggleFavorite(room.id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-200"
                                    >
                                        <Heart
                                            className={`w-5 h-5 ${favorites.has(room.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                        />
                                    </button>

                                    {/* Price Badge */}
                                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2">
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-red-600">${room.price}</div>
                                            <div className="text-xs text-gray-600">/night</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{room.title}</h3>
                                            <p className="text-red-600 font-semibold text-sm">{room.type}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-bold text-gray-800">{room.rating}</span>
                                            <span className="text-xs text-gray-500">({room.reviews})</span>
                                        </div>
                                    </div>

                                    {/* Room Details */}
                                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{room.maxGuests} guests</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Bed className="w-4 h-4" />
                                            <span>{room.bedType}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Maximize className="w-4 h-4" />
                                            <span>{room.size} sq ft</span>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div className="mb-6">
                                        <div className="flex flex-wrap gap-2">
                                            {room.features.slice(0, 3).map((feature, index) => (
                                                <span key={index} className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium">
                                                    {feature}
                                                </span>
                                            ))}
                                            {room.features.length > 3 && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                                                    +{room.features.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/service/hotel/room/details/${room._id}`}
                                            className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-2xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all duration-200 text-center"
                                        >
                                            View Details
                                        </Link>
                                        {room.availability === 'available' && (
                                            <button className="px-6 py-3 border-2 border-red-200 text-red-600 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-200">
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
        </div>
    );
};

export default HotelRoomsShowcase;
