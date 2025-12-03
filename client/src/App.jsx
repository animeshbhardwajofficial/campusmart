import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostItem from './pages/PostItem';
import Chat from './pages/Chat';
import Wishlist from './pages/Wishlist';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      {/* 1. Router must be OUTSIDE SocketProvider so Context can use useLocation() */}
      <BrowserRouter>
        <SocketProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/sell" element={
                  <ProtectedRoute><PostItem /></ProtectedRoute>
              } />
               <Route path="/chat" element={
                  <ProtectedRoute><Chat /></ProtectedRoute>
              } />

              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            </Routes>
            <Toaster position="bottom-right" />
          </div>
        </SocketProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;