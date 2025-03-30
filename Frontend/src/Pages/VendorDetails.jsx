// import React from 'react';
import {
    Building2,
    ArrowLeft,
    User,
    Phone,
    MapPin,
    Clock,
    FileText,
} from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAdminStore } from '../../Store/adminStore';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// RejectionModal Component
const RejectionModal = ({ isOpen, onClose, onSend }) => {

    const [reason, setReason] = useState("");

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-400/50 z-50 backdrop-blur-sm overflow-hidden">
            <div className="bg-white p-8 rounded-xl w-11/12 md:w-1/3 shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-center"> Rejection Reason</h2>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
                    placeholder="Enter your reason here..."
                />
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            setReason("");
                            onClose();
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition duration-150"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onSend(reason);
                            setReason("");
                        }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>


    );
};

const VendorDetailPage = () => {
    const mode = useSearchParams()[0].get("mode");
    const [vendor, setVendor] = useState(null);
    // const [isModalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate()

    const { id } = useParams();
    const { vendorData, getVendorDetails, setVendorApproval, loading, success } = useAdminStore();





    useEffect(() => {
        if (id) {
            getVendorDetails(id);
        }
    }, [getVendorDetails, id]);

    useEffect(() => {
        if (vendorData) {
            setVendor(vendorData);
        }
    }, [vendorData]);

    const handleApprove = () => {
        setVendorApproval({ status: 'Approved', vendorId: id });
        navigate('/admin')
    };
    const handleRejection = () => {
        setVendorApproval({ status: 'Rejected', vendorId: id });
        navigate('/admin')
    }


    if (!vendor) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center p-8">
                    <Clock className="mx-auto h-12 w-12 text-indigo-700" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                        Loading vendor details...
                    </h2>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner></LoadingSpinner>

    const { businessDetails, businessContact, ownerDetails, contactPerson, businessAddress, status, createdAt } = vendor;

    const getStatusBadgeClass = () => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="w-full mb-3">
                    <button className='cursor-pointer text-indigo-700 p-2 text-xl font-semibold'>
                        <Link to={'/admin'} className='flex items-center gap-2'>
                            <ArrowLeft className="h-6 w-6" />Back
                        </Link>
                    </button>
                </div>
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
                    <div className="px-6 py-8 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-center mb-4 sm:mb-0">
                                <div className="h-16 w-16 rounded-full bg-indigo-700 flex items-center justify-center text-white text-2xl font-bold">
                                    {businessDetails.businessName.charAt(0)}
                                </div>
                                <div className="ml-4">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {businessDetails.businessName}
                                    </h1>
                                    <p className="text-gray-600">
                                        {businessDetails.businessType}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getStatusBadgeClass()}`}>
                                    {status}
                                </span>
                                <span className="text-sm text-gray-500 mt-2">
                                    Applied on {formatDate(createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Business Details Section */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                                <div className="flex items-center">
                                    <Building2 className="h-5 w-5 text-indigo-700 mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Business Details</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessDetails.businessName}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Legal Business Name</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessDetails.legalBusinessName}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Business Type</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessDetails.businessType}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessDetails.businessIndustry}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessDetails.registrationNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Address Section */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-indigo-700 mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Business Address</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Street</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessAddress.street}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">City</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessAddress.city}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">State</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessAddress.state}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Postal Code</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessAddress.zip}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Country</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessAddress.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Contact */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-indigo-700 mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Business Contact</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessContact.businessEmail}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {businessContact.businessPhone}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Website</h3>
                                        {businessContact.website ? (
                                            <a href={businessContact.website}>
                                                <p className="mt-1 text-sm text-blue-900 underline">
                                                    {businessContact.website}
                                                </p>
                                            </a>
                                        ) : (
                                            <p className="mt-1 text-sm text-gray-900">Not provided</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Owner Details */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                                <div className="flex items-center">
                                    <User className="h-5 w-5 text-indigo-700 mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Owner Details</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                {ownerDetails.ownerPhoto && (
                                    <div className="flex justify-center mb-4">
                                        <div className="h-24 w-40 rounded-2xl overflow-hidden">
                                            <img
                                                src={ownerDetails.ownerPhoto}
                                                alt="Owner"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ownerDetails.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {formatDate(ownerDetails.dateOfBirth)}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Nationality</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ownerDetails.nationality}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">ID Type</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ownerDetails.identificationType}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">ID Number</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {ownerDetails.identificationNumber}
                                        </p>
                                    </div>
                                    {ownerDetails.ownerDocumentPhoto && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">ID Document</h3>
                                            <div className="mt-1 flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                                <span className="ml-1 text-sm text-indigo-600">
                                                    Document uploaded
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Person */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-indigo-50">
                                <div className="flex items-center">
                                    <User className="h-5 w-5 text-indigo-700 mr-2" />
                                    <h2 className="text-lg font-medium text-gray-900">Contact Person</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {contactPerson.name}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Title</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {contactPerson.title || "Not specified"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {contactPerson.email}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {contactPerson.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {mode !== 'view' &&
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="p-6">
                                    <button className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded-md mb-3" onClick={handleApprove}>
                                        Approve Vendor
                                    </button>
                                    <button
                                        className="w-full bg-white hover:bg-gray-50 text-red-600 border border-gray-300 py-2 px-4 rounded-md"
                                        onClick={handleRejection}
                                    >
                                        Reject Application
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* <RejectionModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSend={(reason) => {
                    console.log("Rejection reason:", reason);
                    setModalOpen(false);
                }}
            /> */}
        </div>
    );
};

export default VendorDetailPage;
