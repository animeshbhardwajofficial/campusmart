import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', regNo: '', phoneNumber: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://10.79.66.93:5000/api/auth/register', formData);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-96 space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Join CampusMart</h2>
                <input name="username" placeholder="Full Name" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="regNo" placeholder="Registration No." onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="w-full p-2 border rounded" required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border rounded" required />
                <button className="w-full bg-uni text-white py-2 rounded hover:bg-uniDark font-bold">Sign Up</button>
            </form>
        </div>
    );
}