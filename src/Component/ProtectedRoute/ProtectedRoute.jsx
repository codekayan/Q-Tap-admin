import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ role, children }) => {
    const isAuthenticated = () => {
        if (role === 'admin') return !!localStorage.getItem('adminToken');
        if (role === 'client') return !!localStorage.getItem('Token');
        if (role === 'affiliate') return !!localStorage.getItem('affiliateToken');
        return false;
    };

    const redirectPath = role === 'admin' ? '/admin' : role === 'affiliate' ? '/affiliate-login' : '/';

    return isAuthenticated() ? children : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;