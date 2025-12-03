import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { LogOut, ShoppingBag, PlusCircle, MessageSquare, Heart } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { unreadChats } = useContext(SocketContext);

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 flex items-center transition-all duration-300">
            <div className="container mx-auto flex justify-between items-center px-4 h-full">
                <Link to="/" className="text-xl md:text-2xl font-bold text-uni flex items-center gap-2 tracking-tight">
                    <ShoppingBag strokeWidth={2.5} /> CampusMart
                </Link>

                <div className="flex gap-3 md:gap-4 items-center">
                    {user ? (
                        <>
                            <Link to="/sell" className="bg-gradient-to-r from-uni to-indigo-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                                <PlusCircle size={20} /> 
                                <span className="hidden md:inline font-semibold">Sell Item</span>
                            </Link>

                            <Link to="/wishlist" className="text-gray-500 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100 active:scale-90" title="Wishlist">
                                <Heart size={22} />
                            </Link>

                            <Link to="/chat" className="text-gray-500 hover:text-uni transition p-2 rounded-full hover:bg-indigo-50 relative active:scale-90" title="Messages">
                                <MessageSquare size={22} />
                                {unreadChats.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm animate-pulse"></span>
                                )}
                            </Link>

                            <span className="text-gray-700 font-semibold hidden md:block">{user.username}</span>
                            <button onClick={logout} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-50 transition" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-uni font-medium">Login</Link>
                            <Link to="/register" className="bg-uni text-white px-4 py-2 rounded-lg font-bold shadow-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}