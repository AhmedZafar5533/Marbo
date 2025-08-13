import React, { useEffect, useState } from "react";
import { Search, MoreVertical, AlertTriangle, X, Loader2 } from "lucide-react";
import { useContactUsStore } from "../../../Store/ContactUsStore";

const formatDateTime = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [viewMode, setViewMode] = useState("unreplied");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [sendingReply, setSendingReply] = useState(false);

  const { getAllMessages, messages, loading, deleteMessage, replyMessage } =
    useContactUsStore();

  useEffect(() => {
    console.log("refreshing");
    getAllMessages();
  }, [getAllMessages]);

  const filteredMessages = messages.filter(
    (msg) =>
      msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unrepliedMessages = filteredMessages.filter((msg) => !msg.replied);
  const repliedMessages = filteredMessages.filter((msg) => msg.replied);

  const openModal = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    setReplyMode(false);
    setReplyContent("");
  };

  const closeModal = () => {
    // Prevent closing modal while sending reply
    if (sendingReply) return;

    setSelectedMessage(null);
    setShowMessageModal(false);
    setReplyMode(false);
    setReplyContent("");
    setSendingReply(false);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) return;
    setSendingReply(true);
    const success = await replyMessage(selectedMessage._id, replyContent);
    console.log("Reply sent:", success);
    if (success) {
      setReplyMode(false);

      setSelectedMessage(null);
      setShowMessageModal(false);
      setReplyMode(false);
      setReplyContent("");
    }

    setSendingReply(false);
  };

  const handleDeleteMessage = (id) => {
    deleteMessage(id);
    setOpenMenuId(null);
  };

  const renderMessagesList = (list) => {
    if (loading) {
      return <p className="text-center text-gray-500">Loading messages...</p>;
    }
    if (list.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <AlertTriangle
            size={36}
            className="text-gray-400 dark:text-gray-500 mb-4"
          />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No messages found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria.
          </p>
        </div>
      );
    }
    return list.map((message) => (
      <div
        key={message._id}
        className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={() => openModal(message)}
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {message.reason}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              From: {message.email}
            </p>
            {message.replied && (
              <span className="inline-flex items-center px-2 py-1 mt-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                Replied
              </span>
            )}
          </div>
          <div className="relative">
            <button
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === message._id ? null : message._id);
              }}
            >
              <MoreVertical
                size={18}
                className="text-gray-500 dark:text-gray-400"
              />
            </button>
            {openMenuId === message._id && (
              <div
                className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleDeleteMessage(message._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          {message.message}
        </p>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {formatDateTime(message.createdAt)}
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setViewMode("unreplied")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            viewMode === "unreplied"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Unreplied ({unrepliedMessages.length})
        </button>
        <button
          onClick={() => setViewMode("replied")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            viewMode === "replied"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Replied ({repliedMessages.length})
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {viewMode === "unreplied"
          ? renderMessagesList(unrepliedMessages)
          : renderMessagesList(repliedMessages)}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Message from {selectedMessage.email}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatDateTime(selectedMessage.createdAt)}
                    </p>
                    {selectedMessage.replied && (
                      <span className="inline-flex items-center px-2 py-1 mt-2 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded-full">
                        Replied
                      </span>
                    )}
                  </div>
                  <button
                    onClick={closeModal}
                    disabled={sendingReply}
                    className={`text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 ${
                      sendingReply ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>

                {replyMode ? (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Reply
                    </h4>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply here..."
                      disabled={sendingReply}
                      className="mt-2 w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      rows="4"
                    ></textarea>
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        onClick={() => setReplyMode(false)}
                        disabled={sendingReply}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSendReply}
                        disabled={sendingReply || !replyContent.trim()}
                        className="px-4 py-2 flex items-center justify-center gap-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingReply && (
                          <Loader2 className="animate-spin" size={16} />
                        )}
                        {sendingReply ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </h4>
                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedMessage.email}
                          </p>
                        </div>

                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4">
                          Reason
                        </h4>
                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedMessage.reason}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Message
                        </h4>
                        <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Display Reply if message has been replied to */}
                    {selectedMessage.replied && selectedMessage.reply && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Your Reply
                        </h4>
                        <div className="mt-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedMessage.reply}
                          </p>
                          {selectedMessage.repliedAt && (
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                              Replied on:{" "}
                              {formatDateTime(selectedMessage.repliedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    disabled={sendingReply}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Close
                  </button>
                  {!replyMode && !selectedMessage.replied && (
                    <button
                      onClick={() => setReplyMode(true)}
                      disabled={sendingReply}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
