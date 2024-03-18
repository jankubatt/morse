import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MorsePage, RegisterPage, LoginPage, HomePage, LeaderboardPage, AccountPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      	<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/morse" element={<MorsePage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/login" element={<LoginPage />} />
			<Route path="/leaderboard" element={<LeaderboardPage />} />
			<Route path="/account" element={<AccountPage />} />
		</Routes>
    </BrowserRouter>
  );
}

export default App;
