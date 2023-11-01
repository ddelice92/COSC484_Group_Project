// Login.js
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from "../components/header"
import { useAuth } from '../context/user.context';
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/login.css";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    

    const redirect = () => {
        const redirectTo = location.search.replace("?redirectTo=", "");
        navigate(redirectTo ? redirectTo : "/user");
    }

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the form from submitting the traditional way.

        try {
        const response = await axios.post('/login', {
            username,
            password,
        });

        if (response.data.token) {
            login(response.data.token);
            redirect();
        } 
        else {
        }
        } 
        catch (error) {
            console.error(error);
        }
    };

  return (
    <div>
        <Header />
        <body>
            <div id="formContainer">
                <div id="formBox">
                    <h1>
                        Login
                    </h1>
                    <form onSubmit={handleLogin}>
                        <label for="text">Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username"></input>
                        <label for="password">Password</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password"></input>
                        <button type="submit" id="button">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/signup" className='link'>Signup</Link></p>
                </div> 
            </div>
        </body>
    </div>
  );
}
