import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [countries, setCountries] = useState([]);

    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');

    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            email: formData.get('email'),
            country: formData.get('country')
        }

        if (!data.username || !data.password) {
            setAlert(true);
            setAlertText('Please fill in all the fields');
            return;
        }

        if (data.password.length < 8) {
            setAlert(true);
            setAlertText('Password must be at least 8 characters long');
            return;
        }

        if (data.password > 255 || data.username > 255 || data.email > 255) {
            setAlert(true);
            setAlertText('Username, password and email must be less than 255 characters long');
            return;
        }

        axios.post(`${process.env.REACT_APP_API}/users/register`, data)
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.log(error);

                if (error.response.status === 400) {
                    setAlert(true);
                    setAlertText('Username already exists');
                    return;
                }
            });
    }

    useEffect(() => {
        fetch('/countries.json')
            .then(response => response.json())
            .then(json => {
                setCountries(json)
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Register Page</h1>

            {alert && <div className="alert">
                <p className="alert-texxt">{alertText}</p>
            </div>}

            <form onSubmit={register}>
                <label>
                    Username:<span className="asterisk">*</span>
                    <input type="text" name="username" />
                </label>
                <label>
                    Password:<span className="asterisk">*</span>
                    <input type="password" name="password" />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" />
                </label>
                <label>
                    Country:
                    <select defaultValue={"null"} name="country">
                        <option value="null">No country</option>
                        {
                            countries.map((country, index) => {
                                return <option key={index} value={country.code}>{country.name}</option>
                            })
                        }
                    </select>
                </label>
                <input type="submit" value="Register" />
            </form>
        </div>
    );
}

export default RegisterPage;