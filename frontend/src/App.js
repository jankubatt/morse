import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MorsePage, RegisterPage } from "./pages";
import LoginPage from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      	<Routes>
			<Route path="/" element={<MorsePage />} />
			<Route path="/register" element={<RegisterPage />} />
			<Route path="/login" element={<LoginPage />} />
		</Routes>
    </BrowserRouter>
  );
}

export default App;
