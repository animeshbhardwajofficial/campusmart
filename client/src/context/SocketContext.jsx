import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export const SocketContext = createContext();

const notificationSound = new Audio("https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");

export const SocketProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [unreadChats, setUnreadChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]); // <--- NEW STATE
    
    const location = useLocation(); 

    useEffect(() => {
        if (user) {
            // REMEMBER TO CHANGE IP IF NEEDED
            const newSocket = io("http://10.79.66.93:5000");
            setSocket(newSocket);
            newSocket.emit("addUser", user._id);

            // 1. Listen for Online Users List
            newSocket.on("getUsers", (users) => {
                // users is array of {userId, socketId}
                // We just want a list of userIds
                setOnlineUsers(users.map(u => u.userId));
            });

            // 2. Fetch Initial Unread
            const fetchUnread = async () => {
                try {
                    const res = await axios.get(`http://10.79.66.93:5000/api/messages/unread/${user._id}`);
                    setUnreadChats(res.data);
                } catch (err) {
                    console.error("Failed to fetch unread", err);
                }
            };
            fetchUnread();

            // 3. Message Listener
            newSocket.on("getMessage", (data) => {
                fetchUnread(); 
                
                if (location.pathname !== '/chat') {
                    notificationSound.play().catch(e => console.log("Audio play failed", e));
                    toast('New Message received!', { 
                        icon: '📩',
                        style: { borderRadius: '10px', background: '#333', color: '#fff' },
                    });
                }
            });

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            setUnreadChats([]);
            setOnlineUsers([]);
        }
    }, [user, location.pathname]); 

    const markChatAsRead = async (chatId) => {
        setUnreadChats((prev) => prev.filter(id => id !== chatId));
        try {
            await axios.put(`http://10.79.66.93:5000/api/messages/read/${chatId}`, { readerId: user._id });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, unreadChats, onlineUsers, markChatAsRead }}>
            {children}
        </SocketContext.Provider>
    );
};