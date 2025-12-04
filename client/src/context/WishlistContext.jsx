import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    
    // Smart URL
    const BASE_URL = `http://${window.location.hostname}:5000/api`;

    // 1. Fetch Wishlist on Load
    useEffect(() => {
        if (user) {
            const fetchWishlist = async () => {
                try {
                    const res = await axios.get(`${BASE_URL}/users/${user._id}/wishlist`);
                    // Store full objects or just IDs? Let's store full objects for the page, map IDs for checking
                    setWishlist(res.data); 
                } catch (err) {
                    console.error("Wishlist fetch failed", err);
                }
            };
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    // 2. Toggle Function (Used by Home, Navbar, Wishlist Page)
    const toggleWishlist = async (item) => {
        if (!user) return toast.error("Please login first");
        
        // Optimistic Update
        const exists = wishlist.find(w => w._id === item._id);
        
        if (exists) {
            setWishlist(prev => prev.filter(w => w._id !== item._id));
            toast.success("Removed from Wishlist");
        } else {
            setWishlist(prev => [...prev, item]);
            toast.success("Added to Wishlist");
        }

        // Sync with DB
        try {
            await axios.put(`${BASE_URL}/users/${user._id}/wishlist`, { itemId: item._id });
        } catch (err) {
            console.error(err);
            toast.error("Connection failed");
        }
    };

    // Check if an ID is in wishlist
    const isInWishlist = (itemId) => wishlist.some(w => w._id === itemId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};