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
        <div>
            <h1>Login Page</h1>

            <form onSubmit={register}>
                <label>
                    Username:
                    <input type="text" name="username" />
                </label>
                <label>
                    Password:
                    <input type="password" name="password" />
                </label>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}

export default LoginPage;