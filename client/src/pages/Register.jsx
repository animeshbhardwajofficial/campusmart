import { useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Loader2, ArrowRight, FileText } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', regNo: '', phoneNumber: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // FINAL FIX: SMART URL. This always resolves to your PC's current IP.
    const API_URL = `http://${window.location.hostname}:5000/api/auth/register`;

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(API_URL, formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-10 flex items-center justify-center bg-[#F9FAFB] px-4">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-glass border border-white/60 w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Join CampusMart</h2>
                    <p className="text-gray-500 mt-2 text-sm">Create an account to start trading safely</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                        <input name="username" placeholder="Full Name" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                        <input name="email" type="email" placeholder="University Email" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                    </div>

                    {/* Row: RegNo & Phone */}
                    <div className="flex gap-3">
                        <div className="relative group flex-1">
                            <FileText className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                            <input name="regNo" placeholder="Reg No." onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                        </div>
                        <div className="relative group flex-1">
                            <Phone className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                            <input name="phoneNumber" placeholder="Phone" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                    </div>

                    <button disabled={loading} className="w-full bg-gradient-to-r from-uni to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} /></>}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-6 text-sm">
                    Already have an account? <Link to="/login" className="text-uni font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}