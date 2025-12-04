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
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const location = useLocation(); 
    const BASE_URL = `http://${window.location.hostname}:5000`;

    useEffect(() => {
        let newSocket;
        if (user) {
            newSocket = io(BASE_URL);
            setSocket(newSocket);
            newSocket.emit("addUser", user._id);

            newSocket.on("getUsers", (users) => {
                setOnlineUsers(users.map(u => u.userId));
            });

            const fetchUnread = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/api/messages/unread/${user._id}`);
                    setUnreadChats(res.data);
                } catch (err) {
                    console.error("Failed to fetch unread", err);
                }
            };
            fetchUnread();

            newSocket.on("getMessage", (data) => {
                fetchUnread(); 
                if (location.pathname !== '/chat') {
                    notificationSound.play().catch(e => console.log(e));
                    toast('New Message received!', { icon: '📩', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
                }
            });
        }

        // cleanup on unmount or when user changes
        return () => {
            if (newSocket) {
                try { newSocket.disconnect(); } catch(e) { console.warn(e); }
            }
            setSocket(null);
            setUnreadChats([]);
            setOnlineUsers([]);
        };
    }, [user, location.pathname]); // keep dependency to react to user and route changes

    const markChatAsRead = async (chatId) => {
        setUnreadChats((prev) => prev.filter(id => id !== chatId));
        try {
            await axios.put(`${BASE_URL}/api/messages/read/${chatId}`, { readerId: user._id });
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
