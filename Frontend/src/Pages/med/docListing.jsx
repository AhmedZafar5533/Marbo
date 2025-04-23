import { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, MessageCircle, Building, Star, Calendar, ChevronDown, Filter, X, Heart, ChevronRight, Grid, List } from 'lucide-react';

export default function DoctorsListingPage() {
  const [activeCategory, setActiveCategory] = useState('All Doctor');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    location: '',
    priceRange: '',
    availability: ''
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const categories = [
    { name: 'All Doctor', count: null },
    { name: 'Nutritionist', count: 40 },
    { name: 'Dentist', count: 12 },
    { name: 'Surgeon', count: 14 },
    { name: 'Psychologist', count: 24 },
  ];
  
  const locations = [
    'All Locations',
    'Jakarta',
    'Surabaya',
    'Bandung',
    'Yogyakarta',
    'Malang',
    'Madura'
  ];
  
  const priceRanges = [
    'All Prices',
    'Under Rp. 100.000',
    'Rp. 100.000 - Rp. 200.000',
    'Above Rp. 200.000'
  ];
  
  const availabilityOptions = [
    'Any Time',
    'Today',
    'Tomorrow',
    'This Week'
  ];
  
  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];
  
  const doctors = [
    {
      id: 1,
      name: 'Dr. Boger Bojinov',
      specialty: 'Nutritionist',
      price: 'Rp. 150.000',
      priceValue: 150000,
      location: 'RS. Rajawali Indah, Madura',
      city: 'Madura',
      image: '/api/placeholder/250/250',
      rating: 4.9,
      reviews: 124,
      available: 'Today, 14:00',
      availableSlots: [
        { day: 'Today', time: '14:00' },
        { day: 'Today', time: '16:30' },
        { day: 'Tomorrow', time: '10:15' },
        { day: 'Tomorrow', time: '13:45' },
      ],
      experience: '12 years',
      education: 'University of Indonesia',
      languages: ['English', 'Bahasa Indonesia']
    },
    {
      id: 2,
      name: 'Dr. Daffa Toldo',
      specialty: 'Surgeon',
      price: 'Rp. 120.000',
      priceValue: 120000,
      location: 'RS. Keraton, Surabaya',
      city: 'Surabaya',
      image: '/api/placeholder/250/250',
      rating: 4.7,
      reviews: 98,
      available: 'Today, 16:30',
      availableSlots: [
        { day: 'Today', time: '16:30' },
        { day: 'Tomorrow', time: '09:00' },
        { day: 'Tomorrow', time: '14:30' },
      ],
      experience: '8 years',
      education: 'Airlangga University',
      languages: ['English', 'Bahasa Indonesia', 'Japanese']
    },
    {
      id: 3,
      name: 'Dr. Bayu Samsul',
      specialty: 'Dentist',
      price: 'Rp. 200.000',
      priceValue: 200000,
      location: 'RS. Kemuning, Malang',
      city: 'Malang',
      image: '/api/placeholder/250/250',
      rating: 4.8,
      reviews: 156,
      available: 'Tomorrow, 09:15',
      availableSlots: [
        { day: 'Tomorrow', time: '09:15' },
        { day: 'Tomorrow', time: '11:30' },
        { day: 'Friday', time: '13:00' },
      ],
      experience: '15 years',
      education: 'Brawijaya University',
      languages: ['English', 'Bahasa Indonesia']
    },
    {
      id: 4,
      name: 'Dr. John Smith',
      specialty: 'Nutritionist',
      price: 'Rp. 180.000',
      priceValue: 180000,
      location: 'RS. Medika, Jakarta',
      city: 'Jakarta',
      image: '/api/placeholder/250/250',
      rating: 4.6,
      reviews: 87,
      available: 'Today, 15:45',
      availableSlots: [
        { day: 'Today', time: '15:45' },
        { day: 'Tomorrow', time: '10:30' },
        { day: 'Thursday', time: '14:15' },
      ],
      experience: '10 years',
      education: 'Harvard Medical School',
      languages: ['English', 'Bahasa Indonesia', 'Mandarin']
    },
    {
      id: 5,
      name: 'Dr. Sarah Chen',
      specialty: 'Surgeon',
      price: 'Rp. 250.000',
      priceValue: 250000,
      location: 'RS. Premier, Bandung',
      city: 'Bandung',
      image: '/api/placeholder/250/250',
      rating: 4.9,
      reviews: 210,
      available: 'Tomorrow, 11:30',
      availableSlots: [
        { day: 'Tomorrow', time: '11:30' },
        { day: 'Friday', time: '09:00' },
        { day: 'Friday', time: '15:30' },
      ],
      experience: '18 years',
      education: 'Johns Hopkins University',
      languages: ['English', 'Bahasa Indonesia', 'Mandarin', 'Cantonese']
    },
    {
      id: 6,
      name: 'Dr. Indah Laku',
      specialty: 'Psychologist',
      price: 'Rp. 175.000',
      priceValue: 175000,
      location: 'RS. Mentari, Yogyakarta',
      city: 'Yogyakarta',
      image: '/api/placeholder/250/250',
      rating: 4.8,
      reviews: 134,
      available: 'Today, 17:00',
      availableSlots: [
        { day: 'Today', time: '17:00' },
        { day: 'Tomorrow', time: '13:15' },
        { day: 'Thursday', time: '10:00' },
      ],
      experience: '9 years',
      education: 'Gadjah Mada University',
      languages: ['English', 'Bahasa Indonesia', 'Japanese']
    }
  ];
  
  // Filter and sort doctors
  const filterAndSortDoctors = () => {
    let filtered = doctors.filter(doctor => {
      // Filter by category
      if (activeCategory !== 'All Doctor' && doctor.specialty !== activeCategory) {
        return false;
      }
      
      // Filter by location
      if (activeFilters.location && activeFilters.location !== 'All Locations' && 
          !doctor.city.includes(activeFilters.location) && 
          !doctor.location.includes(activeFilters.location)) {
        return false;
      }
      
      // Filter by price range
      if (activeFilters.priceRange) {
        if (activeFilters.priceRange === 'Under Rp. 100.000' && doctor.priceValue >= 100000) {
          return false;
        } else if (activeFilters.priceRange === 'Rp. 100.000 - Rp. 200.000' && 
                  (doctor.priceValue < 100000 || doctor.priceValue > 200000)) {
          return false;
        } else if (activeFilters.priceRange === 'Above Rp. 200.000' && doctor.priceValue <= 200000) {
          return false;
        }
      }
      
      // Filter by availability
      if (activeFilters.availability && activeFilters.availability !== 'Any Time') {
        const availabilityDay = activeFilters.availability.toLowerCase();
        if (!doctor.availableSlots.some(slot => slot.day.toLowerCase().includes(availabilityDay))) {
          return false;
        }
      }
      
      // Filter by search query
      if (searchQuery) {
        return doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
               doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
               doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
      }
      
      return true;
    });
    
    // Sort doctors
    switch (sortBy) {
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        filtered = filtered.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price_high':
        filtered = filtered.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'recommended':
      default:
        // Sort by a combination of rating and reviews
        filtered = filtered.sort((a, b) => (b.rating * Math.log(b.reviews)) - (a.rating * Math.log(a.reviews)));
    }
    
    return filtered;
  };
  
  const filteredDoctors = filterAndSortDoctors();
  
  // Toggle doctor in favorites
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setActiveCategory('All Doctor');
    setSearchQuery('');
    setActiveFilters({
      location: '',
      priceRange: '',
      availability: ''
    });
  };
  
  // Check if active filters are applied
  const hasActiveFilters = () => {
    return activeCategory !== 'All Doctor' || 
           searchQuery !== '' || 
           Object.values(activeFilters).some(filter => filter && filter !== 'All Locations' && filter !== 'Any Time' && filter !== 'All Prices');
  };
  
  const [expandedDoctorId, setExpandedDoctorId] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState({});
  
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-5">
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search doctors, specialties, or locations..."
              className="block w-full pl-12 pr-10 py-3 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute inset-y-0 right-12 flex items-center px-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
            <button className="absolute inset-y-0 right-0 flex items-center px-4 text-blue-600">
              <span className="text-sm font-medium">⌘K</span>
            </button>
          </div>
        </div>
        
        {/* Category tabs */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-nowrap overflow-x-auto gap-2 py-1 hide-scrollbar">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`whitespace-nowrap px-5 py-3 rounded-full transition-all text-sm ${
                    activeCategory === category.name 
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  {category.name}
                  {category.count && (
                    <span className={`ml-2 text-xs ${activeCategory === category.name ? 'text-blue-500' : 'text-gray-500'}`}>
                      ({category.count})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter section */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <button 
            className="flex items-center text-sm font-medium text-blue-600"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-2" />
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button 
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} />
              </button>
              <button 
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Expanded filter options */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeFilters.location}
                  onChange={(e) => setActiveFilters({...activeFilters, location: e.target.value})}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeFilters.priceRange}
                  onChange={(e) => setActiveFilters({...activeFilters, priceRange: e.target.value})}
                >
                  {priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeFilters.availability}
                  onChange={(e) => setActiveFilters({...activeFilters, availability: e.target.value})}
                >
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Active filters */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {activeCategory !== 'All Doctor' && (
              <div className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full flex items-center">
                {activeCategory}
                <button 
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                  onClick={() => setActiveCategory('All Doctor')}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {searchQuery && (
              <div className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full flex items-center">
                Search: {searchQuery.length > 15 ? searchQuery.substring(0, 15) + '...' : searchQuery}
                <button 
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={14} />
                </button>
              </div>
            )}
            
            {Object.entries(activeFilters).map(([key, value]) => {
              if (value && value !== 'All Locations' && value !== 'Any Time' && value !== 'All Prices') {
                return (
                  <div key={key} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full flex items-center">
                    {value}
                    <button 
                      className="ml-1.5 text-blue-500 hover:text-blue-700"
                      onClick={() => setActiveFilters({...activeFilters, [key]: ''})}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              }
              return null;
            })}
            
            <button 
              className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1.5 transition-colors"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Results count */}
      <div className="container mx-auto px-4 pb-2">
        <div className="text-sm text-gray-600">
          {filteredDoctors.length} doctors found
        </div>
      </div>
      
      {/* Loading state */}
      {loading ? (
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            <p className="mt-4 text-gray-600">Finding the best doctors for you...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Doctor Cards */}
          {viewMode === 'grid' ? (
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
                  >
                    <div className="h-52 bg-gray-100 flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-medium ml-1 text-gray-800">{doctor.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({doctor.reviews})</span>
                      </div>
                      <button 
                        className={`absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full ${
                          favorites.includes(doctor.id) 
                            ? 'bg-red-50 text-red-500' 
                            : 'bg-white bg-opacity-90 text-gray-400 hover:text-red-500'
                        }`}
                        onClick={() => toggleFavorite(doctor.id)}
                      >
                        <Heart size={16} className={favorites.includes(doctor.id) ? 'fill-red-500' : ''} />
                      </button>
                    </div>
                    <div className="p-5">
                      <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-2">
                        {doctor.specialty}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                      
                      <div className="flex items-center text-gray-600 text-sm mt-3">
                        <Building size={14} className="mr-2 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{doctor.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm mt-2">
                        <DollarSign size={14} className="mr-2 text-gray-500 flex-shrink-0" />
                        <span>{doctor.price}</span>
                      </div>
                      <div className="flex items-center text-green-600 text-sm mt-2">
                        <Calendar size={14} className="mr-2 flex-shrink-0" />
                        <span>{doctor.available}</span>
                      </div>
                      
                      {/* Time slots */}
                      {expandedDoctorId === doctor.id && (
                        <div className="mt-4 animate-fadeIn">
                          <p className="text-xs font-medium text-gray-700 mb-2">Available time slots:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {doctor.availableSlots.map((slot, idx) => (
                              <button 
                                key={idx}
                                className={`text-xs px-3 py-2 rounded-lg border ${
                                  selectedTimeSlot[doctor.id] === idx 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => setSelectedTimeSlot({...selectedTimeSlot, [doctor.id]: idx})}
                              >
                                {slot.day}, {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-5 flex gap-2">
                        <button 
                          className={`flex-1 py-3 ${
                            expandedDoctorId === doctor.id && selectedTimeSlot[doctor.id] !== undefined
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : expandedDoctorId === doctor.id 
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                          } text-white rounded-xl transition-colors font-medium`}
                          onClick={() => {
                            if (expandedDoctorId === doctor.id) {
                              if (selectedTimeSlot[doctor.id] !== undefined) {
                                alert(`Appointment booked with ${doctor.name} for ${doctor.availableSlots[selectedTimeSlot[doctor.id]].day} at ${doctor.availableSlots[selectedTimeSlot[doctor.id]].time}`);
                                setExpandedDoctorId(null);
                                setSelectedTimeSlot({});
                              }
                            } else {
                              setExpandedDoctorId(doctor.id);
                            }
                          }}
                        >
                          {expandedDoctorId === doctor.id 
                            ? (selectedTimeSlot[doctor.id] !== undefined ? 'Confirm Booking' : 'Select a Time')
                            : 'Book Appointment'}
                        </button>
                        <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                          <MessageCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {filteredDoctors.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-40 h-40 bg-gray-100 overflow-hidden relative">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          className={`absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full ${
                            favorites.includes(doctor.id) 
                              ? 'bg-red-50 text-red-500' 
                              : 'bg-white bg-opacity-90 text-gray-400 hover:text-red-500'
                          }`}
                          onClick={() => toggleFavorite(doctor.id)}
                        >
                          <Heart size={16} className={favorites.includes(doctor.id) ? 'fill-red-500' : ''} />
                        </button>
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                            {doctor.specialty}
                          </div>
                          <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                            <Star size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-medium ml-1 text-gray-800">{doctor.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({doctor.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="md:flex md:justify-between md:items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
                            <div className="text-xs text-gray-500 mt-1">{doctor.experience} experience • {doctor.education}</div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mt-3">
                              <div className="flex items-center text-gray-600 text-sm">
                                <Building size={14} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span className="truncate">{doctor.location}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm">
                                <DollarSign size={14} className="mr-2 text-gray-500 flex-shrink-0" />
                                <span>{doctor.price}</span>
                              </div>
                              <div className="flex items-center text-green-600 text-sm">
                                <Calendar size={14} className="mr-2 flex-shrink-0" />
                                <span>{doctor.available}</span>
                              </div>
                              <div className="flex items-center text-gray-600 text-sm">
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {doctor.languages.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 md:mt-0 md:text-right">
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4">
                              <button 
                                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                                onClick={() => {
                                  if (expandedDoctorId === doctor.id) {
                                    setExpandedDoctorId(null);
                                  } else {
                                    setExpandedDoctorId(doctor.id);
                                  }
                                }}
                              >
                                Book Appointment
                              </button>
                              <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                                <MessageCircle size={16} className="inline-block mr-1" />
                                Chat
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Time slots for list view */}
                        {expandedDoctorId === doctor.id && (
                          <div className="mt-5 pt-4 border-t border-gray-100 animate-fadeIn">
                            <p className="text-sm font-medium text-gray-700 mb-3">Select an available time slot:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {doctor.availableSlots.map((slot, idx) => (
                                <button 
                                  key={idx}
                                  className={`text-sm px-3 py-2 rounded-lg border ${
                                    selectedTimeSlot[doctor.id] === idx 
                                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                      : 'border-gray-200 hover:border-blue-300'
                                  }`}
                                  onClick={() => setSelectedTimeSlot({...selectedTimeSlot, [doctor.id]: idx})}
                                >
                                  {slot.day}, {slot.time}
                                </button>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <button 
                                className={`px-5 py-2 ${
                                  selectedTimeSlot[doctor.id] !== undefined
                                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                                    : 'bg-gray-300 cursor-not-allowed'
                                } text-white rounded-lg transition-colors font-medium`}
                                onClick={() => {
                                  if (selectedTimeSlot[doctor.id] !== undefined) {
                                    alert(`Appointment booked with ${doctor.name} for ${doctor.availableSlots[selectedTimeSlot[doctor.id]].day} at ${doctor.availableSlots[selectedTimeSlot[doctor.id]].time}`);
                                    setExpandedDoctorId(null);
                                    setSelectedTimeSlot({});
                                  }
                                }}
                              >
                                Confirm Booking
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty state */}
          {filteredDoctors.length === 0 && (
            <div className="container mx-auto px-4 py-12">
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-800">No doctors found</h3>
                <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                  onClick={resetFilters}
                >
                  Reset all filters
                </button>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {filteredDoctors.length > 0 && (
            <div className="container mx-auto px-4 py-8">
              <div className="flex justify-center">
                <button className="px-4 py-2 border border-gray-200 rounded-lg mr-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                  Previous
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded-lg mx-1">1</button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg mx-1 hover:bg-gray-50">2</button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg mx-1 hover:bg-gray-50">3</button>
                <span className="px-3 py-2 text-gray-400">...</span>
                <button className="px-3 py-2 border border-gray-200 rounded-lg mx-1 hover:bg-gray-50">8</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg ml-2 text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Footer */}
      <div className="border-t border-gray-100 mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Doctor Appointment App. All rights reserved.
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">Help Center</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for custom scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}