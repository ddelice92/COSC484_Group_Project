import React, { useState } from "react"
import Header from "../components/header"
import "../App.css"
import "../CSS/login.css";

export default function Login() {
    const [username, setUsername] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username);
    }

    return (
        <div>
            <Header />
            <body>
                <div id="formContainer">
                    <div id="formBox">
                        <p>
                            Login
                        </p>
                        <form onSubmit={handleSubmit}>
                            <label for="text">Username</label>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username"></input>
                            <label for="password">Password</label>
                            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" id="password" name="password"></input>
                            <button type="submit" id="loginButton">Login</button>
                        </form>
                    </div> 
                </div>
            </body>
        </div>
    )
}