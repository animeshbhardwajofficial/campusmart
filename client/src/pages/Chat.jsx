import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const { socket, unreadChats, onlineUsers, markChatAsRead } = useContext(SocketContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set()); 
  const typingTimeoutRef = useRef(null);

  const API_URL = `http://${window.location.hostname}:5000/api`;

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${API_URL}/conversations/${user._id}`);
        setConversations(res.data);
        if (location.state?.conversation) {
            setCurrentChat(location.state.conversation);
            markChatAsRead(location.state.conversation._id);
        }
      } catch (err) { console.log(err); }
    };
    getConversations();
  }, [user._id, location.state, markChatAsRead]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (currentChat) {
            const res = await axios.get(`${API_URL}/messages/${currentChat._id}`);
            setMessages(res.data);
            markChatAsRead(currentChat._id);
        }
      } catch (err) { console.log(err); }
    };
    getMessages();
  }, [currentChat, markChatAsRead]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
        if (currentChat && currentChat.members.includes(data.senderId)) {
            setMessages((prev) => [...prev, {
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            }]);
            markChatAsRead(currentChat._id);
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.senderId);
                return newSet;
            });
        }
    };

    const handleTyping = ({ senderId }) => setTypingUsers(prev => new Set(prev).add(senderId));
    const handleStopTyping = ({ senderId }) => {
        setTypingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(senderId);
            return newSet;
        });
    };

    socket.on("getMessage", handleMessage);
    socket.on("displayTyping", handleTyping);
    socket.on("hideTyping", handleStopTyping);

    return () => {
        socket.off("getMessage", handleMessage);
        socket.off("displayTyping", handleTyping);
        socket.off("hideTyping", handleStopTyping);
    };
  }, [socket, currentChat, markChatAsRead]);

  const sendMessage = async (text) => {
    const message = { sender: user._id, text: text, conversationId: currentChat._id };
    const receiverId = currentChat.members.find((m) => m !== user._id);

    if(socket){
        socket.emit("sendMessage", { senderId: user._id, receiverId, text });
        socket.emit("stopTyping", { senderId: user._id, receiverId });
    }

    try {
      const res = await axios.post(`${API_URL}/messages`, message);
      setMessages(prev => [...prev, res.data]); 
    } catch (err) { console.log(err); }
  };

  const handleTyping = () => {
      if(!socket || !currentChat) return;
      const receiverId = currentChat.members.find((m) => m !== user._id);
      socket.emit("typing", { senderId: user._id, receiverId });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
          socket.emit("stopTyping", { senderId: user._id, receiverId });
      }, 2000);
  };

  return (
    <div className="h-screen pt-16 bg-gray-50 flex overflow-hidden">
      <div className={`w-full md:w-1/4 h-full border-r border-gray-200 bg-white flex flex-col ${currentChat ? 'hidden md:flex' : 'flex'}`}>
        <ChatSidebar conversations={conversations} currentChat={currentChat} setCurrentChat={setCurrentChat} user={user} unreadChats={unreadChats} typingUsers={typingUsers} />
      </div>
      <div className={`w-full md:flex-1 h-full relative ${currentChat ? 'flex' : 'hidden md:flex'}`}>
        <ChatWindow currentChat={currentChat} setCurrentChat={setCurrentChat} user={user} messages={messages} sendMessage={sendMessage} navigate={navigate} onType={handleTyping} typingUsers={typingUsers} onlineUsers={onlineUsers} />
      </div>
    </div>
  );
}