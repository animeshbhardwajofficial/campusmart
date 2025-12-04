import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Wishlist() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    // SMART URL
    const BASE_URL = `http://${window.location.hostname}:5000/api`;

    // Fetch Wishlist
    const fetchWishlist = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/users/${user._id}/wishlist`);
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if(user) fetchWishlist();
    }, [user]);

    const handleChat = async (sellerId) => {
        try {
            const res = await axios.post(`${BASE_URL}/conversations`, {
                senderId: user._id,
                receiverId: sellerId
            });
            navigate("/chat", { state: { conversation: res.data } });
        } catch (err) {
            console.error(err);
        }
    };

    const removeFromWishlist = async (itemId) => {
        try {
            await axios.put(`${BASE_URL}/users/${user._id}/wishlist`, { itemId });
            toast.success("Removed from Wishlist");
            fetchWishlist(); // Refresh list
        } catch (err) {
            toast.error("Failed to remove");
        }
    };

    return (
        <div className="container mx-auto p-4 pb-20 pt-20">
            <div className="flex items-center gap-3 mb-8">
                <button onClick={() => navigate('/')} className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Heart className="text-red-500 fill-current" /> Your Wishlist
                </h1>
            </div>

            {items.length === 0 ? (
                <div className="text-center text-gray-400 py-20 bg-white/80 backdrop-blur-xl rounded-3xl border border-dashed border-gray-200 shadow-glass">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart size={32} className="text-gray-300" />
                    </div>
                    <p className="text-lg font-medium">Your wishlist is empty.</p>
                    <button onClick={() => navigate('/')} className="mt-6 flex items-center gap-2 bg-uni text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl transition mx-auto">
                        <ShoppingBag size={18} /> Go Explore
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group relative">
                            <div className="h-48 overflow-hidden bg-gray-50 relative">
                                {item.images[0] ? (
                                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                )}
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm text-gray-700">
                                    {item.condition}
                                </span>
                                
                                <button 
                                    onClick={() => removeFromWishlist(item._id)}
                                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition z-10"
                                >
                                    <Heart size={18} className="text-red-500 fill-current" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{item.title}</h3>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xl font-extrabold text-uni">${item.price}</span>
                                    <button 
                                        onClick={() => handleChat(item.seller)} 
                                        className="bg-uni text-white px-4 py-2 rounded-xl hover:bg-uniDark transition text-sm font-bold flex items-center gap-2 shadow-md shadow-uni/20"
                                    >
                                        <MessageCircle size={16} /> Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}