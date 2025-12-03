import { useEffect, useRef, useState } from "react";
import { Send, MapPin, X, ArrowLeft, Phone, ShoppingBag, MessageSquare } from "lucide-react";
import Conversation from "./Conversation";

const SAFE_SPOTS = [
    { name: "Main Library", icon: "📚" },
    { name: "Student Cafeteria", icon: "☕" },
    { name: "Admin Gate", icon: "🏛️" },
    { name: "Sports Lobby", icon: "🏀" },
    { name: "Hostel Common Room", icon: "🏠" },
];

export default function ChatWindow({ 
    currentChat, 
    setCurrentChat, 
    user, 
    messages, 
    sendMessage,
    navigate,
    onType,        // Handler for typing
    typingUsers,   // List of who is typing
    onlineUsers    // List of who is online
}) {
    const [newMessage, setNewMessage] = useState("");
    const [showSafeZones, setShowSafeZones] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length, currentChat, typingUsers]);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;
        sendMessage(newMessage);
        setNewMessage("");
    };

    const handleInput = (e) => {
        setNewMessage(e.target.value);
        onType(); // Emit typing signal
    };

    const sendLocation = (name, icon) => {
        sendMessage(`📍 Let's meet at: ${icon} ${name}`);
        setShowSafeZones(false);
    };

    // --- DATE HELPERS ---
    const getMessageDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const renderDateSeparator = (currentMessage, previousMessage) => {
        const currentDate = getMessageDate(currentMessage.createdAt);
        const prevDate = previousMessage ? getMessageDate(previousMessage.createdAt) : null;

        if (currentDate !== prevDate) {
            return (
                <div className="flex justify-center my-6 animate-fade-in-up">
                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border border-gray-200">
                        {currentDate}
                    </span>
                </div>
            );
        }
        return null;
    };

    // --- STATUS LOGIC ---
    let friendId = null;
    let isFriendTyping = false;
    let isFriendOnline = false;

    if (currentChat) {
        friendId = currentChat.members.find((m) => m !== user._id);
        isFriendTyping = typingUsers.has(friendId);
        isFriendOnline = onlineUsers.includes(friendId);
    }

    if (!currentChat) {
        return (
            <div className="hidden md:flex flex-1 bg-white/40 backdrop-blur-md md:rounded-[24px] shadow-glass border border-white/50 flex-col items-center justify-center gap-6 p-10 h-full">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-50">
                    <MessageSquare size={50} className="text-uni/80" />
                </div>
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-800">Your Messages</h3>
                    <p className="text-gray-500 mt-2 font-medium">Select a chat to start messaging.</p>
                </div>
                <button onClick={() => navigate('/')} className="flex items-center gap-2 bg-uni text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <ShoppingBag size={20} /> Browse Market
                </button>
            </div>
        );
    }

    return (
        <div className="fixed top-16 bottom-0 left-0 right-0 z-40 bg-[#F9FAFB] md:static md:h-full md:flex-1 md:flex md:flex-col md:bg-white/60 md:backdrop-blur-xl md:rounded-r-3xl md:shadow-2xl md:border md:border-gray-200/50 flex flex-col">
            
            {/* Header */}
            <div className="p-2 md:p-2  border-b border-gray-200/50 flex items-center gap-3 bg-white/80 backdrop-blur-xl shadow-sm z-20 flex-shrink-0 md:rounded-t-[24px]">
                <button onClick={() => setCurrentChat(null)} className="md:hidden p-2 rounded-full bg-white shadow-sm text-gray-600 active:scale-90 transition">
                    <ArrowLeft size={22} />
                </button>
                
                {/* User Info & Status */}
                <div className="flex-1 overflow-hidden">
                    <Conversation conversation={currentChat} currentUser={user} hideLastMessage={true} />
                    <div className="ml-[52px] -mt-2.5 text-xs font-medium transition-all duration-300">
                        {isFriendTyping ? (
                            <span className="text-uni font-bold animate-pulse">typing...</span>
                        ) : isFriendOnline ? (
                            <span className="text-green-500 font-semibold">Online</span>
                        ) : (
                            <span className="text-gray-400">Offline</span>
                        )}
                    </div>
                </div>

                <button className="p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition shadow-sm border border-green-100 active:scale-90">
                    <Phone size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-transparent scroll-smooth custom-scrollbar">
                {messages.map((m, index) => {
                    const prevMessage = messages[index - 1];
                    return (
                        <div key={m._id || index}>
                            {renderDateSeparator(m, prevMessage)}

                            <div className={`flex ${m.sender === user._id ? "justify-end" : "justify-start"} mb-3 animate-fade-in-up`}>
                                <div className={`max-w-[80%] md:max-w-[70%] px-5 py-3 shadow-md text-[15px] leading-relaxed backdrop-blur-md border ${
                                    m.sender === user._id 
                                    ? "bg-gradient-to-br from-uni to-indigo-600 text-white rounded-2xl rounded-tr-sm border-white/10" 
                                    : "bg-white text-gray-800 border-white/80 rounded-2xl rounded-tl-sm shadow-sm"
                                }`}>
                                    {m.text.startsWith("📍 Let's meet at:") ? (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-black opacity-70 mb-1 tracking-widest">Location Proposal</span>
                                            <span className="text-lg font-bold">{m.text.replace("📍 Let's meet at:", "")}</span>
                                        </div>
                                    ) : (
                                        m.text
                                    )}
                                    <div className={`text-[10px] mt-1.5 text-right font-medium ${m.sender === user._id ? "text-indigo-100" : "text-gray-400"}`}>
                                        {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Typing Bubble */}
                {isFriendTyping && (
                    <div className="flex justify-start mb-4 animate-fade-in-up">
                        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}

                <div ref={scrollRef} />
            </div>

            {/* Input Area (With Safe Zone Popup) */}
            {showSafeZones && (
                <div className="absolute bottom-24 left-4 right-4 bg-white/95 backdrop-blur-2xl shadow-2xl border border-white rounded-3xl p-5 z-50 animate-slide-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin size={14} className="text-uni" /> Safe Zones
                        </h3>
                        <button onClick={() => setShowSafeZones(false)} className="bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition">
                            <X size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {SAFE_SPOTS.map((spot) => (
                            <button key={spot.name} onClick={() => sendLocation(spot.name, spot.icon)} className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 hover:border-uni/50 hover:bg-indigo-50 hover:shadow-md rounded-2xl transition-all duration-200 group active:scale-95">
                                <span className="text-2xl mb-1 group-hover:scale-110 transition duration-300 drop-shadow-sm">{spot.icon}</span>
                                <span className="text-[10px] font-bold text-gray-600 text-center">{spot.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-4 bg-transparent z-30 pb-safe flex-shrink-0">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-full shadow-lg border border-white/60">
                    <button onClick={() => setShowSafeZones(!showSafeZones)} className={`p-3 rounded-full transition-all duration-300 ${showSafeZones ? 'bg-uni text-white shadow-lg rotate-180' : 'bg-gray-100/80 text-gray-500 hover:bg-white'}`}>
                        <MapPin size={22} />
                    </button>
                    <input
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-700 placeholder-gray-400 outline-none px-2 font-medium"
                        placeholder="Type a message..."
                        onChange={handleInput}
                        value={newMessage}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                    />
                    <button onClick={handleSubmit} className="bg-uni text-white p-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition active:scale-90">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}