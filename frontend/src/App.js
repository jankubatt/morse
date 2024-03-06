import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MorsePage, RegisterPage, LoginPage } from "./pages";

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
