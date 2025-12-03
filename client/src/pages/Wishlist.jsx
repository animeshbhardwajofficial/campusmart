import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    // Fetch Wishlist
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await axios.get(`http://10.79.66.93:5000/api/users/${user._id}/wishlist`);
                setItems(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWishlist();
    }, [user]);

    const handleChat = async (sellerId) => {
        // Logic to start chat (same as Home)
        try {
            const res = await axios.post("http://10.79.66.93:5000/api/conversations", {
                senderId: user._id,
                receiverId: sellerId
            });
            navigate("/chat", { state: { conversation: res.data } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Heart className="text-red-500 fill-current" /> Your Wishlist
            </h1>

            {items.length === 0 ? (
                <div className="text-center text-gray-500 py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-xl">No items saved yet.</p>
                    <button onClick={() => navigate('/')} className="mt-4 text-uni font-bold hover:underline">Go Explore</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border">
                            <div className="h-48 overflow-hidden bg-gray-100 relative">
                                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                                <span className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-bold rounded shadow">
                                    {item.condition}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 truncate">{item.title}</h3>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold text-uni">${item.price}</span>
                                    <button 
                                        onClick={() => handleChat(item.seller)} 
                                        className="bg-uni text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1"
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