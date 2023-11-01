import React from "react"
import { useAuth } from '../context/user.context';
import { Navigate } from 'react-router-dom';
import Header from "../components/header"

export default function User() {
    const { token, logout } = useAuth();

    if (!token) {
        // If the user is not authenticated, redirect to the login page.
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            <Header />
            <h1>User</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}