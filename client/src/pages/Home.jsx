import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Search, Filter, MessageCircle, Trash2, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Home() {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [wishlist, setWishlist] = useState([]); 
    
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Fetch Items
    const fetchItems = async () => {
        try {
            // REMEMBER TO USE YOUR PC IP IF TESTING ON PHONE
            const res = await axios.get(`http://10.79.66.93:5000/api/items?search=${search}&category=${category}`);
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 2. Fetch Wishlist
    const fetchWishlistIDs = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://10.79.66.93:5000/api/users/${user._id}/wishlist`);
            setWishlist(res.data.map(item => item._id));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchItems();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [search, category]);

    useEffect(() => {
        if(user) fetchWishlistIDs();
    }, [user]);

    // Handlers
    const handleChat = async (sellerId) => {
        if (!user) return navigate('/login');
        if (user._id === sellerId) return toast.error("You cannot chat with yourself");

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

    const handleDelete = async (itemId) => {
        if(!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            await axios.delete(`http://10.79.66.93:5000/api/items/${itemId}`, {
                headers: { 'auth-token': token }
            });
            toast.success("Item removed");
            fetchItems();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const toggleWishlist = async (itemId) => {
        if (!user) return navigate('/login');
        try {
            await axios.put(`http://10.79.66.93:5000/api/users/${user._id}/wishlist`, { itemId });
            
            if (wishlist.includes(itemId)) {
                setWishlist(prev => prev.filter(id => id !== itemId));
                toast.success("Removed from Wishlist");
            } else {
                setWishlist(prev => [...prev, itemId]);
                toast.success("Added to Wishlist");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    const myItems = items.filter(item => user && item.seller?._id === user._id);
    const otherItems = items.filter(item => !user || item.seller?._id !== user._id);

    const ItemCard = ({ item, isMine }) => {
        const isLiked = wishlist.includes(item._id);

        return (
            <div className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group relative ${isMine ? 'border-uni/30' : ''}`}>
                
                {/* Image */}
                <div className="h-48 overflow-hidden bg-gray-50 relative">
                    {item.images[0] ? (
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 font-medium">No Image</div>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm border border-gray-100 text-gray-700">
                        {item.condition}
                    </span>
                    
                    {/* Heart Icon (Lower z-index than Search Bar) */}
                    {!isMine && (
                        <button 
                            onClick={() => toggleWishlist(item._id)}
                            className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:scale-110 transition z-10"
                        >
                            <Heart 
                                size={18} 
                                className={isLiked ? "text-red-500 fill-current" : "text-gray-400"} 
                            />
                        </button>
                    )}
                </div>

                {/* Details */}
                <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm truncate mb-4">{item.description}</p>
                    
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-uni">${item.price}</span>
                            <span className="text-xs text-gray-400 font-medium mt-0.5">{isMine ? 'You' : item.seller?.username}</span>
                        </div>
                        
                        {isMine ? (
                            <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-100 transition text-sm font-bold flex items-center gap-1.5 active:scale-95">
                                <Trash2 size={16} /> Remove
                            </button>
                        ) : (
                            <button onClick={() => handleChat(item.seller?._id)} className="bg-uni text-white px-4 py-2 rounded-xl hover:bg-uniDark transition text-sm font-bold flex items-center gap-2 shadow-md shadow-uni/20 active:scale-95">
                                <MessageCircle size={16} /> Chat
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        // Add padding-top to account for fixed Navbar
        <div className="container mx-auto p-4 pb-20 pt-20">
            
            {/* FIXED SEARCH SECTION */}
            {/* sticky top-16: Sticks exactly below Navbar (which is h-16) */}
            {/* z-30: Higher than Card (z-0) and Heart (z-10) */}
            <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 transition-all">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search items..." 
                        className="w-full pl-10 p-2.5 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-uni/20 focus:bg-white transition text-gray-700 font-medium placeholder-gray-400"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-gray-50 p-2.5 rounded-xl text-gray-500">
                        <Filter size={20} />
                    </div>
                    <select 
                        className="p-2.5 bg-gray-50 border-0 rounded-xl text-gray-700 font-medium focus:ring-2 focus:ring-uni/20 cursor-pointer hover:bg-gray-100 transition" 
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Books">Books</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* SECTION 1: MY LISTINGS */}
            {user && myItems.length > 0 && (
                <div className="mb-12 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                        Your Listings <span className="text-sm font-bold bg-white text-uni px-3 py-1 rounded-full border border-indigo-100 shadow-sm">{myItems.length}</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {myItems.map(item => <ItemCard key={item._id} item={item} isMine={true} />)}
                    </div>
                </div>
            )}

            {/* SECTION 2: FRESH RECOMMENDATIONS */}
            <div>
                <h1 className="text-2xl font-bold mb-6 text-gray-800 px-2">Fresh Recommendations</h1>
                {otherItems.length === 0 ? (
                    <div className="text-center text-gray-400 py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <p className="text-lg font-medium">No items found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {otherItems.map(item => <ItemCard key={item._id} item={item} isMine={false} />)}
                    </div>
                )}
            </div>
        </div>
    );
}