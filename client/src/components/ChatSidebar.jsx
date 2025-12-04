import { MessageSquare } from "lucide-react";
import Conversation from "./Conversation";

export default function ChatSidebar({ conversations, currentChat, setCurrentChat, user, unreadChats, typingUsers }) {
    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/50">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 tracking-tight">Chats</h2>
                <div className="bg-white p-1.5 rounded-full shadow-sm text-uni border border-indigo-50">
                    <MessageSquare size={18} />
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                {conversations.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10 p-4">
                        <p className="text-sm">No conversations yet.</p>
                    </div>
                ) : (
                    conversations.map((c) => {
                        const friendId = c.members.find((m) => m !== user._id);
                        const isFriendTyping = typingUsers.has(friendId);
                        return (
                            <div 
                                key={c._id} 
                                onClick={() => setCurrentChat(c)} 
                                className={`p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 
                                ${currentChat?._id === c._id ? 'bg-indigo-50 border-l-4 border-uni shadow-sm' : 'hover:bg-white/60 hover:shadow-md'}`}
                            >
                                <Conversation conversation={c} currentUser={user} isTyping={isFriendTyping} />
                                {unreadChats.includes(c._id) && currentChat?._id !== c._id && (
                                    <div className="bg-uni text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse border border-white">NEW</div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}