import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, Briefcase, Phone, Save, Loader2, UploadCloud } from 'lucide-react';

// Department List for reference (optional: you can remove this if you prefer plain text input)
const DEPARTMENT_LIST = [
    'Engineering',
    'Science',
    'Arts & Humanities',
    'Business School',
    'Medical Sciences',
    'Other/General',
];

export default function Profile() {
    const { user, token, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    
    // Picture State
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profilePic || '');

    const BASE_URL = `http://${window.location.hostname}:5000/api`;

    // Form Data State
    const [formData, setFormData] = useState({
        username: user?.username || '',
        department: user?.department || '',
        phoneNumber: user?.phoneNumber || '',
        bio: user?.bio || '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        let newUserData = { ...formData };
        let profilePicUpdatePromise = Promise.resolve(newUserData);

        // A. Handle Picture Upload First (if a new file is selected)
        if (imageFile) {
            const imageData = new FormData();
            imageData.append('profileImage', imageFile);

            profilePicUpdatePromise = axios.put(`${BASE_URL}/users/${user._id}/picture`, imageData, {
                headers: { 'Content-Type': 'multipart/form-data', 'auth-token': token }
            }).then(res => {
                return { ...newUserData, profilePic: res.data.profilePic };
            }).catch(error => {
                toast.error("Photo upload failed. Check file size.");
                console.error(error);
                return newUserData;
            });
        }

        // B. Handle Text/Detail Updates
        try {
            const dataToUpdate = await profilePicUpdatePromise;
            
            const res = await axios.put(`${BASE_URL}/users/${user._id}`, dataToUpdate, { headers: { 'auth-token': token } });
            
            updateUser(res.data); // Update Auth Context globally
            toast.success("Profile updated successfully!");

        } catch (err) {
            toast.error(err.response?.data?.message || "Details update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 flex items-center justify-center bg-[#F9FAFB] px-4">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-glass border border-white/60 w-full max-w-2xl animate-fade-in-up">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Edit Profile</h2>
                    <p className="text-gray-500 mt-2 text-sm">Manage your public information</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* PROFILE PICTURE SECTION */}
                    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl shadow-inner border border-gray-100 mb-6">
                        <div className="relative mb-4">
                            <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-uni text-3xl font-bold border-4 border-white shadow-xl overflow-hidden">
                                <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <label className="absolute bottom-0 right-0 w-9 h-9 bg-uni text-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-indigo-600 transition">
                                <UploadCloud size={18} />
                                <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <p className="text-sm font-medium text-gray-700">Change Profile Photo</p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Name & Email */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input name="username" value={formData.username} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni transition outline-none" />
                            </div>
                        </div>

                        {/* Department Input (RESTORED TO INPUT AS REQUESTED) */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Department</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input name="department" placeholder="e.g. CSE, Mechanical" value={formData.department} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni transition outline-none" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 ml-1">Phone</label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni transition outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600 ml-1">Bio / About</label>
                        <textarea name="bio" placeholder="Tell us about yourself..." value={formData.bio} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni transition outline-none min-h-[100px] resize-none" />
                    </div>

                    {/* SINGLE SUBMIT BUTTON */}
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-uni to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? <Loader2 className="animate-spin" /> : <>Save All Changes <Save size={18} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}