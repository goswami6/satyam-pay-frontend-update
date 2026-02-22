import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Search,
  Filter,
  Send,
  Loader,
  CheckCheck,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  RefreshCw,
  ArrowLeft, Paperclip, Trash2
} from "lucide-react";
import { supportAPI, getImageUrl } from "../../utils/api";

const Support = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    open: 0,
    pending: 0,
    resolved: 0,
    closed: 0,
    totalUnread: 0,
  });
  const [file, setFile] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchChats();
  }, [filterStatus]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  useEffect(() => {
    if (selectedChat) {
      inputRef.current?.focus();
    }
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const response = await supportAPI.getAllChats(filterStatus);
      setChats(response.data.chats || []);
      setStats(response.data.stats || stats);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    try {
      const response = await supportAPI.getAdminChat(chat.chatId);
      setSelectedChat(response.data.chat);
      setShowChatWindow(true);
      // Update local chats to reflect read status
      setChats((prev) =>
        prev.map((c) =>
          c.chatId === chat.chatId ? { ...c, unreadByAdmin: 0 } : c
        )
      );
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !file) || sending || !selectedChat) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      setSending(true);
      let response;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", messageText);
        response = await supportAPI.sendAdminFileMessage(selectedChat.chatId, formData);
      } else {
        response = await supportAPI.sendAdminMessage(selectedChat.chatId, messageText);
      }
      setSelectedChat(response.data.chat);
      setFile(null);
      // Update chat in list
      setChats((prev) =>
        prev.map((c) =>
          c.chatId === selectedChat.chatId
            ? { ...c, lastMessage: messageText, lastMessageAt: new Date() }
            : c
        )
      );
    } catch (error) {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!messageId || !selectedChat) return;
    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    try {
      setDeletingId(messageId);
      const response = await supportAPI.deleteAdminMessage(selectedChat.chatId, messageId);
      setSelectedChat(response.data.chat);
    } catch (error) {
      console.error("Delete message error:", error);
      alert("Failed to delete message. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const updateStatus = async (newStatus) => {
    if (!selectedChat) return;

    try {
      await supportAPI.updateChatStatus(selectedChat.chatId, newStatus);
      setSelectedChat((prev) => ({ ...prev, status: newStatus }));
      setChats((prev) =>
        prev.map((c) =>
          c.chatId === selectedChat.chatId ? { ...c, status: newStatus } : c
        )
      );
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-emerald-100 text-emerald-700",
      pending: "bg-amber-100 text-amber-700",
      resolved: "bg-blue-100 text-blue-700",
      closed: "bg-slate-100 text-slate-500",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      chat.userId?.fullName?.toLowerCase().includes(query) ||
      chat.userId?.email?.toLowerCase().includes(query) ||
      chat.chatId.toLowerCase().includes(query)
    );
  });

  return (

    <div className="h-[calc(100vh-120px)] flex gap-0 md:gap-6 bg-transparent overflow-hidden antialiased">

      {/* --- Left Side: Chat List --- */}
      <div className={`
        w-full md:w-[400px] bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-primary-100/50 flex flex-col overflow-hidden transition-all duration-300
        ${showChatWindow ? 'hidden md:flex' : 'flex'}
      `}>

        <div className="p-6 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-primary-800 tracking-tight">Inbox</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">Support Center</p>
            </div>
            <button
              onClick={fetchChats}
              className="p-2.5 bg-slate-50 hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-xl transition-all active:scale-90"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {["All", "Open", "Pending", "Resolved"].map((label) => (
              <button
                key={label}
                onClick={() => setFilterStatus(label.toLowerCase())}
                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${filterStatus === label.toLowerCase() ? `bg-primary-900 text-white shadow-lg` : `bg-slate-50 text-slate-400 hover:bg-slate-100`
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversation..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white focus:border-primary-200 transition-all font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <Loader className="w-6 h-6 text-primary-500 animate-spin" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loading</span>
            </div>
          ) : filteredChats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => selectChat(chat)}
              className={`group relative p-4 rounded-[1.5rem] cursor-pointer transition-all duration-300 mx-2 ${selectedChat?.chatId === chat.chatId ? "bg-white shadow-xl shadow-indigo-100/50 ring-1 ring-slate-100" : "hover:bg-slate-50"
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-tr from-slate-100 to-slate-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  {chat.unreadByAdmin > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                      {chat.unreadByAdmin}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-black text-slate-800 truncate">{chat.userId?.fullName}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{formatTime(chat.lastMessageAt)}</span>
                  </div>
                  <p className="text-xs truncate text-slate-400">{chat.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Right Side: Chat Window --- */}
      <div className={`
        flex-1 bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl flex flex-col overflow-hidden relative
        ${showChatWindow ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedChat ? (
          <>
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowChatWindow(false)} className="md:hidden p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft size={20} className="text-primary-600" />
                </button>
                <div className="w-12 h-12 bg-primary-900 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-primary-800 leading-tight">{selectedChat.userId?.fullName}</h3>
                  <span className="text-[11px] font-bold text-primary-400">{selectedChat.userId?.email}</span>
                </div>
              </div>
              <select
                value={selectedChat.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="px-4 py-2 bg-primary-50 border border-primary-100 rounded-xl text-[11px] font-black uppercase tracking-wider text-primary-600 outline-none"
              >
                <option value="open">Mark Open</option>
                <option value="pending">Mark Pending</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]">
              {selectedChat.messages?.map((msg, index) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div key={msg._id || index} className={`group flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2">
                        {/* Delete button - shown on left for admin msgs, right for user msgs */}
                        {!isAdmin && msg._id && (
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            disabled={deletingId === msg._id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 shrink-0"
                            title="Delete message"
                          >
                            {deletingId === msg._id ? (
                              <Loader className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        <div className={`px-5 py-3.5 shadow-sm ${isAdmin ? "bg-slate-900 text-white rounded-[1.5rem] rounded-tr-none" : "bg-white text-slate-700 rounded-[1.5rem] rounded-tl-none border border-slate-100"
                          }`}>
                          {msg.message && <p className="text-[14px] leading-relaxed font-medium">{msg.message}</p>}
                          {msg.filePath && msg.fileType && msg.fileType.startsWith("image/") && (
                            <img
                              src={getImageUrl(msg.filePath)}
                              alt={msg.fileName || "image"}
                              className="mt-2 w-32 h-32 object-cover rounded shadow"
                            />
                          )}
                          {msg.filePath && msg.fileType && !msg.fileType.startsWith("image/") && (
                            <a
                              href={getImageUrl(msg.filePath)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-xs text-indigo-600 underline block"
                            >
                              {msg.fileName || "Download file"}
                            </a>
                          )}
                        </div>
                        {isAdmin && msg._id && (
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            disabled={deletingId === msg._id}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 shrink-0"
                            title="Delete message"
                          >
                            {deletingId === msg._id ? (
                              <Loader className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-50">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <div className="flex-1 relative flex items-center">
                  <label className="absolute left-2 p-2.5 text-primary-400 hover:text-primary-500 rounded-xl cursor-pointer">
                    <input type="file" onChange={e => setFile(e.target.files[0])} className="hidden" />
                    <Paperclip size={20} />
                  </label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write your response..."
                    className="w-full pl-12 pr-4 py-4 bg-primary-50 border border-primary-100 rounded-[1.5rem] text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:bg-white transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={(!newMessage.trim() && !file) || sending}
                  className="h-14 w-14 bg-primary-900 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {sending ? <Loader className="w-5 h-5 animate-spin" /> : <Send size={22} />}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-12 text-center">
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-6">
              <MessageCircle className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800">Support Terminal</h3>
            <p className="text-sm text-slate-400 max-w-xs mt-2 font-medium">Select a conversation to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
