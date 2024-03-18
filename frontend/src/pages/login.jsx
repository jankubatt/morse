import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
        }

        axios.post(`${process.env.REACT_APP_API}/users/login`, data)
            .then((res) => {
                document.cookie = `token=${res.data}`;
                navigate('/morse');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="center">
            <h1>Morse Code Trainer</h1>

            <form onSubmit={register}>
                <input type="text" name="username" placeholder="Username" />
                <input type="password" name="password" placeholder="Password" />
                <input type="submit" value="Login" />

                
            </form>
            <div className="underform">
                    <b>New?</b> <a href="/register">Sign up - and start practicing</a>
                </div>
            
        </div>
    );
}

export default LoginPage;