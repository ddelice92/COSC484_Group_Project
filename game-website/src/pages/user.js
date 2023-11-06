import React, { useEffect, useState } from "react"
import { useAuth } from '../context/user.context';
import { Navigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import Header from "../components/header"
import axios from 'axios';
import s from '../CSS/user.module.css'

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
            <div id={s.container}>
                <div id={s.main}>
                    <div id={s.main_left}>
                        <h1 class={s.main_headers}>{userData._id}</h1>
                        <button id={s.logoutButton} onClick={handleLogout}>
                            <LogoutIcon />
                            &nbsp;
                            Logout
                        </button>
                    </div>
                    <div id={s.main_right}>
                        <h1 class={s.main_headers}>Statistics</h1>
                        <p class={s.stats}>Total games won: {userData.wins}</p>
                        <p class={s.stats}>Total games played: {userData.played}</p>
                    </div>
                </div>
            </div>
            
        </div>
    )
}