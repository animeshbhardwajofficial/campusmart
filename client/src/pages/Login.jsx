import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // FINAL FIX: SMART URL
    const API_URL = `http://${window.location.hostname}:5000/api/auth/login`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(API_URL, formData);
            login(res.data.user, res.data.token);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 flex items-center justify-center bg-[#F9FAFB] px-4">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-glass border border-white/60 w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 mt-2 text-sm">Login to continue to CampusMart</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Identifier */}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                        <input name="identifier" placeholder="Email or Reg No." onChange={(e) => setFormData({...formData, identifier: e.target.value})} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                        <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                    </div>

                    <button disabled={loading} className="w-full bg-gradient-to-r from-uni to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? <Loader2 className="animate-spin" /> : <>Login <LogIn size={20} /></>}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Don't have an account? <Link to="/register" className="text-uni font-bold hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}