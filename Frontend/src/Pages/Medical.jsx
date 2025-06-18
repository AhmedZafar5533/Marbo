import React, { useState } from "react";
import { useMedicalStore } from "../../Store/medicalStore";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { AlertCircle } from "lucide-react";

const MedicalService = () => {
    const [selectedService, setSelectedService] = useState(null);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [serviceDetails, setServiceDetails] = useState(null);
    const { id } = useParams();

    const { fetchDoctors, doctors, loading, serviceData } = useMedicalStore();

    const galleryImages = [
        {
            url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop",
            title: "General Practice",
            description: "Comprehensive healthcare for all family members"
        },
        {
            url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=600&fit=crop",
            title: "Specialized Care",
            description: "Expert treatment from certified specialists"
        },
        {
            url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
            title: "Modern Facilities",
            description: "State-of-the-art medical equipment and facilities"
        },
        {
            url: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&h=600&fit=crop",
            title: "Emergency Care",
            description: "24/7 emergency medical services"
        },
        {
            url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=600&fit=crop",
            title: "Consultation Services",
            description: "Professional medical consultations"
        },
        {
            url: "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=800&h=600&fit=crop",
            title: "Preventive Care",
            description: "Regular checkups and preventive medicine"
        }
    ];

    useEffect(() => {
        if (!id) return;
        fetchDoctors(id);
    }, [id, fetchDoctors]);

    const getServiceColor = () => {
        const gradientColors = [
            'from-blue-500 to-blue-600',
            'from-green-500 to-green-600',
            'from-teal-500 to-teal-600',
            'from-purple-500 to-purple-600',
            'from-indigo-500 to-indigo-600',
            'from-cyan-500 to-cyan-600',
            'from-emerald-500 to-emerald-600',
            'from-sky-500 to-sky-600',
            'from-violet-500 to-violet-600',
            'from-rose-500 to-rose-600',
            'from-amber-500 to-amber-600'
        ];

        const randomIndex = Math.floor(Math.random() * gradientColors.length);
        return gradientColors[randomIndex];
    };

    // Helper function to get schedule color
    const getScheduleColor = (days) => {
        const dayCount = parseInt(days);
        if (dayCount <= 3) return 'from-blue-500 to-blue-600';
        if (dayCount <= 6) return 'from-green-500 to-green-600';
        return 'from-purple-500 to-purple-600';
    };

    const calculatePrice = () => {
        if (!selectedService || !selectedSchedule || !doctors) return 0;

        const service = doctors.find(s => s._id === selectedService);
        if (!service) return 0;

        const schedule = service.schedule.find(s => s.name === selectedSchedule);
        if (!schedule) return 0;

        return schedule.rate;
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-slate-600">Loading medical services...</p>
                </div>
            </div>
        );
    }

    if (!loading && doctors.length === 0) return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center animate-fade-in">
                <div className="flex justify-center mb-4">
                    <AlertCircle className="h-12 w-12 text-red-400" />
                </div>
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">No Medical Services Found</h2>
                <p className="text-slate-500">We couldn't find any medical services at the moment. Please check back later.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="text-center mb-16 relative">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-red-200 mb-6 shadow-lg">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-red-700">Certified & Professional</span>
                        </div>
                        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-slate-800 via-red-800 to-orange-800 bg-clip-text text-transparent mb-6 leading-tight">
                            {serviceData?.serviceName || "Medical Services"}
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            {serviceData?.description || "Professional medical care services with certified doctors and specialists"}
                        </p>
                    </div>
                </section>

                {/* Vendor Info Card */}
                <section className="mb-16">
                    <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-2xl">MC</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{serviceData?.vendorName || "Medical Center"}</h2>
                                    <div className="flex items-center gap-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
                                                ))}
                                            </div>
                                            <span className="ml-1 font-semibold">4.9 Rating</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
                                <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Service Selection */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-bold text-slate-800 mb-4">Step 1: Choose Your Medical Service</h3>
                        <p className="text-xl text-slate-600">Select the type of medical care you need</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor, index) => (
                            <div
                                key={doctor._id}
                                className={`group cursor-pointer transition-all duration-500 hover:-translate-y-3 ${selectedService === doctor._id
                                    ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-2xl scale-105'
                                    : 'bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white hover:shadow-2xl'
                                    }`}
                                onClick={() => setSelectedService(doctor._id)}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="rounded-2xl p-6 h-full">
                                    <div className={`mb-4 group-hover:scale-110 transition-transform duration-300 ${selectedService === doctor._id ? 'scale-110' : ''}`}>
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedService === doctor._id ? 'from-white/20 to-white/10' : getServiceColor()} flex items-center justify-center shadow-lg`}>
                                            <span className={`text-2xl font-bold ${selectedService === doctor._id ? 'text-white' : 'text-white'}`}>
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                    <h4 className={`text-xl font-bold mb-2 ${selectedService === doctor._id ? 'text-white' : 'text-slate-800'}`}>
                                        {doctor.type}
                                    </h4>
                                    <p className={`mb-4 ${selectedService === doctor._id ? 'text-red-100' : 'text-slate-600'}`}>
                                        {doctor.description}
                                    </p>
                                    <div className={`text-sm font-semibold ${selectedService === doctor._id ? 'text-white' : 'text-red-600'}`}>
                                        Starting from ${Math.min(...doctor.schedule.map(s => s.rate))}/session
                                    </div>
                                    {selectedService === doctor._id && (
                                        <div className="mt-4 flex items-center text-white">
                                            <div className="w-5 h-5 bg-white rounded-full mr-2 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            </div>
                                            <span className="font-semibold">Selected</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Schedule Selection */}
                {selectedService && (
                    <section className="mb-16">
                        <div className="text-center mb-12">
                            <h3 className="text-4xl font-bold text-slate-800 mb-4">Step 2: Select Your Schedule</h3>
                            <p className="text-xl text-slate-600">Choose your preferred consultation schedule</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {doctors.find(s => s._id === selectedService)?.schedule.map((schedule) => (
                                <div
                                    key={schedule.name}
                                    className={`cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 ${selectedSchedule === schedule.name
                                        ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white shadow-2xl scale-105 border-2 border-red-300'
                                        : 'bg-white/90 backdrop-blur-xl border-2 border-white/50 hover:border-red-300'
                                        }`}
                                    onClick={() => setSelectedSchedule(schedule.name)}
                                >
                                    <div className="rounded-3xl p-8">
                                        <div className="text-center mb-6">
                                            <div className={`w-max h-12 mx-auto p-4 mb-4 rounded-xl bg-gradient-to-br ${selectedSchedule === schedule.name ? 'from-white/20 to-white/10' : getScheduleColor(schedule.days)} flex items-center justify-center`}>
                                                <span className="text-white font-bold text-lg">{schedule.days}</span>
                                            </div>
                                            <h4 className={`text-2xl font-bold mb-2 ${selectedSchedule === schedule.name ? 'text-white' : 'text-slate-800'}`}>
                                                {schedule.name}
                                            </h4>
                                            <p className={`text-lg ${selectedSchedule === schedule.name ? 'text-red-100' : 'text-slate-600'}`}>
                                                {schedule.days} sessions per week
                                            </p>
                                            <p className={`text-sm ${selectedSchedule === schedule.name ? 'text-red-200' : 'text-slate-500'}`}>
                                                ${schedule.rate}/session
                                            </p>
                                        </div>
                                        <ul className={`text-left mt-4 mb-6 space-y-2 ${selectedSchedule === schedule.name ? 'text-red-100' : 'text-slate-700'}`}>
                                            {schedule.includedItems.map((item, index) => (
                                                <li key={index} className="flex items-center">
                                                    <svg className={`w-5 h-5 mr-3 ${selectedSchedule === schedule.name ? 'text-white' : 'text-pink-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        {selectedSchedule === schedule.name && (
                                            <div className="text-center mt-4">
                                                <div className="bg-white/20 rounded-lg p-3">
                                                    <span className="text-white font-bold">✓ Selected</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Dynamic Pricing Display */}
                {selectedService && selectedSchedule && (
                    <section className="mb-16">
                        <div className="bg-gradient-to-r from-rose-500 to-red-500 rounded-3xl p-12 text-white text-center">
                            <h3 className="text-4xl font-bold mb-4">Your Medical Package</h3>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                <div className="text-center">
                                    <div className="text-6xl font-black mb-2">${calculatePrice()}</div>
                                    <div className="text-xl text-rose-100">per session</div>
                                </div>
                                <div className="text-left">
                                    <div className="mb-2">
                                        <span className="font-semibold">Service:</span> {doctors.find(s => s._id === selectedService)?.type}
                                    </div>
                                    <div className="mb-2">
                                        <span className="font-semibold">Schedule:</span> {selectedSchedule}
                                    </div>
                                    <div className="mb-4">
                                        <span className="font-semibold">Sessions:</span> {doctors.find(s => s._id === selectedService)?.schedule.find(sch => sch.name === selectedSchedule)?.days} per week
                                    </div>
                                    <button className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                        Book This Package
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Image Gallery */}
                <section className="mb-16">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-bold text-slate-800 mb-4">Our Medical Facilities</h3>
                        <p className="text-xl text-slate-600">State-of-the-art healthcare facilities and professional care</p>
                    </div>
                    <div className="relative">
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
                            <div className="relative h-96 rounded-2xl overflow-hidden">
                                <img
                                    src={galleryImages[currentImageIndex].url}
                                    alt={galleryImages[currentImageIndex].title}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h4 className="text-2xl font-bold mb-2">{galleryImages[currentImageIndex].title}</h4>
                                    <p className="text-lg text-gray-200">{galleryImages[currentImageIndex].description}</p>
                                </div>

                                {/* Navigation Buttons */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                                >
                                    <span className="text-xl font-bold">‹</span>
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                                >
                                    <span className="text-xl font-bold">›</span>
                                </button>
                            </div>

                            {/* Thumbnail Navigation */}
                            <div className="flex justify-center mt-6 gap-2">
                                {galleryImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                                            ? 'bg-red-600 scale-125'
                                            : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MedicalService;