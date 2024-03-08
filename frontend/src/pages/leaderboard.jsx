import { useEffect, useState } from "react";
import { MenuBar } from "../components";
import axios from "axios";
import Cookies from "js-cookie";
import { formatTime } from "../helpers";

const LeaderboardPage = () => {
    const [user, setUser] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [countries, setCountries] = useState([]);

    const [sortOrder, setSortOrder] = useState("desc");
    const [sortField, setSortField] = useState("score");

    const handleSort = (field) => {
        setSortOrder(prev => prev === "asc" ? "desc" : "asc");
        setSortField(field);
    }

    const fetchCountries = async () => {
        const resposne = await axios.get("http://localhost:3000/countries.json");
        return resposne.data;
    }

    const fetchUser = async () => {
		const response = await axios.post(`${process.env.REACT_APP_API}/users/`, { token: Cookies.get("token") });
		return response.data;
	};

    const fetchLeaderboard = async () => {
        const response = await axios.post(`${process.env.REACT_APP_API}/users/leaderboard`, { token: Cookies.get("token") });
        return response.data;
    }

    useEffect(() => {
        let sorted = [...leaderboard].sort((a, b) => {
            if (sortOrder === "asc") {
                if (sortField === "ttc") {
                    return a.ttc - b.ttc;
                } else {
                    return a.score - b.score;
                }
            } else {
                if (sortField === "ttc") {
                    return b.ttc - a.ttc;
                } else {
                    return b.score - a.score;
                }
            }
        });
    
        setLeaderboard(sorted);
    }, [sortOrder, sortField]);

    useEffect(() => {
		fetchUser().then((data) => {
			setUser(data);
		}).catch((e) => setUser(null));

        fetchLeaderboard().then((data) => {
            setLeaderboard(data);
        }).catch((e) => console.log(e));

        fetchCountries().then((data) => {
            setCountries(data);
        }).catch((e) => console.log(e));
	}, []);

    if (!leaderboard || countries.length === 0) {
        return;
    }

    return (
        <>
            <MenuBar user={user} />

            <h1>Leaderboard</h1>

            <table className="leaderboard">
                <thead>
                    <tr>
                        <th style={{flexGrow: 1}}></th>
                        <th style={{flexGrow: 2, textAlign: "left"}}>User</th>
                        <th style={{flexGrow: 1}} onClick={() => handleSort("score")}>Completed {sortField === "score" ? (sortOrder === "asc" ? "^" : "v") : null}</th>
                        <th style={{flexGrow: 1}} onClick={() => handleSort("ttc")}>TTC {sortField === "ttc" ? (sortOrder === "asc" ? "^" : "v") : null}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        leaderboard.map((user, index) => {
                            return (
                                <tr key={`leaderboard-${user.id}`}>
                                    <td style={{flexGrow: 1}}><span>#{index + 1}</span></td>
                                    <td style={{flexGrow: 2, textAlign: "left"}}>{user.username} {user.country ? <img width={20} title={countries.filter(c => c.code === user.country)[0].name} alt={user.country} src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${user.country}.svg`}/> : null}</td>
                                    <td style={{flexGrow: 1}}>{user.score}</td>
                                    <td style={{flexGrow: 1}}>{user.ttc ? formatTime(user.ttc) : "00:00.000"}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default LeaderboardPage;