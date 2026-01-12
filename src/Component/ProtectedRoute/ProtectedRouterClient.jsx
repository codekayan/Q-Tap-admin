import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteClient = ({ allowedRoles,redirectPath, children }) => {
    const isAuthenticated = () => {


        try {
            const userDataString = localStorage.getItem('UserData');
            const userData = JSON.parse(userDataString)
            return userData?.user.user_type === "qtap_clients" &&  allowedRoles.includes(userData?.user.role)
        } catch (error) {
            return false
        }


    };


    return isAuthenticated() ? children : <Navigate to={redirectPath} replace />;
};

export default ProtectedRouteClient;