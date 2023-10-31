import { Link } from "react-router-dom"
import Header from "../components/header"

export default function Signup() {
    return (
        <div>
            <Header />
            <body>
                <div id="formContainer">
                    <div id="formBox">
                        <h1>
                            Signup
                        </h1>
                        <form>
                            <label for="text">Username</label>
                            <input type="text" id="username" name="username"></input>

                            <label for="password">Password</label>
                            <input type="password" id="password" name="password"></input>

                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword"></input>

                            <button type="submit" id="button">Signup</button>
                        </form>
                        <p>Have an account already? <Link to="/login" className='link'>Login</Link></p>
                    </div> 
                </div>
            </body>
        </div>
    )
}