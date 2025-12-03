import { useEffect, useState } from "react";
import axios from "axios";

export default function Conversation({ conversation, currentUser, isTyping, hideLastMessage }) {
  const [user, setUser] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  // 1. Fetch Friend's Info
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        // USE YOUR IP
        const res = await axios.get("http://10.79.66.93:5000/api/users?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  // 2. Fetch Last Message
  useEffect(() => {
    const getLastMessage = async () => {
      try {
        const res = await axios.get("http://10.79.66.93:5000/api/messages/" + conversation._id);
        if (res.data.length > 0) {
            setLastMessage(res.data[res.data.length - 1]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getLastMessage();
  }, [conversation]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-uni font-bold border border-white shadow-sm overflow-hidden">
            {user?.profilePic && user.profilePic.length > 10 ? (
                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm">{user?.username?.[0]?.toUpperCase()}</span>
            )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden">
        <span className="font-semibold text-gray-800 capitalize text-sm truncate">
            {user?.username || "Loading..."}
        </span>
        
        {/* LOGIC: Show Typing > Show Last Message */}
        {!hideLastMessage && (
            <span className={`text-xs truncate max-w-[140px] ${isTyping ? 'text-uni font-bold animate-pulse' : 'text-gray-500'}`}>
                {isTyping ? (
                    "typing..."
                ) : lastMessage ? (
                    lastMessage.sender === currentUser._id 
                    ? `You: ${lastMessage.text.substring(0, 20)}...` 
                    : lastMessage.text.substring(0, 20) + (lastMessage.text.length > 20 ? '...' : '')
                ) : (
                    <span className="italic opacity-50">Start a conversation</span>
                )}
            </span>
        )}
      </div>
    </div>
  );
}