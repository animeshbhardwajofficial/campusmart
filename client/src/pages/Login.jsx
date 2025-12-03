import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://10.79.66.93:5000/api/auth/login', formData);
            login(res.data.user, res.data.token);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                <input name="identifier" placeholder="Email or Reg No." onChange={(e) => setFormData({...formData, identifier: e.target.value})} className="w-full p-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" required />
                <button className="w-full bg-uni text-white py-2 rounded hover:bg-uniDark font-bold">Login</button>
            </form>
        </div>
    );
}