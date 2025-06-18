import { useState } from 'react';
import { useMedicalStore } from '../../../Store/medicalStore';

const DoctorTypeCreationForm = () => {
    const [formData, setFormData] = useState({
        typeName: '',
        description: '',
        scheduleTypes: [],
    });
    

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [currentSchedule, setCurrentSchedule] = useState({
        name: '',
        days: '',

        rate: '',
        includedItems: []
    });
    const [currentIncludedItem, setCurrentIncludedItem] = useState('');

    const { addDoctor } = useMedicalStore()

    const predefinedDoctorTypes = [
        {
            name: "General Practitioners",
            desc: "Primary healthcare and routine medical care",
            color: "from-blue-500 to-cyan-500",
        },
        {
            name: "Pediatric Specialists",
            desc: "Specialized care for children and adolescents",
            color: "from-pink-500 to-rose-500",
        },
        {
            name: "Geriatric Specialists",
            desc: "Comprehensive care for elderly patients",
            color: "from-emerald-500 to-teal-500",
        },
        {
            name: "Home Visit Doctors",
            desc: "In-home medical consultations and care",
            color: "from-amber-500 to-orange-500",
        },
        {
            name: "Specialist Consultants",
            desc: "Expert consultation in specific medical fields",
            color: "from-purple-500 to-violet-500",
        },
        {
            name: "Emergency Doctors",
            desc: "Urgent care and emergency medical services",
            color: "from-indigo-500 to-blue-500",
        },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.typeName.trim()) {
            newErrors.typeName = 'Doctor type name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Description must be at least 50 characters';
        }

        if (formData.scheduleTypes.length === 0) {
            newErrors.scheduleTypes = 'At least one schedule type is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateSchedule = () => {
        const newErrors = {};

        if (!currentSchedule.name.trim()) {
            newErrors.name = 'Schedule name is required';
        }

        if (!currentSchedule.days.trim()) {
            newErrors.days = 'Working days are required';
        }



        if (!currentSchedule.rate) {
            newErrors.rate = 'Hourly rate is required';
        } else if (isNaN(currentSchedule.rate) || parseFloat(currentSchedule.rate) <= 0) {
            newErrors.rate = 'Rate must be a valid positive number';
        }

        if (currentSchedule.includedItems.length === 0) {
            newErrors.includedItems = 'At least one included item is required';
        }

        return newErrors;
    };

    // Included items management functions
    const addIncludedItem = () => {
        if (currentIncludedItem.trim() && !currentSchedule.includedItems.includes(currentIncludedItem.trim())) {
            setCurrentSchedule(prev => ({
                ...prev,
                includedItems: [...prev.includedItems, currentIncludedItem.trim()]
            }));
            setCurrentIncludedItem('');
        }
    };

    const removeIncludedItem = (item) => {
        setCurrentSchedule(prev => ({
            ...prev,
            includedItems: prev.includedItems.filter(i => i !== item)
        }));
    };

    const handleIncludedItemKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addIncludedItem();
        }
    };

    // Schedule management functions
    const openScheduleModal = (schedule = null) => {
        if (schedule) {
            setEditingSchedule(schedule);
            setCurrentSchedule({ ...schedule });
        } else {
            setEditingSchedule(null);
            setCurrentSchedule({
                name: '',
                days: '',

                rate: '',
                includedItems: []
            });
        }
        setShowScheduleModal(true);
    };

    const closeScheduleModal = () => {
        setShowScheduleModal(false);
        setEditingSchedule(null);
        setCurrentSchedule({
            name: '',
            days: '',

            rate: '',
            includedItems: []
        });
        setCurrentIncludedItem('');
    };

    const saveSchedule = () => {
        const scheduleErrors = validateSchedule();
        if (Object.keys(scheduleErrors).length > 0) {
            // Handle schedule validation errors
            return;
        }

        const scheduleData = {
            ...currentSchedule,

            rate: parseFloat(currentSchedule.rate),
            id: editingSchedule ? editingSchedule.id : Date.now()
        };

        if (editingSchedule) {
            setFormData(prev => ({
                ...prev,
                scheduleTypes: prev.scheduleTypes.map(schedule =>
                    schedule.id === editingSchedule.id ? scheduleData : schedule
                )
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                scheduleTypes: [...prev.scheduleTypes, scheduleData]
            }));
        }

        closeScheduleModal();
    };

    const removeSchedule = (scheduleId) => {
        setFormData(prev => ({
            ...prev,
            scheduleTypes: prev.scheduleTypes.filter(schedule => schedule.id !== scheduleId)
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleScheduleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentSchedule(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const submissionData = {
                ...formData,
                scheduleTypes: formData.scheduleTypes.map(schedule => {
                    const { id, ...rest } = schedule;
                    return {
                        ...rest,
                        rate: parseFloat(schedule.rate)
                    };
                }),
            };
            const success = await addDoctor(submissionData);

            console.log('Submitting doctor type data:', submissionData);

            if (success) {
                setFormData({
                    typeName: '',
                    description: '',
                    scheduleTypes: [],
                });
            }

        } catch (error) {
            console.error('Error creating doctor type:', error);
            alert('Error creating doctor type. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                            Create New Doctor Type
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Define a new doctor category with custom schedules and service packages
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Doctor Type Details Section */}
                    <div className="p-8 sm:p-10">
                        <div className="flex items-center mb-8">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 font-semibold text-sm">1</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Doctor Type Information</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8 mb-10">
                            {/* Doctor Type Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Doctor Type Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="typeName"
                                    value={formData.typeName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${errors.typeName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="e.g., Cardiologists, Dermatologists, Family Medicine, etc."
                                />
                                {errors.typeName && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.typeName}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={6}
                                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    placeholder="Describe this doctor type, their specialties, qualifications, and what conditions they treat..."
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.description}</p>
                                )}
                            </div>
                        </div>

                        {/* Schedule Types Section */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-purple-600 font-semibold text-sm">2</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">Schedule Types & Service Packages</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => openScheduleModal()}
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Schedule
                                </button>
                            </div>

                            {formData.scheduleTypes.length > 0 ? (
                                <div className="grid gap-4">
                                    {formData.scheduleTypes.map((schedule) => (
                                        <div key={schedule.id} className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{schedule.name}</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                        <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span className="font-medium">{schedule.days}</span>
                                                        </div>

                                                        <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                                            </svg>
                                                            <span className="font-medium">${schedule.rate}/hour</span>
                                                        </div>
                                                    </div>
                                                    {schedule.includedItems && schedule.includedItems.length > 0 && (
                                                        <div className="mt-3">
                                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Services Included:</h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {schedule.includedItems.map((item, index) => (
                                                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                                        {item}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => openScheduleModal(schedule)}
                                                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSchedule(schedule.id)}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-12 border-2 border-gray-100 text-center">
                                    <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 font-medium text-lg mb-2">No schedule types added yet</p>
                                    <p className="text-gray-400 mb-6">Add different schedule options with their rates and included services</p>
                                    <button
                                        type="button"
                                        onClick={() => openScheduleModal()}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                                    >
                                        Add Your First Schedule
                                    </button>
                                </div>
                            )}

                            {errors.scheduleTypes && (
                                <p className="mt-2 text-sm text-red-600 font-medium">{errors.scheduleTypes}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Doctor Type...
                                    </div>
                                ) : (
                                    'Create Doctor Type'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Schedule Modal */}
            {showScheduleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {editingSchedule ? 'Edit Schedule Type' : 'Add Schedule Type'}
                            </h3>
                            <button
                                onClick={closeScheduleModal}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Schedule Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentSchedule.name}
                                    onChange={handleScheduleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., Weekly Consultation, Emergency Call, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Working Days <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="days"
                                    value={currentSchedule.days}
                                    onChange={handleScheduleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                    placeholder="e.g., Monday-Friday, On-call 24/7, etc."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Hourly Rate ($) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="rate"
                                        value={currentSchedule.rate}
                                        onChange={handleScheduleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                        placeholder="150.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Services Included <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={currentIncludedItem}
                                            onChange={(e) => setCurrentIncludedItem(e.target.value)}
                                            onKeyPress={handleIncludedItemKeyPress}
                                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                            placeholder="e.g., Physical examination, Blood pressure check, etc."
                                        />
                                        <button
                                            type="button"
                                            onClick={addIncludedItem}
                                            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {currentSchedule.includedItems.length > 0 && (
                                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
                                            {currentSchedule.includedItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg"
                                                >
                                                    <span className="text-sm font-medium">{item}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIncludedItem(item)}
                                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button></div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={closeScheduleModal}
                                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveSchedule}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                            >
                                {editingSchedule ? 'Update Schedule' : 'Save Schedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Predefined Types Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Doctor Types</h2>
                    <p className="text-gray-600 text-lg">Get inspired by these commonly requested doctor categories</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {predefinedDoctorTypes.map((type, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300">
                            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className="relative p-6">
                                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${type.color} rounded-xl mb-4`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{type.name}</h3>
                                <p className="text-gray-600 text-sm">{type.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorTypeCreationForm;