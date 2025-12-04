import { Link } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { WishlistContext } from '../context/WishlistContext';
import { LogOut, ShoppingBag, PlusCircle, MessageSquare, Heart, User, Settings, ChevronDown, List } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { unreadChats } = useContext(SocketContext);
    const { wishlist } = useContext(WishlistContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Greeting Logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    // Close dropdown if clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 flex items-center transition-all duration-300">
            <div className="container mx-auto flex justify-between items-center px-4 h-full">
                <Link to="/" className="text-xl md:text-2xl font-bold text-uni flex items-center gap-2 tracking-tight">
                    <ShoppingBag strokeWidth={2.5} /> CampusMart
                </Link>

                <div className="flex gap-3 md:gap-4 items-center">
                    {user ? (
                        <>
                            {/* SELL BUTTON */}
                            <Link to="/sell" className="hidden md:flex bg-gradient-to-r from-uni to-indigo-600 text-white px-3 py-2 rounded-xl items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                                <PlusCircle size={20} /> 
                                <span className="font-semibold">Sell</span>
                            </Link>
                            
                            {/* Mobile Sell Icon Only */}
                            <Link to="/sell" className="md:hidden bg-uni text-white p-2 rounded-full shadow-md">
                                <PlusCircle size={20} /> 
                            </Link>

                            {/* WISHLIST BUTTON WITH COUNT */}
                            <Link to="/wishlist" className="text-gray-500 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100 active:scale-90 relative" title="Wishlist">
                                <Heart size={22} />
                                {wishlist.length > 0 && (
                                    <span className="absolute top-1 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm border border-white">
                                        {wishlist.length}
                                    </span>
                                )}
                            </Link>

                            {/* CHAT BUTTON WITH COUNT */}
                            <Link to="/chat" className="text-gray-500 hover:text-uni transition p-2 rounded-full hover:bg-indigo-50 relative active:scale-90" title="Messages">
                                <MessageSquare size={22} />
                                {unreadChats.length > 0 && (
                                    <span className="absolute top-1 right-0 min-w-[18px] h-[18px] px-1 bg-uni rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm border border-white animate-pulse">
                                        {unreadChats.length}
                                    </span>
                                )}
                            </Link>

                            {/* ACCOUNT DROPDOWN */}
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 p-1 pr-2 rounded-full transition border border-transparent hover:border-gray-100"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-uni font-bold border border-gray-200 overflow-hidden">
                                        {user.profilePic && user.profilePic.length > 10 ? (
                                            <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.username[0].toUpperCase()
                                        )}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start text-xs">
                                        <span className="text-gray-400 font-medium">{getGreeting()},</span>
                                        <span className="text-gray-700 font-bold text-sm">{user.username.split(' ')[0]}</span>
                                    </div>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fade-in-up overflow-hidden z-40">
                                        
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setIsDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-uni transition"
                                        >
                                            <User size={16} /> Profile
                                        </Link>
                                        
                                        {/* My Listings Option REMOVED */}
                                        
                                        <div className="border-t border-gray-100 my-1"></div>
                                        
                                        <button 
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 font-semibold hover:text-uni">Login</Link>
                            <Link to="/register" className="bg-uni text-white px-4 py-2 rounded-lg font-bold shadow-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}