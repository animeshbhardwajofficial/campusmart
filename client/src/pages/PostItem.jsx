import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

export default function PostItem() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Books',
        condition: 'Used',
    });
    const [files, setFiles] = useState([]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setFiles(e.target.files);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // We must use FormData because we are sending Files
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
            await axios.post('http://10.79.66.93:5000/api/items', data, {
                headers: {
                    'auth-token': token, // Verify the user
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Item listed successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to list item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4 h-fit">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Upload size={24} /> Sell an Item
                </h2>

                <input name="title" placeholder="Item Title (e.g., Engineering Mathematics)" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                
                <textarea name="description" placeholder="Description (Condition, details...)" onChange={handleChange} className="w-full p-3 border rounded-lg h-24" required />

                <div className="flex gap-4">
                    <input name="price" type="number" placeholder="Price ($)" onChange={handleChange} className="w-1/2 p-3 border rounded-lg" required />
                    <select name="condition" onChange={handleChange} className="w-1/2 p-3 border rounded-lg">
                        <option value="Used">Used</option>
                        <option value="Like New">Like New</option>
                        <option value="New">New</option>
                        <option value="Damaged">Damaged</option>
                    </select>
                </div>

                <select name="category" onChange={handleChange} className="w-full p-3 border rounded-lg">
                    <option value="Books">Books</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                </select>

                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                    <label className="cursor-pointer">
                        <span className="text-gray-500">Click to upload photos (Max 4)</span>
                        <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
                {files.length > 0 && <p className="text-sm text-green-600">{files.length} file(s) selected</p>}

                <button disabled={loading} className={`w-full text-white py-3 rounded-lg font-bold transition ${loading ? 'bg-gray-400' : 'bg-uni hover:bg-uniDark'}`}>
                    {loading ? 'Uploading...' : 'Post Item'}
                </button>
            </form>
        </div>
    );
}