import { useEffect, useState } from "react";
import { MenuBar } from "../components";
import axios from "axios";
import Cookies from "js-cookie";
import { formatTime } from "../helpers";

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [countries, setCountries] = useState([]);
    const [alert, setAlert] = useState(false);
    const [alertText, setAlertText] = useState('');

    const fetchCountries = async () => {
        const resposne = await axios.get("http://localhost:3000/countries.json");
        return resposne.data;
    }

    const fetchUser = async () => {
        const response = await axios.post(`${process.env.REACT_APP_API}/users/`, { token: Cookies.get("token") });
        return response.data;
    };

    const handleEdit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            country: formData.get('country')
        }

        if (!data.username) {
            setAlert(true);
            setAlertText('Please fill in all the fields');
            return;
        }

        if (data.username > 255 || data.email > 255) {
            setAlert(true);
            setAlertText('Username, password and email must be less than 255 characters long');
            return;
        }

        axios.post(`${process.env.REACT_APP_API}/users/edit`, data)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const handlePasswordChange = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = {
            password: formData.get('password'),
            passwordAgain: formData.get('passwordAgain'),
            id_user: user.id
        }

        if (!data.password || !data.passwordAgain) {
            setAlert(true);
            setAlertText('Please fill in all the fields');
            return;
        }

        if (data.password.length < 8) {
            setAlert(true);
            setAlertText('Password must be at least 8 characters long');
            return;
        }

        if (data.password > 255) {
            setAlert(true);
            setAlertText('Password must be less than 255 characters long');
            return;
        }

        if (data.password !== data.passwordAgain) {
            setAlert(true);
            setAlertText('Passwords do not match');
            return;
        }

        axios.post(`${process.env.REACT_APP_API}/users/password/change`, data)
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchUser().then((data) => {
            setUser(data);
        }).catch((e) => setUser(null));

        fetch('/countries.json')
            .then(response => response.json())
            .then(json => {
                setCountries(json)
            })
            .catch(error => console.error('Error:', error));
    }, []);

    if (!user || countries.length === 0) {
        return;
    }

    return (
        <>
            <MenuBar user={user} />

            <h1>Account</h1>

            {alert && <div className="alert">
                <p className="alert-text">{alertText}</p>
            </div>}

            <div className="center">
                <form onSubmit={handleEdit}>
                    <input type="text" name="username" placeholder="Username" defaultValue={user?.username} />
                    <input type="email" name="email" placeholder="Email" defaultValue={user?.email} />
                    <select defaultValue={user.country} name="country">
                        <option value="null">No country</option>
                        {
                            countries.map((country, index) => {
                                return <option key={index} value={country.code}>{country.name}</option>
                            })
                        }
                    </select>
                    <input type="submit" value="Update" />
                </form>

                <h2>Change password</h2>

                <form onSubmit={handlePasswordChange}>
                    <input type="password" name="password" placeholder="Password" />
                    <input type="password" name="passwordAgain" placeholder="Password again" />
                    <input type="submit" value="Change password" />
                </form>
            </div>

        </>
    )
}

export default AccountPage;