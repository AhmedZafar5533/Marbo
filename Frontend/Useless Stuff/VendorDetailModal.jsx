import { XCircle } from 'lucide-react';


/* eslint-disable react/prop-types */

const VendorModal = ({ type, vendor, onClose, onApprove, onReject, onSend }) => {
    if (!vendor) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {type === 'details' ? 'Vendor Details' : 'Message Vendor'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <XCircle size={20} />
                            </button>
                        </div>
                        {type === 'details' ? (
                            <>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Business Information
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{vendor.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.businessType}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.email}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{vendor.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Application Details
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <div className="flex justify-between">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Date Applied:</p>
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {new Date(vendor.applicationDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Status:</p>
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
                                                    {vendor.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Documents:</p>
                                                <p className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                                    View Files
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Additional Notes
                                        </h4>
                                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {vendor.notes || "No additional notes provided."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => onReject(vendor.id)}
                                        title="Reject Vendor"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => onApprove(vendor.id)}
                                        title="Approve Vendor"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                                        To: {vendor.name} ({vendor.email})
                                    </p>
                                    <textarea
                                        placeholder="Type your message here..."
                                        className="mt-3 w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                    ></textarea>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        title="Cancel"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={onSend}
                                        title="Send Message"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorModal;
