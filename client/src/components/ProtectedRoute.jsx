import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    // 1. If still loading, show nothing (or a spinner)
    if (loading) {
        return <div className="p-4 text-center">Loading...</div>; 
    }

    // 2. If finished loading and no user, redirect
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. If user exists, show page
    return children;
};