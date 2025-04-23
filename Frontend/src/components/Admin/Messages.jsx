import React, { useState } from 'react';
import { Search, MoreVertical, AlertTriangle, X } from 'lucide-react';

const mockMessages = [
    {
        id: 1,
        sender: 'Customer #4582',
        subject: 'Order Inquiry',
        message: 'I have a question regarding my order. Could you please provide an update on the shipping status?',
        date: '2025-02-10T14:30:00Z',
        read: false,
    },
    {
        id: 2,
        sender: 'Customer #3219',
        subject: 'Product Feedback',
        message: 'I would like to share my feedback on the recent purchase. The product quality is excellent!',
        date: '2025-02-11T10:15:00Z',
        read: true,
    },
    {
        id: 3,
        sender: 'Store A',
        subject: 'Payment Issue',
        message: 'I noticed an error in the payment processing for my last order. Please check and advise.',
        date: '2025-02-12T16:45:00Z',
        read: false,
    },
];

const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const Messages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [replyMode, setReplyMode] = useState(false);
    const [replyContent, setReplyContent] = useState('');

    const filteredMessages = mockMessages.filter(
        (message) =>
            message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
            message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (message) => {
        setSelectedMessage(message);
        setShowMessageModal(true);
        setReplyMode(false);
        setReplyContent('');
    };

    const closeModal = () => {
        setSelectedMessage(null);
        setShowMessageModal(false);
        setReplyMode(false);
        setReplyContent('');
    };

    const handleSendReply = () => {
        // Implement sending reply logic here (e.g., API call)
        alert(`Reply sent: ${replyContent}`);
        closeModal();
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${!message.read ? 'border-l-4 border-blue-600' : ''}`}
                            onClick={() => openModal(message)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{message.subject}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">From: {message.sender}</p>
                                </div>
                                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">{message.message}</p>
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{formatDateTime(message.date)}</div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-6">
                        <AlertTriangle size={36} className="text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No messages found</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>

            {/* Message Details / Reply Modal */}
            {showMessageModal && selectedMessage && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Overlay */}
                        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                        </div>
                        {/* Modal Content */}
                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            Message {selectedMessage.id}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {formatDateTime(selectedMessage.date)}
                                        </p>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                        <X size={20} />
                                    </button>
                                </div>

                                {replyMode ? (
                                    // Reply Form
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reply</h4>
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="mt-2 w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                        ></textarea>
                                        <div className="mt-6 flex justify-end gap-3">
                                            <button
                                                onClick={() => setReplyMode(false)}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleSendReply}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                            >
                                                Send Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // Message Details
                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Sender Information
                                            </h4>
                                            <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedMessage.sender}</p>
                                                {/* Additional sender details (like email) can be added here */}
                                            </div>

                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                                                Subject
                                            </h4>
                                            <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedMessage.subject}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Message
                                            </h4>
                                            <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedMessage.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Close
                                    </button>
                                    {!replyMode && (
                                        <button
                                            onClick={() => setReplyMode(true)}
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                        >
                                            Reply
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
