import React, { useState, useEffect } from 'react';
import {
    Users,
    Edit3,
    Trash2,
    Calendar,
    DollarSign,
    CheckCircle,
    X,
    Save,
    Clock,
    Search,
    Filter,
    ArrowLeft,
    AlertCircle
} from 'lucide-react';
import isEqual from 'lodash/isEqual';
import { useMedicalStore } from '../../../Store/medicalStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const MedicalStaffingDashboard = () => {
    const [staffingData, setStaffingData] = useState([]);

    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showEditForm, setShowEditForm] = useState(false);

    const { fetchDashboardData, dashboardData, loading } = useMedicalStore()

    const [formData, setFormData] = useState({
        type: '',
        description: '',
        schedule: [
            {
                name: '',
                days: '',
                rate: 0,
                includedThings: ['']
            }
        ]
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);


    useEffect(() => {
        if (!dashboardData) return;
        console.log(dashboardData);
        setStaffingData(dashboardData);
    }, [dashboardData]);


    if (loading) {
        return <LoadingSpinner />
    }


    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            type: item.type,
            description: item.description,
            schedule: [...item.schedule]
        });
        setShowEditForm(true);
    };

    const handleSave = async () => {
        if (editingItem) {

            const { _id, serviceId, ...editData } = editingItem;

            const isModified = !isEqual(formData, editData);

            if (!isModified) {
                console.log("No changes detected. Not saving.");
                setShowEditForm(false);
                setEditingItem(null);
                return;
            }

            // const success = await editDomesticStaffing(editingItem._id, editData);
            // if (success) {
            //     setStaffingData(prev => prev.map(item =>
            //         item._id === editingItem._id
            //             ? { ...item, ...formData }
            //             : item
            //     ));

            //     setShowEditForm(false);
            //     setEditingItem(null);
            // }
        }


    };

    const handleCancel = () => {
        setShowEditForm(false);
        setEditingItem(null);
        setFormData({
            type: '',
            description: '',
            schedule: [
                {
                    name: '',
                    days: '',
                    rate: 0,
                    includedThings: ['']
                }
            ]
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff service?')) {
            // const success = await deleteDomesticStaffing(id);
            // if (!success) return;
            setStaffingData(prev => prev.filter(item => item._id !== id));
        }
    };

    const addScheduleItem = () => {
        setFormData(prev => ({
            ...prev,
            schedule: [...prev.schedule, {
                name: '',
                days: '',
                rate: 0,
                includedThings: ['']
            }]
        }));
    };

    const removeScheduleItem = (index) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.filter((_, i) => i !== index)
        }));
    };

    const updateScheduleItem = (scheduleIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.map((item, index) =>
                index === scheduleIndex ? { ...item, [field]: value } : item
            )
        }));
    };

    const addIncludedThing = (scheduleIndex) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.map((item, index) =>
                index === scheduleIndex
                    ? { ...item, includedThings: [...item.includedThings, ''] }
                    : item
            )
        }));
    };

    const removeIncludedThing = (scheduleIndex, thingIndex) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.map((item, index) =>
                index === scheduleIndex
                    ? { ...item, includedThings: item.includedThings.filter((_, i) => i !== thingIndex) }
                    : item
            )
        }));
    };

    const updateIncludedThing = (scheduleIndex, thingIndex, value) => {
        setFormData(prev => ({
            ...prev,
            schedule: prev.schedule.map((item, index) =>
                index === scheduleIndex
                    ? {
                        ...item,
                        includedThings: item.includedThings.map((thing, i) =>
                            i === thingIndex ? value : thing
                        )
                    }
                    : item
            )
        }));
    };

    const filteredData = staffingData.filter(item => {
        const matchesSearch = item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || item.type === filterType;
        return matchesSearch && matchesFilter;
    });

    // Mobile Edit Form Overlay
    if (showEditForm) {
        return (
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen">
                {/* Mobile Header */}
                <div className="bg-white shadow-lg sticky top-0 z-10">
                    <div className="px-4 py-4">
                        <div className="flex items-center">
                            <button
                                onClick={handleCancel}
                                className="mr-4 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-indigo-800">Edit Service</h2>
                                <p className="text-sm text-indigo-600">
                                    Editing: {editingItem?.type}
                                </p>
                            </div>
                            <div className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-sm font-medium">Editing</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-indigo-800 mb-2">Staff Type</label>
                                <input
                                    value={formData.type}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />


                            </div>

                            <div>
                                <label className="block text-sm font-medium text-indigo-800 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={3}
                                    placeholder="Describe the service..."
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-indigo-800">Schedule Options</label>
                                    <button
                                        onClick={addScheduleItem}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center bg-indigo-50 px-3 py-1 rounded-lg"
                                    >
                                        <Edit3 className="w-4 h-4 mr-1" />
                                        Add Schedule
                                    </button>
                                </div>

                                {formData.schedule.map((schedule, scheduleIndex) => (
                                    <div key={scheduleIndex} className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-indigo-800">Schedule {scheduleIndex + 1}</span>
                                            {formData.schedule.length > 1 && (
                                                <button
                                                    onClick={() => removeScheduleItem(scheduleIndex)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Schedule name"
                                                value={schedule.name}
                                                onChange={(e) => updateScheduleItem(scheduleIndex, 'name', e.target.value)}
                                                className="w-full px-3 py-3 border border-indigo-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                                            />

                                            <input
                                                type="text"
                                                placeholder="Days (e.g., Monday to Friday)"
                                                value={schedule.days}
                                                onChange={(e) => updateScheduleItem(scheduleIndex, 'days', e.target.value)}
                                                className="w-full px-3 py-3 border border-indigo-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                                            />

                                            <input
                                                type="number"
                                                placeholder="Rate per day"
                                                value={schedule.rate}
                                                onChange={(e) => updateScheduleItem(scheduleIndex, 'rate', parseInt(e.target.value) || 0)}
                                                className="w-full px-3 py-3 border border-indigo-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500"
                                            />

                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-medium text-indigo-800">Included Services</span>
                                                    <button
                                                        onClick={() => addIncludedThing(scheduleIndex)}
                                                        className="text-indigo-600 hover:text-indigo-800 text-xs bg-indigo-100 px-2 py-1 rounded"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {schedule.includedThings.map((thing, thingIndex) => (
                                                    <div key={thingIndex} className="flex items-center mb-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Service included"
                                                            value={thing}
                                                            onChange={(e) => updateIncludedThing(scheduleIndex, thingIndex, e.target.value)}
                                                            className="flex-1 px-3 py-2 border border-indigo-200 rounded text-sm focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                        {schedule.includedThings.length > 1 && (
                                                            <button
                                                                onClick={() => removeIncludedThing(scheduleIndex, thingIndex)}
                                                                className="ml-2 text-red-500 hover:text-red-700 p-1"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fixed Bottom Actions */}
                        <div className="mt-8 pt-4 border-t border-indigo-100 space-y-3">
                            <button
                                onClick={handleSave}
                                className="w-full px-4 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center font-medium"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 min-h-screen">
            {/* Header Section */}
            <div className="bg-white shadow-lg">
                <div className="px-4 sm:px-6 py-6">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-4xl font-bold text-indigo-700 mb-2 flex items-center justify-center">
                            <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                            Domestic Staff Dashboard
                        </h1>
                        <p className="text-indigo-600 text-sm sm:text-base">Manage your domestic staff services and schedules</p>
                    </div>
                </div>
            </div>
            {/* Stats Panel */}
            <div className=" bg-white shadow-xl p-4 sm:p-6 border border-indigo-100">
                <h3 className="text-lg sm:text-xl font-bold text-indigo-800 mb-4">Dashboard Stats</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Total Services</p>
                                <p className="text-2xl font-bold">{staffingData.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-200" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Service Types</p>
                                <p className="text-2xl font-bold">{[...new Set(staffingData.map(item => item.type))].length}</p>
                            </div>
                            <Edit3 className="w-8 h-8 text-green-200" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-indigo-100 pt-4">
                    <h4 className="font-semibold text-indigo-800 mb-3">Service Breakdown</h4>
                    <div className="space-y-2">
                        {[...new Set(staffingData.map(item => item.type))].map(type => (
                            <div key={type} className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{type}</span>
                                <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    {staffingData.filter(item => item.type === type).length}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                {/* Controls Section */}
                <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6 border border-indigo-100">
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search staff services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500 w-5 h-5" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full pl-10 pr-8 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                <option value="all">All Types</option>
                                {staffingData.map(data => (
                                    <option key={data.type} value={data.type}>{data.type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Staff Services List */}
                <div className="space-y-4 sm:space-y-6">
                    {filteredData.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 transition-all hover:shadow-2xl">
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 sm:p-6 text-white">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start flex-1 min-w-0">
                                        <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-3 flex-shrink-0 mt-1" />
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg sm:text-2xl font-bold truncate">{item.type}</h3>
                                            <p className="text-indigo-200 mt-1 text-sm sm:text-base line-clamp-2">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 bg-red-500 hover:bg-red-400 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6">
                                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                                    Schedule Options
                                </h4>
                                <div className="space-y-4">
                                    {item.schedule.map((schedule, scheduleIndex) => (
                                        <div key={scheduleIndex} className="bg-indigo-50 rounded-xl p-4 sm:p-5 border border-indigo-100">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                                                <h5 className="font-semibold text-indigo-800 text-sm sm:text-base">{schedule.name}</h5>
                                                <div className="flex items-center text-emerald-600 font-bold">
                                                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                                                    <span className="text-sm sm:text-base">{schedule.rate}/day</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-indigo-600 mb-3">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span className="text-xs sm:text-sm">{schedule.days}</span>
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-medium text-indigo-800 mb-2">Included Services:</p>
                                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                                    {schedule.includedItems.map((thing, thingIndex) => (
                                                        <span
                                                            key={thingIndex}
                                                            className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center"
                                                        >
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            {thing}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center border border-indigo-100">
                            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-300 mx-auto mb-4" />
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No staff services found</h3>
                            <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
};

export default MedicalStaffingDashboard;