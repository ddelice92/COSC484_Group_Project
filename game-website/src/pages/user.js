import React, { useEffect, useState } from "react"
import { useAuth } from '../context/user.context';
import { Navigate } from 'react-router-dom';
import Header from "../components/header"
import axios from 'axios';

export default function User() {
    const { token, logout } = useAuth();
    const [userData, setUserData] = useState({});

    const fetchData = async () => {

        const response = await axios.post('/getuserdata', {
            token
        });
        setUserData(response.data.data);

    }

    useEffect(() => {
        fetchData()
    },[])

    useEffect(() => {
        console.log(userData);
    }, [userData]);

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
            <h1>Username: {userData._id}</h1>
            <h1>Total games won: {userData.wins}</h1>
            <h1>Total games played: {userData.played}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}