import Cookies from "js-cookie";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuBar = ({ user }) => {
    const [menu, setMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/login');
    }

    return (
        <>
            <div className="menubar">
                <div className="left">
                    <div onClick={() => setMenu(prev => !prev)} className="hamburger"><i className="fa-solid fa-bars fa-lg"></i></div>
                    <h1>Morse</h1>
                </div>


                <div className="buttons">
                    {!user ?
                        <>
                            <button onClick={() => navigate("/register")}>Register</button>
                            <button onClick={() => navigate("/login")}>Login</button>
                        </> :
                        null
                    }
                </div>
            </div>

            {menu &&
                <div className="menu">
                    <div className="menu-item" onClick={() => {navigate("/morse");setMenu(prev => !prev)}}><i className="fa-solid fa-otter"></i>&nbsp;Morse</div>
                    <div className="menu-item" onClick={() => {navigate("/leaderboard");setMenu(prev => !prev)}}><i className="fa-solid fa-trophy"></i>&nbsp;Leaderboard</div>
                    <div className="menu-item" onClick={() => {navigate("/account");setMenu(prev => !prev)}}><i className="fa-solid fa-user"></i>&nbsp;Account</div>
                    <div className="menu-item" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>&nbsp;Log out</div>
                </div>
            }
        </>
    )
}

export default MenuBar;