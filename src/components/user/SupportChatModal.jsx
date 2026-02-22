import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MessageCircle,
  Loader,
  CheckCheck,
  Headphones,
  Trash2,
} from "lucide-react";
import { supportAPI, getImageUrl } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

const SupportChatModal = ({ isOpen, onClose }) => {
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatStatus, setChatStatus] = useState("open");
  const [file, setFile] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchChat();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const fetchChat = async () => {
    try {
      setLoading(true);
      const response = await supportAPI.getChat(userId);
      setMessages(response.data.chat.messages || []);
      setChatStatus(response.data.chat.status);
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    console.log("handleSend called", { newMessage, file, sending, userId });
    if (!userId) {
      alert("User not logged in or userId missing. Please login again.");
      return;
    }
    if ((!newMessage.trim() && !file) || sending) {
      console.log("Blocked: empty message/file or sending in progress");
      return;
    }

    const messageText = newMessage.trim();
    setNewMessage("");

    // Optimistically add message
    const tempMessage = {
      sender: "user",
      message: messageText,
      createdAt: new Date().toISOString(),
      _id: "temp-" + Date.now(),
      fileUrl: file ? URL.createObjectURL(file) : null,
      fileName: file ? file.name : null,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      setSending(true);
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", messageText);
        console.log("Sending file message", { userId, formData });
        response = await supportAPI.sendFileMessage(userId, formData);
      } else {
        console.log("Sending text message", { userId, messageText });
        response = await supportAPI.sendMessage(userId, messageText);
      }
      setMessages(response.data.chat.messages);
      setFile(null);
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
      let errorMsg = "Failed to send message. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      }
      console.error("Send message error", error);
      alert(errorMsg);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId || messageId.startsWith("temp-")) return;
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      setDeletingId(messageId);
      const response = await supportAPI.deleteMessage(userId, messageId);
      setMessages(response.data.chat.messages);
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Failed to delete message. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div className="relative w-full max-w-full sm:w-[420px] h-[90vh] sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300 overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">SatyamPay Support</h3>
              <p className="text-indigo-200 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Online - Typically replies in minutes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-3 space-y-4 bg-slate-50 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <>
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  {/* Date Separator */}
                  <div className="flex items-center justify-center my-4">
                    <span className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider shadow-sm">
                      {date}
                    </span>
                  </div>

                  {/* Messages */}
                  {msgs.map((msg, index) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div
                        key={msg._id || index}
                        className={`group flex mb-2 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-end gap-1 relative">
                          {/* Delete button for user messages */}
                          {isUser && msg._id && !msg._id.startsWith("temp-") && (
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              disabled={deletingId === msg._id}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 mr-1 self-center"
                              title="Delete message"
                            >
                              {deletingId === msg._id ? (
                                <Loader className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                          {!isUser && (
                            <div className="hidden sm:block w-7 h-7 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
                              <MessageCircle className="w-4 h-4 text-indigo-400" />
                            </div>
                          )}
                          <div
                            className={`relative max-w-[85vw] sm:max-w-[320px] px-4 py-2.5 rounded-2xl shadow-md ${isUser
                              ? "bg-indigo-600 text-indigo-100 rounded-br-md ml-auto"
                              : "bg-white text-slate-700 rounded-bl-md"
                              }`}
                          >
                            {/* Bubble tail */}
                            <span className={`absolute bottom-0 ${isUser ? "right-0" : "left-0"} w-3 h-3 bg-inherit ${isUser ? "rounded-br-md" : "rounded-bl-md"} z-0`} style={{ transform: isUser ? "translateY(60%) translateX(30%) rotate(45deg)" : "translateY(60%) translateX(-30%) rotate(45deg)" }} />
                            <div className="relative z-10">
                              {msg.message && (
                                <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${isUser ? 'text-white' : 'text-slate-900'}`}>
                                  {msg.message}
                                </p>
                              )}
                              {msg.filePath && msg.fileType && msg.fileType.startsWith("image/") && (
                                <img
                                  src={getImageUrl(msg.filePath)}
                                  alt={msg.fileName || "image"}
                                  className="mt-2 w-36 h-36 object-cover rounded-lg border border-slate-200 shadow"
                                />
                              )}
                              {msg.filePath && msg.fileType && !msg.fileType.startsWith("image/") && (
                                <a
                                  href={getImageUrl(msg.filePath)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`mt-2 block text-xs underline truncate max-w-[180px] ${isUser ? 'text-indigo-100 hover:text-white' : 'text-blue-700 hover:text-blue-900'}`}
                                >
                                  {msg.fileName || "Download file"}
                                </a>
                              )}
                            </div>
                            <div
                              className={`flex items-center justify-end gap-1 mt-1 ${isUser ? "text-indigo-200" : "text-slate-400"}`}
                            >
                              <span className="text-[10px]">
                                {formatTime(msg.createdAt)}
                              </span>
                              {isUser && msg.readAt && (
                                <CheckCheck className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSend}
          className="sticky bottom-0 p-2 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              style={{ minWidth: 0 }}
            />
            <label className="relative cursor-pointer w-12 h-12 flex items-center justify-center">
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={e => setFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </span>
            </label>
            <button
              type="submit"
              disabled={(!newMessage.trim() && !file) || sending}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-2xl flex items-center justify-center transition-colors"
            >
              {sending ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          {file && (
            <div className="mt-2 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              {file.type.startsWith("image/") ? (
                <img src={getImageUrl(file)} alt="preview" className="w-14 h-14 object-cover rounded-lg border" />
              ) : (
                <span className="text-xs text-slate-600 truncate max-w-[120px]">{file.name}</span>
              )}
              <button type="button" onClick={() => setFile(null)} className="text-xs text-red-500 ml-2">Remove</button>
            </div>
          )}
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Our team typically responds within a few minutes
          </p>
        </form>
      </div>
    </div>
  );
};

export default SupportChatModal;
