import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UploadCloud, DollarSign, Type, AlignLeft, Tag, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function PostItem() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Smart URL Fix
    const API_URL = `http://${window.location.hostname}:5000/api/items`;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Books',
        condition: 'Used',
    });
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        // Create preview URLs
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length === 0) return toast.error("Please upload at least one image");
        
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('condition', formData.condition);

        for (let i = 0; i < files.length; i++) {
            data.append('images', files[i]);
        }

        try {
            await axios.post(API_URL, data, {
                headers: {
                    'auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Item listed successfully!');
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to list item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 flex items-center justify-center bg-[#F9FAFB] px-4">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-glass border border-white/60 w-full max-w-2xl animate-fade-in-up">
                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Sell an Item</h2>
                    <p className="text-gray-500 mt-2 text-sm">Turn your stuff into cash on CampusMart</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Title & Price Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <Type className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                            <input name="title" placeholder="Item Title" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                        </div>
                        <div className="relative group">
                            <DollarSign className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-green-500 transition" size={20} />
                            <input name="price" type="number" placeholder="Price" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 font-medium" required />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="relative group">
                        <AlignLeft className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-uni transition" size={20} />
                        <textarea name="description" placeholder="Description (Condition, details...)" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni focus:bg-white transition outline-none placeholder-gray-400 min-h-[100px] font-medium resize-none" required />
                    </div>

                    {/* Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Tag className="absolute left-3 top-3.5 text-gray-400" size={20} />
                            <select name="category" onChange={handleChange} className="w-full pl-10 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni transition outline-none text-gray-700 font-medium appearance-none cursor-pointer">
                                <option value="Books">Books</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="relative">
                            <div className="absolute left-3 top-3.5 text-gray-400 font-bold text-xs bg-gray-200 px-1 rounded">Cond</div>
                            <select name="condition" onChange={handleChange} className="w-full pl-12 p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-uni/20 focus:border-uni transition outline-none text-gray-700 font-medium appearance-none cursor-pointer">
                                <option value="Used">Used</option>
                                <option value="Like New">Like New</option>
                                <option value="New">New</option>
                                <option value="Damaged">Damaged</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 p-6 rounded-2xl text-center cursor-pointer hover:bg-gray-50 hover:border-uni/50 transition group relative overflow-hidden">
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        
                        {previewUrls.length > 0 ? (
                            <div className="flex gap-2 overflow-x-auto pb-2 relative z-10">
                                {previewUrls.map((url, index) => (
                                    <img key={index} src={url} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm" />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-uni transition">
                                <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-indigo-50 transition">
                                    <UploadCloud size={32} />
                                </div>
                                <p className="font-medium">Click to upload photos</p>
                                <p className="text-xs mt-1">Max 4 images</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button disabled={loading} className="w-full bg-gradient-to-r from-uni to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? <Loader2 className="animate-spin" /> : <>Post Item <ImageIcon size={20} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}