// Login.js
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from "../components/header"
import "../CSS/login.css";

export default function Login() {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Sends a post request to /login with username and password which returns token
  const handleSubmit = async (e) => {
      e.preventDefault();
      const request = {
          username: username,
          password: pass
      };

      const response = await axios.post('/login', request).catch(function (error) {console.log(error);});
      if (response) {//If the request is successful then the session token is set in local storage
          const token = response.data.token;
          localStorage.setItem('token', token);
          console.log(token);
          setIsLoggedIn(true);
      } else {
          console.log("failed to login with request: " + request.username);
      }
      
  }

  return (
    <div>
        <Header />
        <body>
            <div id="formContainer">
                <div id="formBox">
                    <h1>
                        Login
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <label for="text">Username</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username"></input>
                        <label for="password">Password</label>
                        <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" id="password" name="password"></input>
                        <button type="submit" id="button">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/signup" className='link'>Signup</Link></p>
                </div> 
            </div>
        </body>
    </div>
  );
}
