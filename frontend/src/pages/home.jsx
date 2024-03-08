import { useNavigate } from "react-router-dom";
import { MenuBar } from "../components";

const HomePage = () => {
    const navigate = useNavigate();
    return (
        <>
            <MenuBar />

            <div className="header">
                <h1>Welcome to Morse</h1>
            </div>

            <button className="home-action-primary" onClick={() => navigate("/morse")}>Start Training</button>
        </>
    )
}

export default HomePage;