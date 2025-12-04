import { useEffect, useState } from "react";
import axios from "axios";

export default function Conversation({ conversation, currentUser, isTyping, hideLastMessage }) {
  const [user, setUser] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const API_URL = `http://${window.location.hostname}:5000/api`;

  useEffect(() => {
    if (!conversation || !currentUser) {
      setUser(null);
      return;
    }
    const friendId = conversation.members?.find((m) => m !== currentUser._id);
    if (!friendId) return;

    let mounted = true;
    const getUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users?userId=${friendId}`);
        if (mounted) setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();

    return () => { mounted = false; };
  }, [currentUser, conversation]);

  useEffect(() => {
    if (!conversation) {
      setLastMessage(null);
      return;
    }
    let mounted = true;
    const getLastMessage = async () => {
      try {
        const res = await axios.get(`${API_URL}/messages/${conversation._id}`);
        if (mounted && res.data.length > 0) setLastMessage(res.data[res.data.length - 1]);
      } catch (err) {
        console.log(err);
      }
    };
    getLastMessage();
    return () => { mounted = false; };
  }, [conversation]);

  return (
    <div className="flex items-center gap-3">
      <div className="relative min-w-[40px]">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-uni font-bold border border-gray-100 shadow-sm overflow-hidden">
            {user?.profilePic && user.profilePic.length > 10 ? (
                <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
            ) : (
                <span className="text-sm">{user?.username?.[0]?.toUpperCase() ?? "?"}</span>
            )}
        </div>
      </div>
      <div className="flex flex-col overflow-hidden w-full">
        <span className="font-bold text-gray-800 capitalize text-sm truncate">
            {user?.username || "Loading..."}
        </span>
        {!hideLastMessage && (
            <span className={`text-xs truncate ${isTyping ? 'text-uni font-bold animate-pulse' : 'text-gray-500 font-medium'}`}>
                {isTyping ? (
                    "typing..."
                ) : lastMessage ? (
                    (lastMessage.sender === currentUser?._id) 
                    ? `You: ${lastMessage.text}` 
                    : lastMessage.text
                ) : (
                    <span className="italic opacity-50">Start a conversation</span>
                )}
            </span>
        )}
      </div>
    </div>
  );
}
